'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Shield, CreditCard, Mail, Bell, Sparkles, GitBranch, Activity } from 'lucide-react'

interface Prefs {
  email_security: boolean; email_billing: boolean; email_invites: boolean; email_product: boolean
  inapp_security: boolean; inapp_billing: boolean; inapp_ai: boolean; inapp_decisions: boolean; inapp_system: boolean
}

interface Props { prefs: Prefs | null; userId: string }

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none',
        checked ? 'bg-brand-600' : 'bg-[var(--muted)]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span className={cn(
        'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out mt-0.5',
        checked ? 'translate-x-5' : 'translate-x-0.5'
      )} />
    </button>
  )
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
        {sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
      </div>
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)]">
        {children}
      </div>
    </div>
  )
}

function PrefRow({ Icon, label, sub, checked, onChange, locked }: {
  Icon: React.ElementType; label: string; sub: string
  checked: boolean; onChange: (v: boolean) => void; locked?: boolean
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[var(--muted-foreground)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
          {locked && (
            <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Required</span>
          )}
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">{sub}</p>
      </div>
      <Toggle checked={checked || !!locked} onChange={onChange} disabled={!!locked} />
    </div>
  )
}

export function NotificationPrefsForm({ prefs: initial, userId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [prefs, setPrefs] = useState<Prefs>(initial ?? {
    email_security: true, email_billing: true, email_invites: true, email_product: false,
    inapp_security: true, inapp_billing: true, inapp_ai: true, inapp_decisions: true, inapp_system: true,
  })

  const update = (key: keyof Prefs, value: boolean) => {
    const next = { ...prefs, [key]: value }
    setPrefs(next)
    startTransition(async () => {
      const sb = createClient()
      const { error } = await sb.from('notification_preferences').upsert({ user_id: userId, ...next })
      if (error) toast.error(error.message)
      else toast.success('Preferences saved')
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Notifications</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Choose which notifications you receive and how.</p>
      </div>

      <Section title="Email notifications" sub="Sent to your registered email address.">
        <PrefRow Icon={Shield}     label="Security alerts"    sub="New device logins, suspicious activity, account changes." checked={prefs.email_security}  onChange={(v) => update('email_security', v)}  locked />
        <PrefRow Icon={CreditCard} label="Billing updates"    sub="Payment receipts, subscription changes, invoice reminders." checked={prefs.email_billing}   onChange={(v) => update('email_billing', v)}   locked />
        <PrefRow Icon={Mail}       label="Workspace invites"  sub="When someone invites you to join an organization." checked={prefs.email_invites}   onChange={(v) => update('email_invites', v)}   locked />
        <PrefRow Icon={Bell}       label="Product updates"    sub="New features, tips, and product announcements." checked={prefs.email_product}   onChange={(v) => update('email_product', v)} />
      </Section>

      <Section title="In-app notifications" sub="Shown in the notification bell inside the dashboard.">
        <PrefRow Icon={Shield}     label="Security"           sub="Login alerts and account security events." checked={prefs.inapp_security}  onChange={(v) => update('inapp_security', v)} />
        <PrefRow Icon={CreditCard} label="Billing"            sub="Payment status and subscription updates." checked={prefs.inapp_billing}   onChange={(v) => update('inapp_billing', v)} />
        <PrefRow Icon={Sparkles}   label="AI insights"        sub="When AI generates new assumptions or insights." checked={prefs.inapp_ai}        onChange={(v) => update('inapp_ai', v)} />
        <PrefRow Icon={GitBranch}  label="Decisions"          sub="Updates to decisions you're involved in." checked={prefs.inapp_decisions} onChange={(v) => update('inapp_decisions', v)} />
        <PrefRow Icon={Activity}   label="System"             sub="Workspace events, member activity, system updates." checked={prefs.inapp_system}    onChange={(v) => update('inapp_system', v)} />
      </Section>

      <p className="text-xs text-[var(--muted-foreground)] px-1">
        Security and billing email notifications are always sent and cannot be disabled.
        This ensures you never miss critical account events.
      </p>
    </div>
  )
}
