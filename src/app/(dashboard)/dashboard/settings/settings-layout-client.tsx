'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import {
  User, Settings, Shield, Bell,
  Building2, Users, BarChart3, CreditCard,
} from 'lucide-react'
import { cn } from '@/utils'

const SETTINGS_NAV = [
  {
    group: 'Account',
    items: [
      { href: '/dashboard/settings/general',       label: 'General',       Icon: User },
      { href: '/dashboard/settings/account',       label: 'Account',       Icon: Settings },
      { href: '/dashboard/settings/security',      label: 'Security',      Icon: Shield },
      { href: '/dashboard/settings/notifications', label: 'Notifications', Icon: Bell },
    ],
  },
  {
    group: 'Workspace',
    items: [
      { href: '/dashboard/settings/organization',  label: 'Organization',  Icon: Building2 },
      { href: '/dashboard/settings/members',       label: 'Members',       Icon: Users },
      { href: '/dashboard/settings/usage',         label: 'Usage',         Icon: BarChart3 },
      { href: '/dashboard/settings/billing',       label: 'Billing',       Icon: CreditCard },
    ],
  },
]

/**
 * On mobile this behaves like a two-level navigation:
 *   1. /dashboard/settings → shows the settings menu list (full width)
 *   2. /dashboard/settings/[page] → shows the page content with a Back button
 *
 * On desktop both panels are always visible side by side.
 */
export function SettingsLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isRootSettings = pathname === '/dashboard/settings'

  return (
    /*
      Fill the entire main area that DashboardLayout gives us.
      The flex row puts the inner settings sidebar and the content side by side.
    */
    <div className="flex h-full min-h-0">

      {/* ── Inner Settings Sidebar ── */}
      <aside className={cn(
        // Desktop: fixed width, always visible
        'lg:flex lg:flex-col lg:w-52 lg:flex-shrink-0',
        'lg:border-r lg:border-[var(--border)] lg:bg-[var(--background)]',
        // Mobile: full width when at settings root, hidden when on a sub-page
        isRootSettings ? 'flex flex-col w-full' : 'hidden lg:flex',
      )}>
        {/* "← Settings" back link (desktop shows "Settings" heading, mobile shows back arrow) */}
        <div className="flex items-center h-14 px-4 border-b border-[var(--border)]">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {SETTINGS_NAV.map(({ group, items }) => (
            <div key={group}>
              <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest px-2 mb-1.5">
                {group}
              </p>
              <div className="space-y-0.5">
                {items.map(({ href, label, Icon }) => {
                  const active = pathname === href || pathname.startsWith(href + '/')
                  return (
                    <Link key={href} href={href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all',
                        active
                          ? 'bg-[var(--sidebar-active)] text-[var(--foreground)] font-medium'
                          : 'text-[var(--muted-foreground)] hover:bg-[var(--sidebar-active)] hover:text-[var(--foreground)]'
                      )}>
                      <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'opacity-100' : 'opacity-60')} />
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Settings Page Content ── */}
      <div className={cn(
        'flex-1 overflow-y-auto min-w-0',
        // Mobile: hidden when at settings root (show the menu instead)
        isRootSettings ? 'hidden lg:block' : 'block',
      )}>
        {/* Mobile back button */}
        <div className="lg:hidden flex items-center h-12 px-4 border-b border-[var(--border)] bg-[var(--card)]">
          <Link href="/dashboard/settings"
            className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </Link>
        </div>

        {/* Actual page content */}
        <div className="p-6 lg:p-8 max-w-2xl">
          {children}
        </div>
      </div>

    </div>
  )
}
