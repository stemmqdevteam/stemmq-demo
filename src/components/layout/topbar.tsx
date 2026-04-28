'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Bell, ChevronRight } from 'lucide-react'
import { useUIStore, useAuthStore } from '@/store'
import { Avatar } from '@/components/ui'
import { ROUTES, NAV_ITEMS } from '@/constants'
import { cn } from '@/utils'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function Topbar() {
  const pathname       = usePathname()
  const { toggleSidebar } = useUIStore()
  const profile        = useAuthStore((s) => s.profile)
  const user           = useAuthStore((s) => s.user)
  const [unread, setUnread] = useState(0)

  // Live unread notification count via Supabase realtime
  useEffect(() => {
    if (!user?.id) return
    const supabase = createClient()

    // Initial count
    supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false)
      .then(({ count }) => setUnread(count ?? 0))

    // Subscribe to changes
    const channel = supabase
      .channel('notifications-count')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => {
          supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('read', false)
            .then(({ count }) => setUnread(count ?? 0))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user?.id])

  const activeItem = NAV_ITEMS.find(
    (n) => pathname === n.href || (n.href !== ROUTES.dashboard && pathname.startsWith(n.href))
  )
  const pageTitle = activeItem?.label ?? 'Dashboard'

  return (
    <header className={cn(
      'h-16 flex items-center gap-4 px-5',
      'bg-white dark:bg-surface-900',
      'border-b border-surface-100 dark:border-surface-800',
      'flex-shrink-0'
    )}>
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-[18px] h-[18px]" />
      </button>

      <nav className="flex items-center gap-1.5 text-sm min-w-0">
        <span className="text-surface-400 hidden sm:inline">Dashboard</span>
        {pageTitle !== 'Overview' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-surface-300 hidden sm:block flex-shrink-0" />
            <span className="font-medium text-surface-800 dark:text-surface-200 truncate">{pageTitle}</span>
          </>
        )}
        {pageTitle === 'Overview' && (
          <span className="sm:hidden font-medium text-surface-800 dark:text-surface-200">Overview</span>
        )}
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        <Link
          href={ROUTES.notifications}
          className="relative p-2 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>

        <Link href={ROUTES.settings}>
          <Avatar src={profile?.avatar_url} name={profile?.full_name ?? 'U'} size="sm" />
        </Link>
      </div>
    </header>
  )
}
