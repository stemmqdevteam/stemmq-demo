'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch, Brain, Target, Activity,
  Plus, Sparkles, BarChart3,
  ChevronRight, Zap, ArrowUpRight, CheckCircle2,
  Star, Calendar, Clock, Flame,
} from 'lucide-react'
import { useAuth } from '@/hooks'
import { useOrgStore, usePlan } from '@/store'
import { cn, formatRelativeTime, intentBadgeClass, statusBadgeClass } from '@/utils'
import { ROUTES, INTENT_LABELS, DECISION_STATUS_LABELS } from '@/constants'
import type { DashboardStats } from '@/types'
import { useEffect, useRef, useState } from 'react'

interface RecentDecision {
  id: string; title: string; intent: string
  status: string; quality_score: number | null; created_at: string
}
interface Props {
  stats: DashboardStats
  recentDecisions: RecentDecision[]
  serverFirstName?: string | null
}

/* Animated counter rolling up from 0 */
function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (started.current || value === 0) { if (value === 0) setDisplay(0); return }
    started.current = true
    const timeout = setTimeout(() => {
      const duration = 900
      const start = Date.now()
      const tick = () => {
        const elapsed = Date.now() - start
        const t = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setDisplay(Math.round(eased * value))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  return <>{display}</>
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const up = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] } },
}

/* KPI card */
function KPICard({
  label, value, icon: Icon, gradient, href, badge, badgeClass, index,
}: {
  label: string; value: number | string
  icon: React.ElementType; gradient: string; href: string
  badge?: string; badgeClass?: string; index: number
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div variants={up}>
      <Link href={href} className="block h-full group"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <motion.div
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.2,ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          className="relative h-full bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 transition-shadow duration-300"
          style={{ boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-start justify-between mb-5">
            <motion.div
              animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
              className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm', gradient)}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6, y: hovered ? 0 : 6 }}
              transition={{ duration: 0.18 }}
            >
              <ArrowUpRight className="w-4 h-4 text-[var(--accent)]" />
            </motion.div>
          </div>

          <p className="font-display font-bold text-[30px] leading-none tracking-tight text-[var(--foreground)] tabular-nums mb-1.5">
            {typeof value === 'number'
              ? <AnimatedNumber value={value} delay={150 + index * 80} />
              : value}
          </p>
          <p className="text-[12px] font-medium text-[var(--muted-foreground)]">{label}</p>

          {badge && (
            <motion.span
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={cn('inline-flex items-center mt-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide', badgeClass)}
            >
              {badge}
            </motion.span>
          )}
        </motion.div>
      </Link>
    </motion.div>
  )
}

/* Quick action */
function Action({ label, desc, href, icon: Icon, gradient }: {
  label: string; desc: string; href: string; icon: React.ElementType; gradient: string
}) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div variants={up}>
      <Link href={href}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[var(--muted)] transition-colors group">
        <motion.div
          animate={{ scale: hov ? 1.12 : 1, rotate: hov ? -5 : 0 }}
          transition={{ duration: 0.18 }}
          className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm', gradient)}
        >
          <Icon style={{ width: 18, height: 18 }} className="text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-tight">{label}</p>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 leading-tight">{desc}</p>
        </div>
        <motion.div animate={{ x: hov ? 3 : 0, opacity: hov ? 1 : 0.35 }} transition={{ duration: 0.14 }}>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] flex-shrink-0" />
        </motion.div>
      </Link>
    </motion.div>
  )
}

/* Decision row */
function DecisionRow({ d, index }: { d: RecentDecision; index: number }) {
  const dotColor: Record<string, string> = {
    active: 'bg-emerald-500', resolved: 'bg-blue-400',
    draft: 'bg-amber-400', archived: 'bg-[var(--muted-foreground)]',
  }
  const scoreColor = d.quality_score == null ? ''
    : d.quality_score >= 80 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
    : d.quality_score >= 60 ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
    : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay: 0.28 + index * 0.055, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`${ROUTES.decisions}/${d.id}`}
        className="group flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--muted)]/60 transition-colors border-b border-[var(--border)] last:border-0">
        <span className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-0.5', dotColor[d.status] ?? 'bg-[var(--muted-foreground)]')} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[var(--foreground)] truncate group-hover:text-[var(--accent)] transition-colors">{d.title}</p>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 flex items-center gap-1">
            <Clock style={{ width: 11, height: 11 }} className="flex-shrink-0 opacity-60" />
            {formatRelativeTime(d.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider hidden sm:inline-flex', intentBadgeClass(d.intent))}>
            {INTENT_LABELS[d.intent as keyof typeof INTENT_LABELS] ?? d.intent}
          </span>
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider hidden md:inline-flex', statusBadgeClass(d.status))}>
            {DECISION_STATUS_LABELS[d.status as keyof typeof DECISION_STATUS_LABELS] ?? d.status}
          </span>
          {d.quality_score != null && (
            <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-lg tabular-nums', scoreColor)}>
              {d.quality_score}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

/* Empty state */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-5"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-950/60 dark:to-brand-950/30 flex items-center justify-center border border-brand-200/50 dark:border-brand-800/30">
          <GitBranch className="w-7 h-7 text-brand-500" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl border-2 border-brand-400/25"
        />
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 380, damping: 14 }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center"
          style={{ boxShadow: '0 4px 12px rgba(91,91,214,0.4)' }}
        >
          <Plus style={{ width: 13, height: 13 }} className="text-white" />
        </motion.div>
      </motion.div>
      <p className="font-semibold text-sm text-[var(--foreground)] mb-1.5">No decisions yet</p>
      <p className="text-[13px] text-[var(--muted-foreground)] mb-6 max-w-[220px] leading-relaxed">
        Create your first decision to start tracking outcomes and building decision intelligence.
      </p>
      <Link
        href={ROUTES.newDecision}
        className="inline-flex items-center gap-2 bg-[var(--accent)] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
        style={{ boxShadow: '0 4px 20px rgba(91,91,214,0.35)' }}
      >
        <Plus style={{ width: 14, height: 14 }} /> Create decision
      </Link>
    </motion.div>
  )
}

/* Health stacked bar */
function HealthBar({ active, resolved, total }: { active: number; resolved: number; total: number }) {
  const draft = Math.max(0, total - active - resolved)
  const pA = total > 0 ? (active / total) * 100 : 0
  const pR = total > 0 ? (resolved / total) * 100 : 0
  const pD = total > 0 ? (draft / total) * 100 : 0
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="space-y-3">
      <div className="flex h-2.5 rounded-full overflow-hidden bg-[var(--muted)] gap-0.5">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pA}%` }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.65 }}
          className="h-full bg-emerald-500 rounded-l-full" />
        <motion.div initial={{ width: 0 }} animate={{ width: `${pR}%` }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.75 }}
          className="h-full bg-blue-400" />
        <motion.div initial={{ width: 0 }} animate={{ width: `${pD}%` }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.85 }}
          className="h-full bg-amber-400 rounded-r-full" />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {[
          { label: 'Active', pct: pA, dot: 'bg-emerald-500' },
          { label: 'Resolved', pct: pR, dot: 'bg-blue-400' },
          { label: 'Draft', pct: pD, dot: 'bg-amber-400' },
        ].map(({ label, pct, dot }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dot)} />
            <span className="text-[11px] text-[var(--muted-foreground)]">{label}</span>
            <span className="text-[11px] font-bold text-[var(--foreground)]">{Math.round(pct)}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* Card shell */
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn('bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden', className)}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export function DashboardOverview({ stats, recentDecisions, serverFirstName }: Props) {
  const { profile, isLoading } = useAuth()
  const { org } = useOrgStore()
  const { plan } = usePlan()

  const displayName = profile?.full_name?.split(' ')[0] ?? serverFirstName ?? null
  const hour = new Date().getHours()
  const greeting = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const emoji = hour < 5 ? '🌙' : hour < 12 ? '☀️' : hour < 17 ? '👋' : '🌆'

  const kpis = [
    {
      label: 'Total Decisions',
      value: stats.total_decisions,
      icon: GitBranch,
      gradient: 'bg-gradient-to-br from-brand-500 to-violet-600',
      href: ROUTES.decisions,
      badge: 'All time',
      badgeClass: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-300',
      index: 0,
    },
    {
      label: 'Active',
      value: stats.active_decisions,
      icon: Activity,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      href: `${ROUTES.decisions}?status=active`,
      badge: stats.active_decisions > 0 ? `${stats.active_decisions} in progress` : 'None open',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
      index: 1,
    },
    {
      label: 'Pending Assumptions',
      value: stats.pending_assumptions,
      icon: Brain,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-500',
      href: ROUTES.assumptions,
      badge: 'Needs validation',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
      index: 2,
    },
    {
      label: 'Avg Quality Score',
      value: stats.avg_quality_score != null ? stats.avg_quality_score : '—',
      icon: Target,
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
      href: ROUTES.analytics,
      badge: stats.avg_quality_score != null
        ? stats.avg_quality_score >= 80 ? 'Excellent ✦'
          : stats.avg_quality_score >= 60 ? 'Good ▲'
          : 'Needs work ⚠'
        : 'No data yet',
      badgeClass: stats.avg_quality_score == null
        ? 'bg-[var(--muted)] text-[var(--muted-foreground)]'
        : stats.avg_quality_score >= 80
          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
          : stats.avg_quality_score >= 60
            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
            : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400',
      index: 3,
    },
  ]

  const actions = [
    { label: 'New decision',       desc: 'Start tracking an outcome',       href: ROUTES.newDecision,          icon: Plus,      gradient: 'bg-gradient-to-br from-brand-500 to-violet-600' },
    { label: 'Review assumptions', desc: 'Validate your open assumptions',  href: ROUTES.assumptions,          icon: Brain,     gradient: 'bg-gradient-to-br from-amber-500 to-orange-500' },
    { label: 'Run simulation',     desc: 'Model decision outcomes with AI', href: `${ROUTES.simulations}/new`, icon: Sparkles,  gradient: 'bg-gradient-to-br from-violet-500 to-purple-600' },
    { label: 'View analytics',     desc: 'See your performance metrics',    href: ROUTES.analytics,            icon: BarChart3, gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500' },
  ]

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.18, type: 'spring', stiffness: 320, damping: 14 }}
              className="text-2xl leading-none select-none"
            >
              {emoji}
            </motion.span>
            <h1 className="font-display text-[22px] sm:text-[24px] font-bold text-[var(--foreground)] tracking-tight leading-none">
              {greeting}{displayName ? `, ${displayName}` : ''}
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-1">
            {org?.name && (
              <>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] opacity-60">
                  {org.name}
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)] opacity-30 flex-shrink-0" />
              </>
            )}
            <Calendar style={{ width: 13, height: 13 }} className="text-[var(--muted-foreground)] opacity-50" />
            <span className="text-[13px] text-[var(--muted-foreground)]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.22, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={ROUTES.newDecision}
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.97] transition-all flex-shrink-0"
            style={{ boxShadow: '0 4px 20px rgba(91,91,214,0.32), 0 1px 4px rgba(91,91,214,0.18)' }}
          >
            <Plus style={{ width: 16, height: 16 }} />
            New Decision
          </Link>
        </motion.div>
      </motion.div>

      {/* KPI row */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7"
      >
        {kpis.map((k) => <KPICard key={k.label} {...k} />)}
      </motion.div>

      {/* 2-column layout */}
      <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">

        {/* Left: 2/3 */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">

          {/* Recent decisions */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-semibold text-[var(--foreground)]">Recent decisions</h2>
              <Link href={ROUTES.decisions}
                className="text-[12px] font-medium text-[var(--accent)] hover:underline underline-offset-2 flex items-center gap-0.5 group">
                View all
                <ChevronRight style={{ width: 12, height: 12 }} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <Card>
              {recentDecisions.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-2.5 bg-[var(--muted)]/40 border-b border-[var(--border)]">
                    {['Decision', 'Intent', 'Status', 'Score'].map(h => (
                      <span key={h} className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider last:text-right">
                        {h}
                      </span>
                    ))}
                  </div>
                  {recentDecisions.map((d, i) => <DecisionRow key={d.id} d={d} index={i} />)}
                </>
              )}
            </Card>
          </motion.div>

          {/* This month */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
            >
              <h2 className="text-[13px] font-semibold text-[var(--foreground)] mb-3">This month</h2>
            </motion.div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: GitBranch,    label: 'Decisions created',    value: stats.decisions_this_month ?? 0,                                                    delay: 0.38 },
                { icon: CheckCircle2, label: 'Decisions resolved',   value: stats.resolved_decisions ?? 0,                                                     delay: 0.44 },
                { icon: Target,       label: 'Assumption accuracy',  value: stats.assumption_accuracy != null ? `${stats.assumption_accuracy}%` : '—',  delay: 0.50 },
              ].map(({ icon: Icon, label, value, delay }) => (
                <motion.div key={label}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="p-4 !overflow-visible">
                    <div className="w-8 h-8 rounded-xl bg-[var(--muted)] flex items-center justify-center mb-3">
                      <Icon style={{ width: 15, height: 15 }} className="text-[var(--muted-foreground)]" />
                    </div>
                    <p className="font-display font-bold text-[26px] leading-none text-[var(--foreground)] tabular-nums mb-1.5">
                      {value}
                    </p>
                    <p className="text-[11px] text-[var(--muted-foreground)] leading-tight">{label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decision health */}
          {stats.total_decisions > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48 }}
            >
              <h2 className="text-[13px] font-semibold text-[var(--foreground)] mb-3">Decision health</h2>
              <Card className="p-4">
                <HealthBar
                  active={stats.active_decisions ?? 0}
                  resolved={stats.resolved_decisions ?? 0}
                  total={stats.total_decisions}
                />
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right: 1/3 */}
        <motion.div
          initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5 sm:space-y-6"
        >

          {/* Quick actions */}
          <div>
            <h2 className="text-[13px] font-semibold text-[var(--foreground)] mb-3">Quick actions</h2>
            <Card className="p-2">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-0.5">
                {actions.map((a) => <Action key={a.href} {...a} />)}
              </motion.div>
            </Card>
          </div>

          {/* Plan card */}
          {plan === 'free' ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div
                className="relative overflow-hidden rounded-2xl p-5"
                style={{ background: 'linear-gradient(135deg,#5b5bd6 0%,#4f46e5 45%,#7c3aed 100%)' }}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 8, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-flex w-9 h-9 rounded-xl bg-white/20 items-center justify-center mb-3"
                  >
                    <Zap style={{ width: 17, height: 17 }} className="text-white" fill="currentColor" />
                  </motion.div>
                  <p className="text-white font-bold text-[15px] mb-1">Upgrade to Pro</p>
                  <p className="text-white/70 text-[13px] mb-4 leading-relaxed">
                    Unlimited decisions, AI generation, simulations & team collaboration.
                  </p>
                  <Link
                    href={ROUTES.billing}
                    className="inline-flex items-center gap-1.5 bg-white text-brand-700 text-[12px] font-bold px-4 py-2 rounded-xl hover:bg-white/90 active:scale-[0.97] transition-all"
                  >
                    Upgrade now <ArrowUpRight style={{ width: 13, height: 13 }} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    plan === 'enterprise'
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                      : 'bg-gradient-to-br from-brand-500 to-violet-600',
                  )}>
                    <Star style={{ width: 16, height: 16 }} className="text-white" fill="currentColor" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[var(--foreground)] capitalize">{plan} plan</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">All features unlocked</p>
                  </div>
                  <Link
                    href={`${ROUTES.settings}/billing`}
                    className="text-[12px] font-semibold text-[var(--accent)] hover:underline underline-offset-2 flex-shrink-0"
                  >
                    Manage
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Pro tip */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58 }}
          >
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0"
                >
                  <Flame style={{ width: 15, height: 15 }} className="text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-[var(--foreground)] mb-1">Pro tip</p>
                  <p className="text-[12px] text-[var(--muted-foreground)] leading-relaxed">
                    Tag assumptions with a confidence level. Decisions with tracked assumptions have 40% better outcomes.
                  </p>
                  <Link
                    href={ROUTES.assumptions}
                    className="text-[11px] font-semibold text-[var(--accent)] mt-2 inline-flex items-center gap-0.5 hover:underline underline-offset-2"
                  >
                    Add assumption <ChevronRight style={{ width: 11, height: 11 }} />
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}