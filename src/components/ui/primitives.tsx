// ─────────────────────────────────────────────────────────
//  Misc primitive UI components
// ─────────────────────────────────────────────────────────
import { cn, getInitials } from '@/utils'

// ── Avatar ────────────────────────────────────────────────

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const avatarSizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-16 h-16 text-xl',
}

// Generate a consistent color from a string (deterministic)
function nameToColor(name: string): string {
  const colors = [
    'bg-brand-500',   'bg-purple-500', 'bg-emerald-500',
    'bg-amber-500',   'bg-red-500',    'bg-cyan-500',
    'bg-pink-500',    'bg-indigo-500', 'bg-teal-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]!
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials   = name ? getInitials(name) : '?'
  const colorClass = name ? nameToColor(name) : 'bg-brand-500'

  return (
    <div
      className={cn(
        'relative flex-shrink-0 rounded-full overflow-hidden',
        'flex items-center justify-center font-semibold text-white',
        !src && colorClass,
        avatarSizes[size],
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? ''}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load (expired Google URL etc), show initials
            const target = e.currentTarget
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.classList.add(colorClass)
              const span = document.createElement('span')
              span.textContent = initials
              parent.appendChild(span)
            }
          }}
        />
      ) : (
        <span className={cn(
          'select-none',
          size === 'xs' ? 'text-[10px]' :
          size === 'sm' ? 'text-xs' :
          size === 'md' ? 'text-sm' : 'text-base'
        )}>
          {initials}
        </span>
      )}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[var(--muted)]',
        className
      )}
    />
  )
}

// ── Score Ring ────────────────────────────────────────────

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

export function ScoreRing({
  score,
  size = 60,
  strokeWidth = 5,
  label,
  className,
}: ScoreRingProps) {
  const r = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color =
    score >= 80
      ? '#059669'
      : score >= 60
        ? '#d97706'
        : score >= 40
          ? '#ea580c'
          : '#dc2626'

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-[var(--border)]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold leading-none" style={{ color }}>
          {Math.round(score)}
        </span>
        {label && <span className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{label}</span>}
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 p-3 rounded-2xl bg-[var(--muted)]/60 text-[var(--muted-foreground)]">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs mb-5">{description}</p>
      )}
      {action}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────

export function Divider({ className }: { className?: string }) {
  return (
    <hr
      className={cn(
        'border-0 border-t border-[var(--border)]',
        className
      )}
    />
  )
}

// ── Tooltip ───────────────────────────────────────────────

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

const tooltipPositions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <div className={cn('group relative inline-flex', className)}>
      {children}
      <div
        className={cn(
          'pointer-events-none absolute z-50',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          tooltipPositions[side]
        )}
      >
        <div className="bg-[var(--card)] text-[var(--foreground)] text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg font-medium">
          {content}
        </div>
      </div>
    </div>
  )
}

// ── Loading Spinner ───────────────────────────────────────

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-5 h-5 rounded-full border-2 border-[var(--border)] border-t-brand-600 animate-spin',
        className
      )}
    />
  )
}
