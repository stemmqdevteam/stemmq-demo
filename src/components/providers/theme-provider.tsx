'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store'

/**
 * ThemeProvider — applies color mode to <html> without depending on auth store.
 *
 * Why not read from auth store here:
 * ThemeProvider wraps the entire app including SessionProvider.
 * If ThemeProvider reads from useAuthStore, and SessionProvider sets auth state
 * in useEffect, React will re-render ThemeProvider AFTER SessionProvider's effect
 * — which is correct. But reading auth state during the initial render (before
 * SessionProvider has run its effect) causes the "updating a component while
 * rendering a different component" error in React 18 concurrent mode.
 *
 * Solution: ThemeProvider only reads from UIStore (persisted in localStorage).
 * The appearance DB preference is applied separately in GeneralSettingsForm
 * and on the /dashboard/settings/general page after it loads.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    const mq   = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'system' && mq.matches)
      root.classList.toggle('dark', isDark)
    }

    apply()

    if (theme === 'system') {
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [theme])

  return <>{children}</>
}
