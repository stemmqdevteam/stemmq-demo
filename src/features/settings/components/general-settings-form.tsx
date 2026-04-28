'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useUIStore } from '@/store'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/utils'

interface Props {
  userId:  string
  profile: {
    full_name:    string | null
    avatar_url:   string | null
    job_title:    string | null
    display_name: string | null
    bio:          string | null
    appearance:   string | null
  } | null
  email: string
}

/* Reusable settings section divider */
function Divider() {
  return <div className="h-px bg-[var(--border)] my-8" />
}

/* Section label + optional hint */
function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
      {hint && <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">{hint}</p>}
    </div>
  )
}

export function GeneralSettingsForm({ profile, email, userId }: Props) {
  const setTheme    = useUIStore((s) => s.setTheme)
  const storeTheme  = useUIStore((s) => s.theme)

  const [isPending, startTransition] = useTransition()
  const [fullName,    setFullName]    = useState(profile?.full_name    ?? '')
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [jobTitle,    setJobTitle]    = useState(profile?.job_title    ?? '')
  const [bio,         setBio]         = useState(profile?.bio          ?? '')

  // Map DB appearance value ↔ UIStore theme value
  const dbToTheme = (v: string | null): 'light' | 'dark' | 'system' =>
    v === 'dark' ? 'dark' : v === 'light' ? 'light' : 'system'

  const themeToDb = (t: 'light' | 'dark' | 'system') =>
    t === 'system' ? 'auto' : t

  const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>(
    dbToTheme(profile?.appearance ?? null)
  )

  const pickAppearance = (value: 'light' | 'dark' | 'system') => {
    setAppearance(value)
    setTheme(value)
    // Eagerly apply to DOM
    const root = document.documentElement
    const mq   = window.matchMedia('(prefers-color-scheme: dark)')
    if (value === 'dark')        root.classList.add('dark')
    else if (value === 'light')  root.classList.remove('dark')
    else                         root.classList.toggle('dark', mq.matches)
  }

  const save = () => {
    startTransition(async () => {
      const sb = createClient()
      const { error } = await sb.from('user_profiles').upsert(
        {
          id:           userId,
          full_name:    fullName.trim()    || null,
          display_name: displayName.trim() || null,
          job_title:    jobTitle.trim()    || null,
          bio:          bio.trim()         || null,
          appearance:   themeToDb(appearance),
          updated_at:   new Date().toISOString(),
        },
        { onConflict: 'id', ignoreDuplicates: false }
      )
      if (error) {
        toast.error(`Save failed: ${error.message}`)
        return
      }
      toast.success('Profile saved')
    })
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold mb-1 text-[var(--foreground)]">General</h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-8">Your profile and appearance settings.</p>

      {/* ── Profile ──────────────────────────────────────────────── */}
      <section>
        {/* Avatar row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="Profile photo" className="w-full h-full object-cover" />
              : (fullName.charAt(0) || email.charAt(0) || 'U').toUpperCase()
            }
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Profile photo</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
              Synced from Google. Change your Google photo to update it here.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            name="full_name"
            label="Full name"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            name="display_name"
            label="Display name"
            placeholder="Nickname"
            hint="Used in greetings and AI responses."
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Input
            name="job_title"
            label="Job title"
            placeholder="e.g. Head of Product, Founder"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short description about yourself…"
            rows={3}
            className={cn(
              'flex w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)]',
              'placeholder:text-[var(--muted-foreground)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:border-[var(--ring)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors duration-150 resize-none'
            )}
          />
        </div>
      </section>

      <Divider />

      {/* ── Email ────────────────────────────────────────────────── */}
      <section>
        <SectionTitle title="Email address" />
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <span className="text-sm text-[var(--foreground)]">{email}</span>
          <span className="text-xs font-bold text-[var(--success)]">Verified ✓</span>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">
          To change your email, contact{' '}
          <a href="mailto:support@stemmq.com" className="hover:underline text-[var(--accent)]">
            support@stemmq.com
          </a>
        </p>
      </section>

      <Divider />

      {/* ── Appearance ───────────────────────────────────────────── */}
      <section>
        <SectionTitle
          title="Appearance"
          hint="Saved to your profile and synced across devices. System follows your OS dark/light preference automatically."
        />

        {/* Segmented control */}
        <div className="flex items-center gap-3 mb-4">
          <ThemeToggle variant="segmented" />
          <span className="text-xs text-[var(--muted-foreground)] capitalize">
            {appearance === 'system' ? 'System (auto)' : appearance}
          </span>
        </div>

        {/* Appearance preview tiles */}
        <div className="flex gap-4">
          {(
            [
              { value: 'light' as const, label: 'Light', previewBg: '#fafafa', previewBorder: '#e4e4e7', barColors: ['#18181b', '#6366f1', '#d4d4d8'] },
              { value: 'system' as const, label: 'Auto',   previewBg: 'linear-gradient(135deg, #fafafa 0%, #09090b 100%)', barColors: ['#71717a', '#818cf8', '#3f3f46'] },
              { value: 'dark'  as const, label: 'Dark',  previewBg: '#18181b', previewBorder: '#27272a', barColors: ['#fafafa', '#818cf8', '#52525b'] },
            ] as { value: 'light' | 'dark' | 'system'; label: string; previewBg: string; previewBorder?: string; barColors: string[] }[]
          ).map(({ value, label, previewBg, previewBorder, barColors }) => {
            const selected = appearance === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => pickAppearance(value)}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={cn(
                    'w-[88px] h-[52px] rounded-xl border-2 overflow-hidden transition-all duration-200',
                    selected
                      ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/20 shadow-brand scale-[1.03]'
                      : 'border-[var(--border)] opacity-60 group-hover:opacity-85 group-hover:scale-[1.01]'
                  )}
                  style={{ background: previewBg, borderColor: selected ? undefined : previewBorder }}
                >
                  {/* Mini UI chrome */}
                  <div className="px-2 pt-2 flex items-center gap-1">
                    {barColors.map((c, i) => (
                      <div
                        key={i}
                        style={{ background: c, width: `${[16, 12, 12][i] ?? 12}px` }}
                        className="h-1.5 rounded-full opacity-60"
                      />
                    ))}
                  </div>
                  <div className="px-2 pt-1.5 flex gap-1">
                    <div style={{ background: barColors[0] }} className="h-1.5 w-8 rounded-full opacity-20" />
                    <div style={{ background: barColors[1] }} className="h-1.5 w-5 rounded-full opacity-30" />
                  </div>
                </div>
                <span className={cn(
                  'text-xs font-semibold transition-colors',
                  selected ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                )}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <Divider />

      {/* ── Save ─────────────────────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={isPending}
          className="flex items-center gap-2 bg-[var(--accent)] text-white font-semibold text-sm px-7 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {isPending
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
            : 'Save changes'
          }
        </button>
      </div>
    </div>
  )
}
