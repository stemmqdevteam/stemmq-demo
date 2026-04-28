'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, Brain, Target, BarChart3, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ScoreRing } from '@/components/ui/primitives'
import { cn, scoreTextColor } from '@/utils'

interface DecisionTrend {
  month: string
  decisions: number
  resolved: number
}

interface IntentBreakdown {
  intent: string
  count: number
  color: string
}

interface AssumptionAccuracy {
  month: string
  accuracy: number
  total: number
}

interface DQSDistribution {
  range: string
  count: number
}

interface AnalyticsData {
  total_decisions:      number
  resolved_decisions:   number
  avg_quality_score:    number | null
  assumption_accuracy:  number | null
  pending_assumptions:  number
  decisions_trend:      DecisionTrend[]
  intent_breakdown:     IntentBreakdown[]
  assumption_trend:     AssumptionAccuracy[]
  dqs_distribution:     DQSDistribution[]
  top_performers:       { title: string; score: number }[]
}

const COLORS = {
  brand:   '#6366f1',
  accent:  '#06b6d4',
  emerald: '#10b981',
  amber:   '#f59e0b',
  red:     '#ef4444',
  purple:  '#8b5cf6',
}

const INTENT_COLORS: Record<string, string> = {
  growth:     COLORS.emerald,
  efficiency: COLORS.accent,
  risk:       COLORS.red,
  experiment: COLORS.purple,
  other:      '#94a3b8',
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show:   (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

function StatCard({
  label, value, sub, icon: Icon, iconClass, index,
}: {
  label: string; value: string | number; sub?: string
  icon: React.ElementType; iconClass: string; index: number
}) {
  return (
    <motion.div variants={fadeUp} custom={index} initial="hidden" animate="show">
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconClass)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="font-display font-bold text-3xl mb-0.5">{value}</p>
        <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
        {sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
      </Card>
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 shadow-elevated text-sm">
      <p className="font-medium text-[var(--muted-foreground)] mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--muted-foreground)]">{p.name}:</span>
          <span className="font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const resolutionRate = data.total_decisions > 0
    ? Math.round((data.resolved_decisions / data.total_decisions) * 100)
    : 0

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-1">Analytics</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Decision intelligence metrics for your organization.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Decisions"     value={data.total_decisions}      sub={`${resolutionRate}% resolved`}    icon={BarChart3}  iconClass="bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400"   index={0} />
        <StatCard label="Avg Quality Score"   value={data.avg_quality_score != null ? `${Math.round(data.avg_quality_score)}` : '—'} sub="Decision Quality Score" icon={Award} iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" index={1} />
        <StatCard label="Assumption Accuracy" value={data.assumption_accuracy != null ? `${Math.round(data.assumption_accuracy)}%` : '—'} sub="Correct assumptions" icon={Brain} iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" index={2} />
        <StatCard label="Pending Assumptions" value={data.pending_assumptions}  sub="Need resolution"               icon={Target}     iconClass="bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"          index={3} />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Decisions over time */}
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show">
          <Card>
            <h3 className="font-display font-semibold text-sm mb-4">Decision activity</h3>
            {data.decisions_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data.decisions_trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradDecisions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.brand} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={COLORS.brand} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-100 dark:text-[var(--foreground)]" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="decisions" name="Created" stroke={COLORS.brand} fill="url(#gradDecisions)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="resolved"  name="Resolved" stroke={COLORS.emerald} fill="url(#gradResolved)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-[var(--muted-foreground)] text-sm">
                Create decisions to see trends
              </div>
            )}
          </Card>
        </motion.div>

        {/* Assumption accuracy over time */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show">
          <Card>
            <h3 className="font-display font-semibold text-sm mb-4">Assumption accuracy over time</h3>
            {data.assumption_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.assumption_trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-100 dark:text-[var(--foreground)]" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="accuracy" name="Accuracy %" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-[var(--muted-foreground)] text-sm">
                Resolve assumptions to see accuracy trends
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Intent breakdown pie */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="show">
          <Card>
            <h3 className="font-display font-semibold text-sm mb-4">Decisions by intent</h3>
            {data.intent_breakdown.filter((d) => d.count > 0).length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={data.intent_breakdown.filter((d) => d.count > 0)}
                      dataKey="count"
                      nameKey="intent"
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={75}
                      paddingAngle={3}
                    >
                      {data.intent_breakdown.map((entry) => (
                        <Cell key={entry.intent} fill={INTENT_COLORS[entry.intent] ?? '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                  {data.intent_breakdown.filter((d) => d.count > 0).map((d) => (
                    <div key={d.intent} className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                      <div className="w-2 h-2 rounded-full" style={{ background: INTENT_COLORS[d.intent] ?? '#94a3b8' }} />
                      {d.intent} ({d.count})
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-[var(--muted-foreground)] text-sm">
                No data yet
              </div>
            )}
          </Card>
        </motion.div>

        {/* DQS distribution */}
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="show">
          <Card>
            <h3 className="font-display font-semibold text-sm mb-4">Quality score distribution</h3>
            {data.dqs_distribution.some((d) => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.dqs_distribution} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-100 dark:text-[var(--foreground)]" />
                  <XAxis dataKey="range" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Decisions" fill={COLORS.brand} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-[var(--muted-foreground)] text-sm">
                No scored decisions yet
              </div>
            )}
          </Card>
        </motion.div>

        {/* Top decisions */}
        <motion.div variants={fadeUp} custom={8} initial="hidden" animate="show">
          <Card>
            <h3 className="font-display font-semibold text-sm mb-4">Top quality decisions</h3>
            {data.top_performers.length > 0 ? (
              <div className="space-y-3">
                {data.top_performers.slice(0, 5).map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-[var(--muted-foreground)] w-4 flex-shrink-0">{i + 1}</span>
                    <p className="flex-1 text-sm truncate text-[var(--muted-foreground)]">{d.title}</p>
                    <div className="flex-shrink-0">
                      <ScoreRing score={Math.round(d.score)} size={34} strokeWidth={3} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--muted-foreground)] text-sm py-8">
                No scored decisions yet
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
