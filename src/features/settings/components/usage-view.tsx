'use client'

import { motion } from 'framer-motion'
import { GitBranch, Brain, FlaskConical, Sparkles, Zap, Crown, Shield, Users, BarChart3, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { PLAN_FEATURES, type PlanType } from '@/types'

interface Props {
  plan: PlanType
  decisions: number
  assumptions: number
  simulations: number
  aiUsageThisMonth: number
}

function UsageBar({ used, max, color = 'brand' }: { used: number; max: number | null; color?: string }) {
  const pct = max === null ? 0 : Math.min((used / max) * 100, 100)
  const isHigh = pct >= 90
  const isMed  = pct >= 70

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-[var(--muted-foreground)] font-medium">{used.toLocaleString()} used</span>
        <span className={cn('font-semibold',
          isHigh ? 'text-red-600 dark:text-red-400' :
          isMed  ? 'text-amber-600 dark:text-amber-400' :
                   'text-[var(--muted-foreground)]'
        )}>
          {max === null ? 'Unlimited' : `${used} / ${max}`}
        </span>
      </div>
      {max !== null && (
        <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full rounded-full',
              isHigh ? 'bg-red-500' :
              isMed  ? 'bg-amber-500' :
                       'bg-brand-500'
            )}
          />
        </div>
      )}
      {max === null && (
        <div className="h-2 rounded-full bg-brand-100 dark:bg-brand-950/40">
          <div className="h-full w-full rounded-full bg-brand-500/30" />
        </div>
      )}
    </div>
  )
}

function UsageCard({ Icon, title, used, max, color, index }: {
  Icon: React.ElementType; title: string; used: number; max: number | null; color: string; index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color)}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
        {max === null && (
          <span className="ml-auto text-[10px] font-bold bg-brand-100 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full uppercase tracking-wide">Unlimited</span>
        )}
      </div>
      <UsageBar used={used} max={max} />
    </motion.div>
  )
}

export function UsageView({ plan, decisions, assumptions, simulations, aiUsageThisMonth }: Props) {
  const features = PLAN_FEATURES[plan]
  const isPaid   = plan !== 'free'

  const items = [
    { Icon: GitBranch,  title: 'Decisions',           used: decisions,        max: features.max_decisions,     color: 'bg-brand-50 dark:bg-brand-950/40 text-brand-600' },
    { Icon: Brain,      title: 'Assumptions tracked',  used: assumptions,      max: null,                        color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' },
    { Icon: Sparkles,   title: 'AI generations (month)',used: aiUsageThisMonth, max: isPaid ? null : 5,           color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600' },
    { Icon: FlaskConical,title:'Simulations',          used: simulations,      max: features.simulations ? null : 0, color: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600' },
  ]

  const planFeaturesList = [
    { Icon: GitBranch,  label: 'Decisions',            value: features.max_decisions !== null ? `Up to ${features.max_decisions}` : 'Unlimited' },
    { Icon: Users,      label: 'Team members',          value: features.max_members   !== null ? `Up to ${features.max_members}`  : 'Unlimited' },
    { Icon: Sparkles,   label: 'AI generations',        value: features.ai_suggestions ? 'Unlimited' : '5 / month' },
    { Icon: FlaskConical,label:'Simulations',           value: features.simulations        ? 'Included' : 'Not included', notIncluded: !features.simulations },
    { Icon: BarChart3,  label: 'Advanced analytics',    value: features.advanced_analytics ? 'Included' : 'Not included', notIncluded: !features.advanced_analytics },
    { Icon: Shield,     label: 'Audit logs',            value: features.audit_logs         ? 'Included' : 'Not included', notIncluded: !features.audit_logs },
    { Icon: Lock,       label: 'SSO / SAML',            value: features.sso                ? 'Included' : 'Not included', notIncluded: !features.sso },
    { Icon: Zap,        label: 'Priority support',      value: features.priority_support   ? 'Included' : 'Not included', notIncluded: !features.priority_support },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Usage</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Your current plan usage and limits.</p>
      </div>

      {/* Plan badge */}
      <div className="flex items-center justify-between bg-[var(--card)] rounded-2xl border border-[var(--border)] px-5 py-4">
        <div className="flex items-center gap-3">
          {plan === 'enterprise' ? <Crown className="w-5 h-5 text-amber-500" /> :
           plan === 'pro'        ? <Zap   className="w-5 h-5 text-brand-500" /> :
                                   <Shield className="w-5 h-5 text-[var(--muted-foreground)]" />}
          <div>
            <p className="text-sm font-semibold capitalize">{plan} plan</p>
            <p className="text-xs text-[var(--muted-foreground)]">Current workspace plan</p>
          </div>
        </div>
        {plan === 'free' && (
          <Link href="/dashboard/settings/billing"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all">
            <Zap className="w-3.5 h-3.5" /> Upgrade
          </Link>
        )}
      </div>

      {/* Usage cards */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] mb-4">Current usage</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <UsageCard key={item.title} {...item} index={i} />
          ))}
        </div>
      </div>

      {/* What's included */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] mb-4">
          What's included in {plan === 'free' ? 'the free' : `your ${plan}`} plan
        </h2>
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
          {planFeaturesList.map(({ Icon, label, value, notIncluded }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--border)] last:border-0">
              <Icon className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
              <span className="text-sm text-[var(--muted-foreground)] flex-1">{label}</span>
              <span className={cn('text-sm font-medium',
                notIncluded ? 'text-surface-300 dark:text-[var(--muted-foreground)]' :
                value === 'Unlimited' ? 'text-brand-600 dark:text-brand-400' :
                'text-[var(--foreground)]'
              )}>
                {notIncluded ? '—' : value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {plan === 'free' && (
        <div className="bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950/20 dark:to-purple-950/20 border border-brand-100 dark:border-brand-900/50 rounded-2xl p-5">
          <p className="text-sm font-semibold text-brand-900 dark:text-brand-200 mb-1">Ready to grow?</p>
          <p className="text-xs text-brand-700/70 dark:text-brand-400/70 mb-4 leading-relaxed">
            Upgrade to Pro for unlimited decisions, AI generations, simulations, and advanced analytics.
          </p>
          <Link href="/dashboard/settings/billing"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all">
            <Zap className="w-3.5 h-3.5" /> Upgrade to Pro — $29/mo
          </Link>
        </div>
      )}
    </div>
  )
}
