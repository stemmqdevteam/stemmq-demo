'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, GitBranch, Brain, FlaskConical,
  BarChart3, Bell, Settings, Zap, Lock,
  X, ShieldAlert, LogOut, HelpCircle, CreditCard,
  Info, ChevronUp, User, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/utils'
import { useAuth } from '@/hooks'
import { useOrgStore, useUIStore, usePlan } from '@/store'
import { useAuthStore } from '@/store'
import { Avatar, Tooltip } from '@/components/ui'
import { ROUTES } from '@/constants'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

/* ─────────────────────────────────────────────────────────────────────────────
   HOW THIS WORKS — read before touching
   ─────────────────────────────────────────────────────────────────────────────
   We use ONE `mobileOpen` state for mobile and ONE `desktopCollapsed` state
   for desktop. They are completely independent. This avoids the bug where a
   single `sidebarCollapsed` value collapses the desktop sidebar when navigating
   on mobile (which was closing the sidebar on both screens at once).

   DESKTOP (lg+):
     - Sidebar is always `relative` and always in the DOM flow.
     - `desktopCollapsed=false` → full width (224px), shows text labels.
     - `desktopCollapsed=true`  → icon-only width (56px), labels hidden.
     - Width is driven by CSS transition on the `aside` element — NO Framer
       Motion width animation (that was the cause of the width=0 bug).

   MOBILE (< lg):
     - Sidebar is `fixed` and slides in from the left as an overlay drawer.
     - `mobileOpen=false` → `-translate-x-full` (hidden off-screen).
     - `mobileOpen=true`  → `translate-x-0` (visible over content).
     - A semi-transparent backdrop appears behind the drawer.
     - Navigating to any page closes the mobile drawer.
   ────────────────────────────────────────────────────────────────────────── */

type NavItem = {
  href: string
  label: string
  Icon: React.ElementType
  pro?: boolean
  badge?: boolean
}

const NAV: NavItem[] = [
  { href: ROUTES.dashboard,     label: 'Overview',      Icon: LayoutDashboard },
  { href: ROUTES.decisions,     label: 'Decisions',     Icon: GitBranch },
  { href: ROUTES.assumptions,   label: 'Assumptions',   Icon: Brain },
  { href: ROUTES.simulations,   label: 'Simulations',   Icon: FlaskConical, pro: true },
  { href: ROUTES.analytics,     label: 'Analytics',     Icon: BarChart3 },
  { href: ROUTES.notifications, label: 'Notifications', Icon: Bell, badge: true },
]

const BOTTOM_NAV = [{ href: ROUTES.settings, label: 'Settings', Icon: Settings }] as const

interface ServerProfile {
  full_name: string | null
  avatar_url: string | null
  is_admin: boolean
  plan?: string
}

/* ── Profile dropdown (shared by both modes) ─────────────────────────────── */
function ProfileDropdown({ profile, org, plan, isAdmin, signOut, onClose }: {
  profile: { full_name?: string | null | undefined; avatar_url?: string | null | undefined; } | null | undefined
  org: { name?: string } | null
  plan: string; isAdmin: boolean
  signOut: () => void; onClose: () => void
}) {
  const isPro = plan === 'pro' || plan === 'enterprise'
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-full left-2 right-2 mb-2 z-50 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden"
      >
        <div className="px-4 py-3.5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <Avatar src={profile?.avatar_url} name={profile?.full_name ?? 'U'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{profile?.full_name ?? 'User'}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] truncate">{org?.name ?? 'Workspace'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className={cn('text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full',
              plan === 'enterprise' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' :
              plan === 'pro' ? 'bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400' :
              'bg-[var(--muted)] text-[var(--muted-foreground)]')}>
              {plan} plan
            </span>
            {isAdmin && <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400">Admin</span>}
          </div>
        </div>
        <div className="py-1">
          {[
            { Icon: User,        label: 'Profile',  href: `${ROUTES.settings}/general` },
            // { Icon: Settings,    label: 'Settings', href: ROUTES.settings },
            // { Icon: CreditCard,  label: 'Billing',  href: `${ROUTES.settings}/billing` },
            // { Icon: ShieldAlert, label: 'Security', href: `${ROUTES.settings}/security` },
          ].map(item => (
            <Link key={item.label} href={item.href} onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
              <item.Icon className="w-4 h-4 flex-shrink-0 opacity-60" />{item.label}
            </Link>
          ))}
          {!isPro && <>
            <div className="h-px bg-[var(--border)] my-1" />
            <Link href={`${ROUTES.settings}/billing`} onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors font-medium">
              <Zap className="w-4 h-4 flex-shrink-0" />Upgrade plan
            </Link>
          </>}
          {isAdmin && <>
            <div className="h-px bg-[var(--border)] my-1" />
            <Link href="/admin" onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />Admin panel
            </Link>
          </>}
          <div className="h-px bg-[var(--border)] my-1" />
          <Link href="/docs" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
            <HelpCircle className="w-4 h-4 flex-shrink-0 opacity-60" />Get help
          </Link>
          <Link href="/docs" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
            <Info className="w-4 h-4 flex-shrink-0 opacity-60" />Learn more
          </Link>
        </div>
        <div className="border-t border-[var(--border)] p-1.5">
          <button onClick={() => { onClose(); signOut() }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors rounded-xl">
            <LogOut className="w-4 h-4 flex-shrink-0 opacity-60" />Log out
          </button>
        </div>
      </motion.div>
    </>
  )
}

/* ── Shared nav link (used by both desktop + mobile sidebar) ─────────────── */
function NavLink({ href, label, Icon, active, collapsed, locked, showBadge, unread }: {
  href: string; label: string; Icon: React.ElementType
  active: boolean; collapsed: boolean; locked?: boolean
  showBadge?: boolean; unread?: number
}) {
  const el = (
    <Link href={locked ? ROUTES.billing : href}
      className={cn(
        'relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-all duration-150 outline-none',
        collapsed && 'justify-center',
        active
          ? 'bg-[var(--sidebar-active)] text-[var(--foreground)] font-medium'
          : 'text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-active)] hover:text-[var(--foreground)]',
      )}>
      {active && !collapsed && (
        <motion.span layoutId="nav-pill"
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-brand-500"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
      )}
      <div className="relative flex-shrink-0">
        <Icon className="w-[18px] h-[18px]" />
        {showBadge && collapsed && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center leading-none">
            {(unread ?? 0) > 9 ? '9+' : unread}
          </span>
        )}
      </div>
      {!collapsed && <span className="flex-1 whitespace-nowrap overflow-hidden">{label}</span>}
      {!collapsed && showBadge && (
        <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full leading-none">
          {(unread ?? 0) > 99 ? '99+' : unread}
        </span>
      )}
      {locked && !collapsed && <Lock className="w-3 h-3 text-[var(--muted-foreground)] flex-shrink-0 ml-auto" />}
    </Link>
  )
  if (collapsed) return <Tooltip content={locked ? `${label} — Pro` : label} side="right">{el}</Tooltip>
  return el
}

/* ── Inner sidebar content (shared between desktop + mobile drawer) ──────── */
function SidebarContent({
  collapsed, profile, org, plan, isAdmin, isPro,
  signOut, isLoading, unread, pathname, dropdownOpen, setDropdownOpen,
}: {
  collapsed: boolean
  profile: { full_name?: string | null | undefined; avatar_url?: string | null | undefined; } | null | undefined
  org: { name?: string } | null
  plan: string; isAdmin: boolean; isPro: boolean
  signOut: () => void; isLoading: boolean; unread: number
  pathname: string; dropdownOpen: boolean
  setDropdownOpen: (v: boolean | ((p: boolean) => boolean)) => void
}) {
  const isActive = (href: string) =>
    href === ROUTES.dashboard ? pathname === href : pathname.startsWith(href)

  return (
    <>
      {/* Org label */}
      {!collapsed && org?.name && (
        <div className="px-4 pb-2 overflow-hidden">
          <p className="text-[10px] font-semibold text-[var(--sidebar-foreground)] uppercase tracking-widest truncate opacity-50">
            {org.name}
          </p>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 space-y-0.5 py-1">
        {NAV.map(({ href, label, Icon, pro, badge }) => (
          <NavLink
            key={href}
            href={href} label={label} Icon={Icon}
            active={isActive(href)} collapsed={collapsed}
            locked={pro && !isPro}
            showBadge={badge && unread > 0} unread={unread}
          />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 pt-2 pb-1 space-y-0.5 border-t border-[var(--sidebar-border)]">
        {BOTTOM_NAV.map(({ href, label, Icon }) => (
          <NavLink key={href} href={href} label={label} Icon={Icon}
            active={isActive(href)} collapsed={collapsed} />
        ))}
        {isAdmin && (() => {
          const active = pathname.startsWith('/admin')
          const el = (
            <Link href="/admin"
              className={cn(
                'flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-all',
                collapsed && 'justify-center',
                active
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                  : 'text-red-500/70 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-400',
              )}>
              <ShieldAlert className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden">Admin</span>}
            </Link>
          )
          return collapsed
            ? <Tooltip key="admin" content="Admin Panel" side="right">{el}</Tooltip>
            : <div key="admin">{el}</div>
        })()}
      </div>

      {/* Profile footer */}

      <div className="relative border-t border-[var(--sidebar-border)]">
        <AnimatePresence>
          {dropdownOpen && !collapsed && (
            <ProfileDropdown
              profile={profile} org={org} plan={plan} isAdmin={isAdmin}
              signOut={signOut} onClose={() => setDropdownOpen(false)}
            />
          )}
        </AnimatePresence>
        <button
          onClick={() => !collapsed && setDropdownOpen(v => !v)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-3 transition-colors',
            !collapsed && 'hover:bg-[var(--sidebar-active)] cursor-pointer',
            collapsed && 'justify-center',
          )}>
          <Tooltip content={collapsed ? (profile?.full_name ?? 'User') : ''} side="right">
            <Avatar src={profile?.avatar_url} name={profile?.full_name ?? 'U'} size="sm" className="flex-shrink-0" />
          </Tooltip>
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              {isLoading && !profile
                ? <div className="h-3.5 w-20 bg-[var(--muted)] rounded-full animate-pulse" />
                : <p className="text-sm font-semibold truncate text-[var(--foreground)]">{profile?.full_name ?? 'User'}</p>
              }
              <p className="text-[11px] text-[var(--sidebar-foreground)] capitalize">{plan} plan</p>
            </div>
          )}
          {!collapsed && (
            <ChevronUp className={cn('w-3.5 h-3.5 text-[var(--sidebar-foreground)] transition-transform flex-shrink-0', !dropdownOpen && 'rotate-180')} />
          )}
        </button>
      </div>
    </>
  )
}

/* ── Main Sidebar export ─────────────────────────────────────────────────── */
export function Sidebar({ serverProfile }: { serverProfile?: ServerProfile | null }) {
  const pathname     = usePathname()
  const { profile: hookProfile, signOut, isLoading } = useAuth()
  const storeProfile = useAuthStore((s) => s.profile)
  const { org }      = useOrgStore()
  const { isPro, plan: storePlan } = usePlan()

  // ─── TWO separate state values ────────────────────────────────────────────
  // desktopCollapsed: icon-only mode on desktop. Persisted via UIStore.
  // mobileOpen: whether the drawer is open on mobile. NOT persisted.
  const { sidebarCollapsed: desktopCollapsed, toggleSidebar } = useUIStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  // ─────────────────────────────────────────────────────────────────────────

  const profile = hookProfile ?? storeProfile ?? serverProfile
  const isAdmin = storeProfile?.is_admin === true || serverProfile?.is_admin === true
  const plan    = storePlan !== 'free' ? storePlan : (serverProfile?.plan ?? storePlan)
  const userId  = useAuthStore((s) => s.user?.id)

  // Close MOBILE drawer when navigating — does NOT affect desktop
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Unread notification count
  useEffect(() => {
    if (!userId) return
    const sb = createClient()
    const load = () => sb.from('notifications').select('*', { count: 'exact', head: true })
      .eq('user_id', userId).eq('read', false).then(({ count }) => setUnread(count ?? 0))
    load()
    const ch = sb.channel('nb')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, load)
      .subscribe()
    return () => { sb.removeChannel(ch) }
  }, [userId])

  const contentProps = {
    profile, org, plan, isAdmin, isPro, signOut, isLoading, unread, pathname,
    dropdownOpen, setDropdownOpen,
  }

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────
          DESKTOP SIDEBAR
          Always in the document flow. Width transitions via CSS.
          Never hidden. sidebarCollapsed only controls icon vs full.
          ───────────────────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          // Layout
          'hidden lg:flex flex-col flex-shrink-0 h-full select-none',
          // Colors
          'bg-[var(--sidebar)] text-[var(--sidebar-foreground)]',
          'border-r border-[var(--sidebar-border)]',
          // Overflow
          'overflow-hidden',
          // Width: CSS transition, NO framer-motion width animation
          'transition-[width] duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          desktopCollapsed ? 'w-14' : 'w-56',
        )}
      >
        {/* Logo + desktop collapse toggle */}
        <div className={cn('flex items-center h-14 px-3 flex-shrink-0', desktopCollapsed && 'justify-center')}>
          {!desktopCollapsed && (
            <div className="flex items-center gap-2.5 flex-1 min-w-0 overflow-hidden">
              <div className="w-7 h-7 rounded-[8px] bg-brand-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-[15px] tracking-tight whitespace-nowrap text-[var(--foreground)]">
                StemmQ
              </span>
            </div>
          )}
          {desktopCollapsed && (
            <div className="w-7 h-7 rounded-[8px] bg-brand-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
          )}
          <Tooltip content={desktopCollapsed ? 'Expand sidebar' : ''} side="right">
            <button
              onClick={toggleSidebar}
              className={cn(
                'flex items-center justify-center w-7 h-7 rounded-lg text-[var(--sidebar-foreground)]',
                'hover:text-[var(--foreground)] hover:bg-[var(--sidebar-active)] transition-colors flex-shrink-0',
                !desktopCollapsed && 'ml-1',
              )}>
              {desktopCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </Tooltip>
        </div>

        <SidebarContent {...contentProps} collapsed={desktopCollapsed} />
      </aside>

      {/* ─────────────────────────────────────────────────────────────────────
          MOBILE TOP BAR
          Fixed header visible only on small screens. Contains hamburger.
          ───────────────────────────────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 h-14 bg-[var(--sidebar)] border-b border-[var(--sidebar-border)] flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-active)] transition-colors"
          aria-label="Open navigation">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect width="16" height="2" rx="1" fill="currentColor" />
            <rect y="5" width="12" height="2" rx="1" fill="currentColor" />
            <rect y="10" width="8" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[6px] bg-brand-600 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="font-display font-bold text-[14px] text-[var(--foreground)]">StemmQ</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          MOBILE DRAWER + BACKDROP
          Slides in from the left as an overlay. Independent from desktop state.
          ───────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
              className={cn(
                'lg:hidden fixed inset-y-0 left-0 z-40 w-[280px] flex flex-col select-none',
                'bg-[var(--sidebar)] text-[var(--sidebar-foreground)]',
                'border-r border-[var(--sidebar-border)]',
                'overflow-hidden shadow-2xl',
              )}>
              {/* Drawer header */}
              <div className="flex items-center justify-between h-14 px-4 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[8px] bg-brand-600 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-white" fill="white" />
                  </div>
                  <span className="font-display font-bold text-[15px] tracking-tight text-[var(--foreground)]">
                    StemmQ
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-active)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <SidebarContent
                {...contentProps}
                collapsed={false}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
