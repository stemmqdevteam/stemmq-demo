'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Zap, Crown, Shield, CreditCard, ExternalLink,
  RefreshCw, CheckCircle2, AlertCircle, ArrowRight,
  Calendar, Receipt,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatDate } from '@/lib/utils'
import type { PlanType } from '@/types'

interface Props {
  subscription: {
    plan:                 PlanType
    status:               string
    current_period_end:   string | null
    cancel_at_period_end: boolean
    stripe_customer_id:   string | null
  } | null
  org:     { name: string; plan: PlanType } | null
  isAdmin: boolean
}

const PLANS = [
  {
    id:    'free' as PlanType,
    name:  'Free',
    price: { monthly: '$0', yearly: '$0' },
    period: 'forever',
    desc:  'For individuals exploring decision intelligence.',
    icon:   Shield,
    color:  'text-[var(--muted-foreground)]',
    features: ['10 decisions total', '1 workspace member', 'Core decision framework', 'Assumption tracking', '5 AI generations / month', 'Basic dashboard'],
  },
  {
    id:    'pro' as PlanType,
    name:  'Pro',
    price: { monthly: '$29', yearly: '$23' },
    period: '/month',
    desc:  'For teams serious about decision quality.',
    icon:   Zap,
    color:  'text-brand-600',
    highlight: true,
    features: ['Unlimited decisions', 'Unlimited team members', 'Unlimited AI generations', 'Simulations', 'Advanced analytics', 'Priority support'],
  },
  {
    id:    'enterprise' as PlanType,
    name:  'Enterprise',
    price: { monthly: '$299', yearly: '$249' },
    period: '/month',
    desc:  'For complex decision governance at scale.',
    icon:   Crown,
    color:  'text-amber-600',
    features: ['Everything in Pro', 'SSO / SAML', 'Audit logs', 'Dedicated CSM', 'Custom SLA', 'API access'],
  },
]

function PlanIcon({ plan }: { plan: PlanType }) {
  if (plan === 'enterprise') return <Crown className="w-5 h-5 text-amber-500" />
  if (plan === 'pro')        return <Zap   className="w-5 h-5 text-brand-500" />
  return <Shield className="w-5 h-5 text-[var(--muted-foreground)]" />
}

export function BillingView({ subscription, org, isAdmin }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [interval, setInterval]         = useState<'monthly' | 'yearly'>('monthly')
  const [isPending, startTransition]    = useTransition()
  const [loadingPlan, setLoadingPlan]   = useState<string | null>(null)

  const currentPlan: PlanType = subscription?.plan ?? org?.plan ?? 'free'
  const isActive   = !subscription || ['active', 'trialing'].includes(subscription.status)
  const isPaid     = (currentPlan === 'pro' || currentPlan === 'enterprise') && isActive
  const hasBilling = !!subscription?.stripe_customer_id

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Plan upgraded successfully!')
    }
    if (searchParams.get('canceled') === 'true') {
      toast.error('Checkout canceled.')
    }
  }, [searchParams])

  const handleUpgrade = (planId: string) => {
    if (!isAdmin) { toast.error('Only workspace owners can change the plan.'); return }
    setLoadingPlan(planId)
    startTransition(async () => {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, interval }),
      })
      const data = await res.json()
      if (data.url) router.push(data.url)
      else { toast.error(data.error ?? 'Something went wrong'); setLoadingPlan(null) }
    })
  }

  const handlePortal = () => {
    startTransition(async () => {
      const res  = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) router.push(data.url)
      else toast.error(data.error ?? 'Failed to open billing portal')
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Billing</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Manage your plan, payment method, and invoices.</p>
      </div>

      {/* Current plan */}
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold">Current plan</h2>
        </div>
        <div className="px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center',
                currentPlan === 'enterprise' ? 'bg-amber-50 dark:bg-amber-950/40' :
                currentPlan === 'pro'        ? 'bg-brand-50 dark:bg-brand-950/40' :
                                               'bg-[var(--muted)]'
              )}>
                <PlanIcon plan={currentPlan} />
              </div>
              <div>
                <p className="text-base font-bold capitalize">{currentPlan} plan</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  {currentPlan === 'free' ? 'Free forever' :
                   currentPlan === 'pro'  ? '$29 / month' : '$299 / month'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full',
                isActive ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' :
                            'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
              )}>
                {subscription?.status ?? 'Active'}
              </span>
            </div>
          </div>

          {/* Plan details row */}
          <div className="grid sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-[var(--border)]">
            <div>
              <p className="text-[11px] text-[var(--muted-foreground)] uppercase tracking-wide font-semibold mb-1">Renews</p>
              <p className="text-sm font-medium">
                {subscription?.cancel_at_period_end ? (
                  <span className="text-amber-600 dark:text-amber-400">Cancels {formatDate(subscription.current_period_end!)}</span>
                ) : subscription?.current_period_end ? (
                  formatDate(subscription.current_period_end)
                ) : '—'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--muted-foreground)] uppercase tracking-wide font-semibold mb-1">Billing</p>
              <p className="text-sm font-medium">{hasBilling ? 'Stripe connected' : 'No payment method'}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--muted-foreground)] uppercase tracking-wide font-semibold mb-1">Workspace</p>
              <p className="text-sm font-medium truncate">{org?.name ?? '—'}</p>
            </div>
          </div>

          {isPaid && hasBilling && (
            <div className="mt-5 flex gap-2">
              <button onClick={handlePortal} disabled={isPending}
                className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] border border-[var(--border)] hover:border-surface-300 dark:hover:border-surface-600 bg-[var(--card)] px-4 py-2.5 rounded-xl transition-all">
                {isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                Manage subscription
                <ExternalLink className="w-3 h-3 opacity-50" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interval toggle — only for free users upgrading */}
      {!isPaid && (
        <div className="flex items-center justify-center gap-1 p-1 bg-[var(--muted)] rounded-xl w-fit mx-auto">
          {(['monthly', 'yearly'] as const).map((i) => (
            <button key={i} onClick={() => setInterval(i)}
              className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                interval === i ? 'bg-[var(--card)] shadow-sm text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)]'
              )}>
              {i}
              {i === 'yearly' && <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full">Save 20%</span>}
            </button>
          ))}
        </div>
      )}

      {/* Plan cards */}
      {!isPaid && (
        <div className="grid sm:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => {
            const isCurrent = plan.id === currentPlan
            const PIcon     = plan.icon
            return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={cn(
                  'relative bg-[var(--card)] rounded-2xl border p-5 flex flex-col',
                  plan.highlight && !isCurrent ? 'border-brand-300 dark:border-brand-700 shadow-lg shadow-brand-500/10' : 'border-[var(--border)]'
                )}>
                {plan.highlight && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most popular</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center',
                    plan.id === 'enterprise' ? 'bg-amber-50 dark:bg-amber-950/40' :
                    plan.id === 'pro'        ? 'bg-brand-50 dark:bg-brand-950/40' :
                                               'bg-[var(--muted)]'
                  )}>
                    <PIcon className={cn('w-4.5 h-4.5', plan.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{plan.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{plan.desc}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <span className="font-display font-bold text-3xl">{plan.price[interval]}</span>
                  <span className="text-[var(--muted-foreground)] text-sm ml-1">{plan.period}</span>
                  {interval === 'yearly' && plan.id !== 'free' && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Billed yearly</p>
                  )}
                </div>

                <div className="space-y-2 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[var(--muted-foreground)]">{f}</span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <div className="w-full text-center text-xs font-semibold text-[var(--muted-foreground)] bg-[var(--muted)] py-2.5 rounded-xl">
                    Current plan
                  </div>
                ) : plan.id === 'enterprise' ? (
                  <a href="mailto:enterprise@stemmq.com"
                    className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl transition-all">
                    Contact sales <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button onClick={() => handleUpgrade(plan.id)} disabled={isPending || !isAdmin}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl transition-all',
                      plan.highlight ? 'bg-brand-600 hover:bg-brand-700 text-white' : 'border border-[var(--border)] hover:border-brand-300 text-[var(--muted-foreground)]',
                      (isPending || !isAdmin) && 'opacity-50 cursor-not-allowed'
                    )}>
                    {loadingPlan === plan.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    {!isAdmin ? 'Admin only' : `Upgrade to ${plan.name}`}
                    {isAdmin && loadingPlan !== plan.id && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Payment method (paid users) */}
      {isPaid && hasBilling && (
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold">Payment</h2>
          </div>
          <div className="px-5 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-[var(--muted)] rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[var(--muted-foreground)]" />
              </div>
              <p className="text-sm font-medium">Payment method managed in Stripe</p>
            </div>
            <button onClick={handlePortal} disabled={isPending}
              className="flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
              Update <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Invoices (paid users) */}
      {isPaid && (
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-sm font-semibold">Invoices</h2>
            <button onClick={handlePortal} className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline">
              View all <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="px-5 py-5 text-center">
            <Receipt className="w-8 h-8 mx-auto mb-2 text-surface-200 dark:text-[var(--muted-foreground)]" />
            <p className="text-sm text-[var(--muted-foreground)] mb-3">View and download invoices in the billing portal.</p>
            <button onClick={handlePortal}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] border border-[var(--border)] px-4 py-2 rounded-xl hover:border-brand-300 transition-all">
              Open billing portal <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Cancellation */}
      {isPaid && (
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold">Cancel subscription</h2>
          </div>
          <div className="px-5 py-5">
            <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">
              If you cancel, your plan stays active until the end of your billing period.
              After that, your workspace downgrades to the free plan.
            </p>
            <button onClick={handlePortal}
              className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 px-4 py-2.5 rounded-xl transition-all">
              Cancel subscription
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
