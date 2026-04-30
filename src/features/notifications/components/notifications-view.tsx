'use client'

import { useState, useTransition, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, CheckCheck, Trash2, GitBranch, Brain, CreditCard,
  Info, CheckCircle2, AlertTriangle, XCircle, Sparkles,
  Shield, RefreshCw, Filter, MoreHorizontal, BellOff,
  Lock, Users, Activity, Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '@/features/notifications/actions'
import { cn, formatRelativeTime } from '@/utils'
import type { Notification } from '@/types'

/* ── Source config ───────────────────────────────────────── */
const SOURCE_CFG = {
  decision:   { Icon: GitBranch,   color: 'bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400',     label: 'Decision' },
  assumption: { Icon: Brain,       color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',     label: 'Assumption' },
  billing:    { Icon: CreditCard,  color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400', label: 'Billing' },
  ai:         { Icon: Sparkles,    color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400', label: 'AI' },
  system:     { Icon: Activity,    color: 'bg-[var(--muted)] text-[var(--muted-foreground)]', label: 'System' },
  onboarding: { Icon: Zap,         color: 'bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400',     label: 'Onboarding' },
  security:   { Icon: Shield,      color: 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400',             label: 'Security' },
  team:       { Icon: Users,       color: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400',         label: 'Team' },
} as const

const TYPE_RING: Record<string, string> = {
  success: 'ring-1 ring-emerald-200 dark:ring-emerald-900',
  warning: 'ring-1 ring-amber-200 dark:ring-amber-900',
  error:   'ring-1 ring-red-200 dark:ring-red-900',
  info:    '',
}

type FilterTab = 'all' | 'unread' | 'decision' | 'billing' | 'security' | 'system' | 'ai'

const FILTERS: { id: FilterTab; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'unread',   label: 'Unread' },
  { id: 'decision', label: 'Decisions' },
  { id: 'billing',  label: 'Billing' },
  { id: 'security', label: 'Security' },
  { id: 'ai',       label: 'AI' },
  { id: 'system',   label: 'System' },
]

/* ── Time grouping ───────────────────────────────────────── */
function getGroup(dateStr: string): string {
  const now   = new Date()
  const date  = new Date(dateStr)
  const diff  = now.getTime() - date.getTime()
  const hours = diff / (1000 * 60 * 60)
  const days  = diff / (1000 * 60 * 60 * 24)

  if (hours < 24)  return 'Today'
  if (days  < 2)   return 'Yesterday'
  if (days  < 7)   return 'This week'
  if (days  < 30)  return 'This month'
  return 'Older'
}

const GROUP_ORDER = ['Today', 'Yesterday', 'This week', 'This month', 'Older']

/* ── Single notification card ────────────────────────────── */
function NotifCard({ n, onRead, onDelete }: {
  n: Notification
  onRead:   (id: string) => void
  onDelete: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const src  = SOURCE_CFG[n.source as keyof typeof SOURCE_CFG] ?? SOURCE_CFG.system
  const ring = TYPE_RING[n.type] ?? ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative flex items-start gap-4 px-5 py-4 group transition-all',
        'hover:bg-[var(--muted)]',
        !n.read && 'bg-brand-50/30 dark:bg-brand-950/10',
      )}
      onClick={() => !n.read && onRead(n.id)}
    >
      {/* Unread dot */}
      {!n.read && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
      )}

      {/* Icon */}
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
        src.color, ring
      )}>
        <src.Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            'text-sm leading-snug',
            n.read ? 'text-[var(--muted-foreground)]' : 'font-semibold text-[var(--foreground)]'
          )}>
            {n.title}
          </p>
          <span className="text-[11px] text-[var(--muted-foreground)] whitespace-nowrap flex-shrink-0 mt-0.5">
            {formatRelativeTime(n.created_at)}
          </span>
        </div>

        {n.body && (
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <span className={cn(
            'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
            src.color,
          )}>
            {src.label}
          </span>

          {n.action_url && n.action_label && (
            <a
              href={n.action_url}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
            >
              {n.action_label} →
            </a>
          )}
        </div>
      </div>

      {/* Actions menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-xl overflow-hidden py-1">
              {!n.read && (
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onRead(n.id) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-[var(--muted)] transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  Mark as read
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(n.id) }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

/* ── Main component ──────────────────────────────────────── */
export function NotificationsView({ notifications: initial }: { notifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initial)
  const [filter, setFilter]               = useState<FilterTab>('all')
  const [isPending, startTransition]      = useTransition()

  const unreadCount = notifications.filter((n) => !n.read).length

  /* Filter */
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'all')      return true
      if (filter === 'unread')   return !n.read
      if (filter === 'security') return n.title.toLowerCase().includes('login') || n.title.toLowerCase().includes('sign-in')
      return n.source === filter
    })
  }, [notifications, filter])

  /* Group by time */
  const grouped = useMemo(() => {
    const map: Record<string, Notification[]> = {}
    for (const n of filtered) {
      const g = getGroup(n.created_at)
      if (!map[g]) map[g] = []
      map[g]!.push(n)
    }
    return GROUP_ORDER.filter((g) => map[g]?.length).map((g) => ({ group: g, items: map[g]! }))
  }, [filtered])

  const handleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
    startTransition(async () => {
      await markNotificationRead(id)
    })
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    startTransition(async () => {
      const res = await deleteNotification(id)
      if (!res.success) toast.error(res.error)
    })
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    startTransition(async () => {
      const res = await markAllNotificationsRead()
      if (res.success) toast.success('All notifications marked as read')
      else toast.error(res.error)
    })
  }

  const handleClearAll = () => {
    if (!confirm('Delete all notifications? This cannot be undone.')) return
    setNotifications([])
    startTransition(async () => {
      for (const n of notifications) {
        await deleteNotification(n.id)
      }
      toast.success('All notifications cleared')
    })
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-0.5">Notifications</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={isPending}
              className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] px-3 py-2 rounded-xl transition-all hover:border-[var(--muted-foreground)]/30"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={isPending}
              className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-800 px-3 py-2 rounded-xl transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {FILTERS.map((f) => {
          const count = f.id === 'unread'
            ? unreadCount
            : f.id === 'all'
            ? notifications.length
            : f.id === 'security'
            ? notifications.filter((n) => n.title.toLowerCase().includes('login') || n.title.toLowerCase().includes('sign-in')).length
            : notifications.filter((n) => n.source === f.id).length

          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                filter === f.id
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:border-[var(--muted-foreground)]/30 '
              )}
            >
              {f.label}
              {count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  filter === f.id
                    ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[var(--foreground)]'
                    : f.id === 'unread'
                    ? 'bg-brand-500 text-white'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Notification list */}
      {grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-5">
            <BellOff className="w-7 h-7 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="font-display font-semibold text-base mb-1.5">
            {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
          </h3>
          <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
            {filter === 'all'
              ? "You're all caught up. Notifications will appear here when there's activity in your workspace."
              : `There are no ${filter} notifications right now.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {grouped.map(({ group, items }) => (
              <motion.div key={group} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Group label */}
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{group}</p>
                  <div className="flex-1 h-px bg-[var(--muted)]" />
                  <span className="text-[11px] text-[var(--muted-foreground)]">{items.length}</span>
                </div>

                {/* Cards container */}
                <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
                  <AnimatePresence mode="popLayout">
                    {items.map((n) => (
                      <NotifCard
                        key={n.id}
                        n={n}
                        onRead={handleRead}
                        onDelete={handleDelete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

    </div>
  )
}
