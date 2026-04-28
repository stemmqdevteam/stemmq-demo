import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/constants'
import { MembersManager } from '@/features/organizations/components/members-manager'

export const metadata: Metadata = { title: 'Team Members' }

export default async function MembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: membership } = await supabase
    .from('org_members')
    .select('org_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!membership) redirect(ROUTES.login)

  const orgId = membership.org_id
  const isAdmin = ['owner', 'admin'].includes(membership.role)

  // Load members with profiles
  const { data: members } = await supabase
    .from('org_members')
    .select('id, user_id, role, joined_at, user_profiles(full_name, avatar_url, job_title)')
    .eq('org_id', orgId)
    .order('joined_at', { ascending: true })

  const normalizedMembers = (members ?? []).map((member: any) => ({
    ...member,
    user_profiles: Array.isArray(member.user_profiles)
      ? member.user_profiles[0] ?? null
      : member.user_profiles ?? null,
  }))

  // Load pending invitations
  const { data: invitations } = await supabase
    .from('invitations')
    .select('id, email, role, created_at, expires_at, status')
    .eq('org_id', orgId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  // Load subscription to check seat limits
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, seats')
    .eq('org_id', orgId)
    .single()

  return (
    <MembersManager
      orgId={orgId}
      currentUserId={user.id}
      currentUserRole={membership.role}
      isAdmin={isAdmin}
      members={normalizedMembers}
      invitations={invitations ?? []}
      plan={subscription?.plan ?? 'free'}
    />
  )
}
