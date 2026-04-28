'use client'

import Link from 'next/link'
import { Lock, Sparkles } from 'lucide-react'
import { cn } from '@/utils'
import { usePlan } from '@/store'
import { ROUTES } from '@/constants'
import type { PlanFeatures, PlanType } from '@/types'

interface FeatureGateProps {
  /** The feature flag to check */
  feature: keyof PlanFeatures
  /** The minimum plan required */
  requiredPlan?: PlanType
  /** Content shown when feature is available */
  children: React.ReactNode
  /** Optional custom upgrade message */
  upgradeMessage?: string
  /** Show inline lock instead of full overlay */
  inline?: boolean
}

/**
 * StemmQ Feature Gate
 *
 * NEVER hides features. Always shows the UI in a locked state
 * with a clear upgrade path. This is intentional product design.
 */
export function FeatureGate({
  feature,
  requiredPlan = 'pro',
  children,
  upgradeMessage,
  inline = false,
}: FeatureGateProps) {
  const { can, plan } = usePlan()
  const hasAccess = can(feature)

  if (hasAccess) return <>{children}</>

  const message = upgradeMessage ?? `This feature requires the ${requiredPlan} plan.`
  const planLabel = requiredPlan === 'pro' ? 'Pro' : 'Enterprise'

  if (inline) {
    return (
      <div className="flex items-center gap-2 text-sm text-surface-400">
        <Lock className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{message}</span>
        <Link href={ROUTES.billing} className="text-brand-600 dark:text-brand-400 font-medium hover:underline whitespace-nowrap">
          Upgrade to {planLabel}
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Blurred children preview */}
      <div className="pointer-events-none select-none" aria-hidden>
        <div className="opacity-40 blur-[2px]">
          {children}
        </div>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-2xl p-6 text-center shadow-elevated max-w-xs mx-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 text-brand-500" />
          </div>
          <h3 className="font-display font-bold text-base mb-1">{planLabel} feature</h3>
          <p className="text-sm text-surface-500 mb-4">{message}</p>
          <Link href={ROUTES.billing} className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm', 'w-full')}>
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade to {planLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Upgrade prompt banner — use inside pages that have plan-gated sections
 */
export function UpgradeBanner({
  feature,
  title,
  description,
  className,
}: {
  feature: keyof PlanFeatures
  title: string
  description: string
  className?: string
}) {
  const { can } = usePlan()
  if (can(feature)) return null

  return (
    <div className={cn(
      'flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl',
      'bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900',
      className
    )}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">{title}</span>
        </div>
        <p className="text-xs text-brand-600/70 dark:text-brand-400/70">{description}</p>
      </div>
      <Link href={ROUTES.billing} className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm', 'whitespace-nowrap flex-shrink-0')}>
        Upgrade now
      </Link>
    </div>
  )
}
