'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  name: string
  label?: string
  error?: string
  hint?: string
  /** Icon shown on the left side of the input */
  leftIcon?: React.ReactNode
  /** @deprecated Use leftIcon instead */
  icon?: React.ReactNode
  /** Icon shown on the right side of the input (non-interactive) */
  rightIcon?: React.ReactNode
  /** When type="password", show a visibility toggle button */
  showPasswordToggle?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      label,
      hint,
      className,
      error,
      leftIcon,
      icon,
      rightIcon,
      type = 'text',
      showPasswordToggle,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const resolvedLeftIcon = leftIcon ?? icon
    const isPassword = type === 'password'
    const resolvedType = isPassword && showPassword ? 'text' : type

    const hasRightAddon = rightIcon || (isPassword && showPasswordToggle)

    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-medium text-foreground select-none"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {resolvedLeftIcon && (
            <span
              className="pointer-events-none absolute left-3 flex items-center text-muted-foreground"
              aria-hidden
            >
              {resolvedLeftIcon}
            </span>
          )}

          <input
            id={name}
            name={name}
            type={resolvedType}
            ref={ref}
            disabled={disabled}
            className={cn(
              'flex h-10 w-full rounded-lg border border-input bg-background text-sm',
              'px-3 py-2',
              'placeholder:text-muted-foreground',
              // Focus
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              'focus-visible:ring-offset-background focus-visible:border-ring',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Transitions
              'transition-colors duration-150',
              // Icon padding
              resolvedLeftIcon && 'pl-9',
              hasRightAddon && 'pr-9',
              // Error state
              error && 'border-danger focus-visible:ring-danger focus-visible:border-danger',
              className
            )}
            {...props}
          />

          {/* Right icon or password toggle */}
          {hasRightAddon && (
            <span className="absolute right-3 flex items-center">
              {isPassword && showPasswordToggle ? (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              ) : (
                <span className="pointer-events-none text-muted-foreground" aria-hidden>
                  {rightIcon}
                </span>
              )}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p role="alert" className="text-xs text-danger leading-snug">
            {error}
          </p>
        )}

        {/* Hint (only shown when no error) */}
        {hint && !error && (
          <p className="text-xs text-muted-foreground leading-snug">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
export type { InputProps }
