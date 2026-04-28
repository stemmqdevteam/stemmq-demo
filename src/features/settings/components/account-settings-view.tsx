'use client'

import { useState } from 'react'
import { Mail, AlertTriangle, Calendar, Trash2 } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface Props { email: string; createdAt: string }

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[var(--border)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
        {sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
      </div>
      <p className="text-sm text-[var(--foreground)] font-medium">{value}</p>
    </div>
  )
}

export function AccountSettingsView({ email, createdAt }: Props) {
  const [confirm, setConfirm] = useState('')

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Account</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Manage your account details and preferences.</p>
      </div>

      {/* Account info */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[var(--muted-foreground)]" /> Account information
        </h2>
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] px-5">
          <Row label="Email address" value={email} sub="Used for login and notifications" />
          <Row label="Authentication" value="Passwordless" sub="Magic link / Google OAuth" />
          <Row label="Member since" value={formatDate(createdAt)} />
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-3 px-1">
          To change your email address, contact <a href="mailto:support@stemmq.com" className="text-brand-600 dark:text-brand-400 hover:underline">support@stemmq.com</a>.
        </p>
      </div>

      {/* Danger zone */}
      <div>
        <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger zone
        </h2>
        <div className="bg-[var(--card)] rounded-2xl border border-red-200 dark:border-red-900/60 overflow-hidden">
          <div className="px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)] mb-1">Delete account</p>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed max-w-sm">
                  Permanently delete your account and all associated data. This action cannot be undone.
                  Your organization and all decisions will be deleted.
                </p>
              </div>
              <button
                onClick={() => toast.error('Contact support@stemmq.com to delete your account.')}
                className="flex-shrink-0 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 px-4 py-2.5 rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete account
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-2 px-1">
          Account deletion requires identity verification. Contact support to proceed.
        </p>
      </div>
    </div>
  )
}
