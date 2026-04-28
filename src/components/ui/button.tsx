import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'brand-outline'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  /** @deprecated Use a plain <Link> with className instead of asChild */
  asChild?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-white hover:opacity-90 active:opacity-80 shadow-sm hover:shadow-brand',
  secondary:
    'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted-foreground)]/10',
  ghost:
    'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
  outline:
    'border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]',
  'brand-outline':
    'border border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30',
}

const sizeStyles: Record<ButtonSize, string> = {
  xs:       'h-7 px-2.5 text-xs rounded-lg',
  sm:       'h-8 px-3 text-sm rounded-[9px]',
  md:       'h-10 px-4 text-sm rounded-[10px]',
  lg:       'h-12 px-6 text-base rounded-[12px]',
  icon:     'h-10 w-10 rounded-[10px]',
  'icon-sm':'h-8 w-8 rounded-[9px]',
}

/**
 * Shared className builder — use this when you need button styles on a
 * non-button element (e.g. a Next.js Link).
 *
 * Example:
 *   <Link href="/dashboard" className={buttonClass({ variant: 'primary', size: 'md' })}>
 *     Go to dashboard
 *   </Link>
 */
export function buttonClass({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 font-medium',
    'transition-all duration-150 select-none cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
    variantStyles[variant],
    sizeStyles[size],
    className
  )
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild: _asChild, // consumed — never forwarded to DOM
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={buttonClass({ variant, size, className })}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
)
Button.displayName = 'Button'

export { Button }

