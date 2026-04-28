'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'system'

const ALL_THEMES: { value: Theme; Icon: React.ElementType; label: string }[] = [
  { value: 'light',  Icon: Sun,     label: 'Light' },
  { value: 'dark',   Icon: Moon,    label: 'Dark' },
  { value: 'system', Icon: Monitor, label: 'System' },
]

const ALL_ORDER: Theme[] = ['light', 'dark', 'system']

/**
 * ThemeToggle — two variants:
 *
 *   compact (default): single icon button that cycles through allowed modes
 *   segmented:         segmented control showing all allowed mode options
 *
 * Both variants write to UIStore (persisted in localStorage) which ThemeProvider
 * reads on every page load. Changing theme on the landing page will therefore
 * persist into the dashboard and all other routes.
 *
 * @param modes - restrict available theme modes (default: all three). Pass
 *   ['light', 'dark'] for landing pages that don't expose the System option.
 */
interface ThemeToggleProps {
  variant?: 'compact' | 'segmented'
  modes?: Theme[]
  className?: string
}

export function ThemeToggle({ variant = 'compact', modes, className }: ThemeToggleProps) {
  const { theme, setTheme } = useUIStore()

  // Prevent hydration mismatch — don't render the icon until client-mounted
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    // Signal to CSS that we're ready for smooth theme transitions
    document.documentElement.setAttribute('data-theme-ready', '1')
  }, [])

  // Filter to only allowed modes
  const allowedModes = modes ?? ALL_ORDER
  const themes = ALL_THEMES.filter((t) => allowedModes.includes(t.value))
  const order   = ALL_ORDER.filter((t) => allowedModes.includes(t))

  const cycle = () => {
    const idx  = order.indexOf(theme)
    const next = idx === -1 ? order[0]! : order[(idx + 1) % order.length]!
    setTheme(next)
  }

  if (!mounted) {
    return (
      <div
        className={cn(
          variant === 'compact'
            ? 'w-9 h-9 rounded-xl'
            : 'flex gap-0.5 p-0.5 rounded-xl h-8',
          'bg-transparent',
          className
        )}
        aria-hidden
      />
    )
  }

  /* ── Compact variant — single cycling icon button ───────── */
  if (variant === 'compact') {
    const current = themes.find((t) => t.value === theme) ?? themes[0]!
    const { Icon } = current

    return (
      <button
        onClick={cycle}
        className={cn(
          'relative w-9 h-9 flex items-center justify-center rounded-xl',
          'text-muted-foreground hover:text-foreground',
          'hover:bg-muted/60 transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-label={`Switch theme (current: ${current.label})`}
        title={`Current: ${current.label} — click to cycle`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ opacity: 0, scale: 0.7, rotate: -30 }}
            animate={{ opacity: 1, scale: 1,   rotate: 0 }}
            exit={{   opacity: 0, scale: 0.7, rotate: 30 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Icon className="w-4 h-4" />
          </motion.span>
        </AnimatePresence>
      </button>
    )
  }

  /* ── Segmented variant — pill control for allowed modes ─── */
  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn(
        'flex items-center gap-0.5 p-0.5 rounded-xl',
        'bg-muted/50 border border-border/60',
        className
      )}
    >
      {themes.map(({ value, Icon, label }) => {
        const active = theme === value
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={cn(
              'relative w-8 h-7 flex items-center justify-center rounded-lg text-sm',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              active
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-[9px] bg-card shadow-sm border border-border/40"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative z-10">
              <Icon className="w-3.5 h-3.5" />
            </span>
          </button>
        )
      })}
    </div>
  )
}
