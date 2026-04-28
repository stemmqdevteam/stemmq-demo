'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Monitor, Smartphone, Tablet, Globe, Clock,
  MapPin, CheckCircle2, Key, RefreshCw, Trash2,
  Lock, Unlock, ChevronDown, ChevronUp, Wifi,
} from 'lucide-react'
import { cn, formatDate, formatRelativeTime } from '@/lib/utils'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface Session {
  id: string; browser: string | null; os: string | null
  device_name: string | null; device_type: string
  ip_address: string | null; location: string | null
  is_current: boolean; is_trusted: boolean; is_primary: boolean; is_revoked: boolean
  last_active_at: string; created_at: string
}

interface LoginEvent { id: string; title: string; body: string | null; created_at: string }

interface Props {
  user: { id: string; email: string; created_at: string }
  sessions: Session[]
  loginHistory: LoginEvent[]
}

function DeviceIcon({ type, trusted, current }: { type: string; trusted: boolean; current: boolean }) {
  const Icon = type === 'mobile' ? Smartphone : type === 'tablet' ? Tablet : Monitor
  return (
    <div className={cn(
      'relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
      current ? 'bg-brand-50 dark:bg-brand-950/50' :
      trusted ? 'bg-emerald-50 dark:bg-emerald-950/30' :
                'bg-[var(--muted)]'
    )}>
      <Icon className={cn('w-5 h-5',
        current ? 'text-brand-600 dark:text-brand-400' :
        trusted ? 'text-emerald-600 dark:text-emerald-400' :
                  'text-[var(--muted-foreground)]'
      )} />
      {current && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />}
    </div>
  )
}

function SessionCard({ session, onRevoke, onTrust, onRemoveTrust }: {
  session: Session
  onRevoke: (id: string) => void
  onTrust: (id: string) => void
  onRemoveTrust: (id: string) => void
}) {
  const [expanded, setExpanded]      = useState(session.is_current)
  const [isPending, startTransition] = useTransition()
  const deviceLabel = [session.browser, session.os].filter(Boolean).join(' on ') || 'Unknown device'

  return (
    <div className={cn(
      'bg-[var(--card)] rounded-2xl border overflow-hidden',
      session.is_current ? 'border-brand-200 dark:border-brand-800' :
      session.is_trusted  ? 'border-emerald-100 dark:border-emerald-900/50' :
                            'border-[var(--border)]'
    )}>
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpanded((v) => !v)}>
        <DeviceIcon type={session.device_type} trusted={session.is_trusted} current={session.is_current} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-sm font-semibold truncate">{session.device_name ?? deviceLabel}</p>
            {session.is_current && (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active now
              </span>
            )}
            {session.is_primary && <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 uppercase tracking-wide">Primary</span>}
            {session.is_trusted && <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 uppercase tracking-wide flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" />Trusted</span>}
          </div>
          <p className="text-xs text-[var(--muted-foreground)] truncate">{deviceLabel}{session.location ? ` · ${session.location}` : ''}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Last active {formatRelativeTime(session.last_active_at)}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!session.is_current && !session.is_revoked && (
            <button onClick={(e) => { e.stopPropagation(); onRevoke(session.id) }} disabled={isPending}
              className="text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-lg transition-all">
              Revoke
            </button>
          )}
          <button className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-all">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-[var(--border)]">
              <div className="grid sm:grid-cols-2 gap-3 mt-4 mb-5">
                {[
                  { Icon: Globe,   label: 'IP address', value: session.ip_address ?? '—' },
                  { Icon: MapPin,  label: 'Location',   value: session.location   ?? '—' },
                  { Icon: Monitor, label: 'Browser',    value: session.browser    ?? '—' },
                  { Icon: Key,     label: 'OS',         value: session.os         ?? '—' },
                  { Icon: Clock,   label: 'First seen', value: formatDate(session.created_at) },
                  { Icon: Wifi,    label: 'Last active',value: formatRelativeTime(session.last_active_at) },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wide font-semibold">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!session.is_current && (
                <div className="flex flex-wrap gap-2">
                  {session.is_trusted ? (
                    <button onClick={() => onRemoveTrust(session.id)}
                      className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 px-3.5 py-2 rounded-xl transition-all">
                      <Unlock className="w-3.5 h-3.5" />Remove trust
                    </button>
                  ) : (
                    <button onClick={() => onTrust(session.id)}
                      className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-3.5 py-2 rounded-xl transition-all">
                      <CheckCircle2 className="w-3.5 h-3.5" />Mark as trusted
                    </button>
                  )}
                  {!session.is_revoked && (
                    <button onClick={() => onRevoke(session.id)}
                      className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 px-3.5 py-2 rounded-xl transition-all">
                      <Trash2 className="w-3.5 h-3.5" />Revoke access
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SecurityView({ user, sessions: initial, loginHistory }: Props) {
  const [sessions, setSessions]      = useState(initial)
  const [isPending, startTransition] = useTransition()

  const active   = sessions.filter((s) => !s.is_revoked)
  const trusted  = active.filter((s) => s.is_trusted).length
  const score    = Math.min(60 + (active.length <= 3 ? 10 : 0) + (trusted > 0 ? 15 : 0) + 15, 100)

  const revoke = (id: string) => {
    setSessions((p) => p.map((s) => s.id === id ? { ...s, is_revoked: true } : s))
    startTransition(async () => {
      const sb = createClient()
      const { error } = await sb.from('sessions').update({ is_revoked: true, revoked_at: new Date().toISOString() }).eq('id', id)
      if (error) toast.error(error.message); else toast.success('Session revoked')
    })
  }

  const trust = (id: string) => {
    setSessions((p) => p.map((s) => s.id === id ? { ...s, is_trusted: true } : s))
    startTransition(async () => {
      await createClient().from('sessions').update({ is_trusted: true }).eq('id', id)
      toast.success('Device marked as trusted')
    })
  }

  const removeTrust = (id: string) => {
    setSessions((p) => p.map((s) => s.id === id ? { ...s, is_trusted: false } : s))
    startTransition(async () => {
      await createClient().from('sessions').update({ is_trusted: false }).eq('id', id)
      toast.success('Trust removed')
    })
  }

  const revokeAll = () => {
    if (!confirm('Revoke all other sessions? You stay logged in here.')) return
    startTransition(async () => {
      const sb = createClient()
      const others = active.filter((s) => !s.is_current)
      for (const s of others) await sb.from('sessions').update({ is_revoked: true, revoked_at: new Date().toISOString() }).eq('id', s.id)
      setSessions((p) => p.map((s) => s.is_current ? s : { ...s, is_revoked: true }))
      toast.success('All other sessions revoked')
    })
  }

  return (
    <motion.div className="space-y-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Security</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Manage your sessions, trusted devices, and account security.</p>
      </div>

      {/* Score */}
      <div className="bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/20 dark:to-purple-950/20 border border-brand-100 dark:border-brand-900/50 rounded-2xl p-6 flex items-center gap-6">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-brand-100 dark:text-brand-900" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6"
              strokeDasharray={`${(score / 100) * 213.6} 213.6`}
              className={score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-brand-500' : 'text-amber-500'}
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{score}</span>
            <span className="text-[9px] text-[var(--muted-foreground)] uppercase tracking-wide">score</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm mb-2">{score >= 80 ? 'Account is well protected' : score >= 60 ? 'Security is fair' : 'Action recommended'}</p>
          <div className="space-y-1.5">
            {[
              { ok: true,            label: 'Passwordless authentication' },
              { ok: active.length <= 3, label: `${active.length} active session${active.length !== 1 ? 's' : ''}` },
              { ok: trusted > 0,     label: trusted > 0 ? `${trusted} trusted device${trusted !== 1 ? 's' : ''}` : 'No trusted devices' },
            ].map(({ ok, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={cn('w-1.5 h-1.5 rounded-full', ok ? 'bg-emerald-500' : 'bg-amber-500')} />
                <span className={cn('text-xs', ok ? 'text-[var(--muted-foreground)]' : 'text-amber-700 dark:text-amber-400')}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <Shield className="w-10 h-10 text-brand-300 dark:text-brand-700 flex-shrink-0 hidden sm:block" />
      </div>

      {/* Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">Active sessions</h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{active.length} device{active.length !== 1 ? 's' : ''} signed in</p>
          </div>
          {active.filter((s) => !s.is_current).length > 0 && (
            <button onClick={revokeAll} disabled={isPending}
              className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 px-3.5 py-2 rounded-xl transition-all">
              {isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              Revoke all others
            </button>
          )}
        </div>

        {active.length === 0 ? (
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] px-5 py-10 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">No active sessions.</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Session records are created on login.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((s) => (
              <SessionCard key={s.id} session={s} onRevoke={revoke} onTrust={trust} onRemoveTrust={removeTrust} />
            ))}
          </div>
        )}
      </div>

      {/* Login history */}
      <div>
        <h2 className="text-sm font-semibold mb-4">Sign-in activity</h2>
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
          {loginHistory.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-[var(--foreground)] dark:text-[var(--muted-foreground)]" />
              <p className="text-sm text-[var(--muted-foreground)]">No login history yet.</p>
            </div>
          ) : loginHistory.map((n) => (
            <div key={n.id} className="flex items-start gap-3 px-5 py-4 border-b border-[var(--border)] last:border-0">
              <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-[var(--muted-foreground)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                {n.body && <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">{n.body}</p>}
              </div>
              <span className="text-[11px] text-[var(--muted-foreground)] flex-shrink-0">{formatRelativeTime(n.created_at)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div>
        <h2 className="text-sm font-semibold mb-4">Account</h2>
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)]">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center"><Key className="w-4 h-4 text-[var(--muted-foreground)]" /></div>
              <div><p className="text-sm font-medium">Email</p><p className="text-xs text-[var(--muted-foreground)]">{user.email}</p></div>
            </div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Verified</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center"><Lock className="w-4 h-4 text-[var(--muted-foreground)]" /></div>
              <div><p className="text-sm font-medium">Authentication</p><p className="text-xs text-[var(--muted-foreground)]">Magic link + Google OAuth</p></div>
            </div>
            <span className="text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full">Passwordless ✓</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
