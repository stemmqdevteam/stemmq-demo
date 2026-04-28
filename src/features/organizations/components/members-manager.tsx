'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  UserPlus, Mail, MoreHorizontal, Crown, Shield,
  User, Eye, Trash2, Clock, Lock, Sparkles,
} from 'lucide-react'
import {
  inviteMember, revokeInvitation, removeMember, updateMemberRole,
} from '@/features/organizations/actions'
import { inviteMemberSchema, type InviteMemberInput } from '@/lib/validations/organization'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Avatar, Badge, EmptyState, Input, Select } from '@/components/ui'
import { buttonClass } from '@/components/ui/button'
import { cn, formatRelativeTime } from '@/utils'
import type { OrgRole, PlanType } from '@/types'
import Link from 'next/link'
import { ROUTES } from '@/constants'

const ROLE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  owner:  { label: 'Owner',  icon: Crown,  color: 'text-amber-500' },
  admin:  { label: 'Admin',  icon: Shield, color: 'text-brand-500' },
  member: { label: 'Member', icon: User,   color: 'text-surface-500' },
  viewer: { label: 'Viewer', icon: Eye,    color: 'text-surface-400' },
}

interface Member {
  id: string
  user_id: string
  role: string
  joined_at: string
  user_profiles: { full_name: string | null; avatar_url: string | null; job_title: string | null } | null
}

interface Invitation {
  id: string
  email: string
  role: string
  created_at: string
  expires_at: string
  status: string
}

interface Props {
  orgId: string
  currentUserId: string
  currentUserRole: string
  isAdmin: boolean
  members: Member[]
  invitations: Invitation[]
  plan: PlanType
}

const FREE_SEAT_LIMIT = 1
const PRO_SEAT_LIMIT  = 10

export function MembersManager({
  orgId, currentUserId, currentUserRole, isAdmin,
  members, invitations, plan,
}: Props) {
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const seatLimit = plan === 'free' ? FREE_SEAT_LIMIT : plan === 'pro' ? PRO_SEAT_LIMIT : null
  const totalSeats = members.length + invitations.length
  const atLimit    = seatLimit !== null && totalSeats >= seatLimit
  const canInvite  = isAdmin && !atLimit

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema as any),
    defaultValues: { email: '', role: 'member' },
  })

  const onInvite = (values: InviteMemberInput) => {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('email', values.email)
      fd.set('role', values.role)
      const result = await inviteMember(orgId, fd)
      if (result.success) {
        toast.success(`Invitation sent to ${values.email}`)
        reset()
        setShowInviteForm(false)
      } else {
        toast.error(result.error ?? 'Failed to invite')
      }
    })
  }

  const handleRemove = (memberId: string, name: string) => {
    if (!confirm(`Remove ${name} from this workspace?`)) return
    startTransition(async () => {
      const result = await removeMember(orgId, memberId)
      if (result.success) toast.success('Member removed')
      else toast.error(result.error ?? 'Failed')
      setOpenMenuId(null)
    })
  }

  const handleRoleChange = (memberId: string, role: OrgRole) => {
    startTransition(async () => {
      const result = await updateMemberRole(orgId, memberId, role as 'admin' | 'member' | 'viewer')
      if (result.success) toast.success('Role updated')
      else toast.error(result.error ?? 'Failed')
      setOpenMenuId(null)
    })
  }

  const handleRevokeInvite = (invId: string, email: string) => {
    startTransition(async () => {
      const result = await revokeInvitation(invId)
      if (result.success) toast.success(`Invitation to ${email} revoked`)
      else toast.error(result.error ?? 'Failed')
    })
  }

  return (
    <div className="space-y-6">
      {/* Header + invite button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-surface-500">
            {members.length} member{members.length !== 1 ? 's' : ''}
            {invitations.length > 0 && ` · ${invitations.length} pending`}
            {seatLimit && ` · ${totalSeats}/${seatLimit} seats`}
          </p>
        </div>
        {isAdmin && (
          plan !== 'free' ? (
            <Button
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => setShowInviteForm(v => !v)}
              variant={showInviteForm ? 'secondary' : 'primary'}
            >
              {showInviteForm ? 'Cancel' : 'Invite member'}
            </Button>
          ) : (
            <Link
              href={ROUTES.billing}
              className={cn(buttonClass({ variant: 'outline' }), 'gap-2')}
            >
              <Lock className="w-4 h-4" />
              Upgrade to invite
            </Link>
          )
        )}
      </div>

      {/* Seat limit warning */}
      {atLimit && isAdmin && plan !== 'enterprise' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Seat limit reached</p>
            <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">
              Upgrade to {plan === 'free' ? 'Pro' : 'Enterprise'} to add more members.
            </p>
          </div>
          <Link href={ROUTES.billing} className={buttonClass({ variant: 'primary', size: 'sm' })}>
            Upgrade
          </Link>
        </div>
      )}

      {/* Invite form */}
      <AnimatePresence>
        {showInviteForm && canInvite && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="border-brand-100 dark:border-brand-900/40">
              <h3 className="font-display font-semibold text-sm mb-4">Invite a team member</h3>
              <form onSubmit={handleSubmit(onInvite)} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                    required={undefined} {...field}
                    options={[
                      { value: 'admin', label: 'Admin' },
                      { value: 'member', label: 'Member' },
                      { value: 'viewer', label: 'Viewer' },
                    ]}
                    className="sm:w-36"                    />
                  )}
                />
                <Button type="submit" loading={isPending} leftIcon={<Mail className="w-4 h-4" />}>
                  Send invite
                </Button>
              </form>
              <div className="mt-3 flex gap-4 text-xs text-surface-400">
                <span><strong className="text-surface-600 dark:text-surface-400">Admin</strong> — manage org, members, settings</span>
                <span><strong className="text-surface-600 dark:text-surface-400">Member</strong> — create and edit decisions</span>
                <span><strong className="text-surface-600 dark:text-surface-400">Viewer</strong> — read-only access</span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members list */}
      <Card>
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <h3 className="font-display font-semibold text-sm">Active members</h3>
        </div>

        {members.length === 0 ? (
          <EmptyState icon={<User className="w-8 h-8" />} title="No members yet" />
        ) : (
          <div className="divide-y divide-surface-50 dark:divide-surface-800/60">
            {members.map(member => {
              const profile = member.user_profiles
              const name    = profile?.full_name ?? 'Unknown User'
              const role    = ROLE_CONFIG[member.role] ?? ROLE_CONFIG['member']
              const isMe    = member.user_id === currentUserId
              const canEdit = isAdmin && !isMe && member.role !== 'owner'

              return (
                <div key={member.id} className="flex items-center gap-4 px-5 py-3.5">
                  <Avatar src={profile?.avatar_url} name={name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{name}</p>
                      {isMe && <Badge variant="default">You</Badge>}
                    </div>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {profile?.job_title ?? 'Member'} · Joined {formatRelativeTime(member.joined_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={cn('flex items-center gap-1.5 text-xs font-medium', role?.color)}>
                      {role && <role.icon className="w-3.5 h-3.5" />}
                      {role?.label || 'Member'}
                    </div>

                    {canEdit && (
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                          className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-surface-400" />
                        </button>

                        <AnimatePresence>
                          {openMenuId === member.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-surface-900 rounded-xl border border-surface-100 dark:border-surface-800 shadow-elevated z-20 overflow-hidden"
                            >
                              {(['admin', 'member', 'viewer'] as OrgRole[]).map(r => (
                                <button
                                  key={r}
                                  className={cn(
                                    'w-full text-left px-3 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors flex items-center gap-2',
                                    member.role === r && 'text-brand-600 dark:text-brand-400 font-medium'
                                  )}
                                  onClick={() => handleRoleChange(member.user_id, r)}
                                >
                                  {ROLE_CONFIG[r]?.label}
                                  {member.role === r && <Check className="w-3 h-3 ml-auto" />}
                                </button>
                              ))}
                              <div className="border-t border-surface-100 dark:border-surface-800" />
                              <button
                                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2"
                                onClick={() => handleRemove(member.user_id, name)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove member
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <Card>
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <h3 className="font-display font-semibold text-sm">Pending invitations</h3>
          </div>
          <div className="divide-y divide-surface-50 dark:divide-surface-800/60">
            {invitations.map(inv => (
              <div key={inv.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-9 h-9 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-surface-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{inv.email}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-surface-400">
                    <Clock className="w-3 h-3" />
                    Invited {formatRelativeTime(inv.created_at)} · Expires {formatRelativeTime(inv.expires_at)}
                  </div>
                </div>
                <Badge variant="warning">{inv.role}</Badge>
                {isAdmin && (
                  <button
                    onClick={() => handleRevokeInvite(inv.id, inv.email)}
                    className="text-xs text-surface-400 hover:text-red-600 transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

// Inline Check icon for role menu
function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
