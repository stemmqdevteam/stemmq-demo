'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Building2, Users, GitBranch,
  DollarSign, Crown, Zap, Shield, Search, ChevronDown,
  Check, Mail, RefreshCw, TrendingUp, ShieldAlert, Copy,
  Activity, FlaskConical, Brain, ArrowUpRight,
  Settings, CircleCheck, UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatDate, formatRelativeTime } from '@/utils'

/* ── Types ─────────────────────────────────────────────── */
interface Stats {
  total_orgs: number; total_users: number; total_decisions: number
  total_assumptions: number; total_simulations: number
  mrr_usd: number; arr_usd: number
  free_orgs: number; pro_orgs: number; enterprise_orgs: number
  new_orgs_today: number; new_orgs_week: number; new_orgs_month: number
  new_users_month: number; new_decisions_week: number
  active_decisions: number; resolved_decisions: number; admin_count: number
}
interface OrgRow {
  id: string; name: string; plan: string; created_at: string
  decision_count: number; simulation_count: number
  subscription: {
    status: string
    stripe_customer_id: string | null
    current_period_end: string | null
  } | null
}
interface UserRow {
  id: string; full_name: string | null; avatar_url: string | null
  job_title: string | null; is_admin: boolean; created_at: string
}
interface DecisionRow {
  id: string; org_id: string; org_name: string
  status: string; intent: string; created_at: string
}
interface CurrentAdmin { id: string; full_name: string | null }

/* ── Plan config ───────────────────────────────────────── */
const PLAN = {
  free:       { label: 'Free',       Icon: Shield, badge: 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]' },
  pro:        { label: 'Pro',        Icon: Zap,    badge: 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800' },
  enterprise: { label: 'Enterprise', Icon: Crown,  badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
} as const

const TABS = [
  { id: 'overview',      label: 'Overview',      Icon: LayoutDashboard },
  { id: 'organizations', label: 'Organizations',  Icon: Building2 },
  { id: 'users',         label: 'Users',          Icon: Users },
  { id: 'decisions',     label: 'Decisions',      Icon: GitBranch },
  { id: 'revenue',       label: 'Revenue',        Icon: DollarSign },
  { id: 'support',       label: 'Support',        Icon: Mail },
] as const
type TabId = typeof TABS[number]['id']

/* ── Shared UI ─────────────────────────────────────────── */
function PlanBadge({ orgId, plan, onDone }: { orgId: string; plan: string; onDone: () => void }) {
  const [open, setOpen]              = useState(false)
  const [isPending, startTransition] = useTransition()
  const cfg = PLAN[plan as keyof typeof PLAN] ?? PLAN.free

  const set = (next: string) => {
    if (next === plan) { setOpen(false); return }
    startTransition(async () => {
      const res  = await fetch('/api/admin/set-plan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, plan: next }),
      })
      const data = await res.json()
      data.success ? toast.success(`Plan → ${next}`) : toast.error(data.error ?? 'Failed')
      setOpen(false)
      onDone()
    })
  }

  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen((v) => !v)} disabled={isPending}
        className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all hover:opacity-80', cfg.badge)}>
        {isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : <cfg.Icon className="w-3 h-3" />}
        {cfg.label}
        <ChevronDown className={cn('w-3 h-3 opacity-50 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-30 w-40 bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-xl overflow-hidden py-1">
            {(Object.entries(PLAN) as [string, typeof PLAN.free][]).map(([p, c]) => (
              <button key={p} onClick={() => set(p)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-[var(--muted)] transition-colors">
                <c.Icon className="w-3.5 h-3.5 text-[var(--muted-foreground)] flex-shrink-0" />
                <span className="flex-1 text-left font-medium capitalize">{c.label}</span>
                {p === plan && <Check className="w-3 h-3 text-brand-500 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function KPI({ label, value, sub, trend, trendUp, Icon, color, index }: {
  label: string; value: string | number; sub?: string; trend?: string; trendUp?: boolean
  Icon: React.ElementType; color: string; index: number
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" /> {trend}
          </span>
        )}
      </div>
      <div>
        <p className="font-display font-bold text-3xl leading-none mb-1">{value}</p>
        <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
        {sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

function TH({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return (
    <th className={cn('px-5 py-3 text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider bg-[var(--background)]/80 dark:bg-[var(--muted)]/40', right ? 'text-right' : 'text-left')}>
      {children}
    </th>
  )
}

function TableCard({ children, toolbar }: { children: React.ReactNode; toolbar?: React.ReactNode }) {
  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
      {toolbar && <div className="px-5 py-4 border-b border-[var(--border)]">{toolbar}</div>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">{children}</table>
      </div>
    </div>
  )
}

/* ── OVERVIEW TAB ──────────────────────────────────────── */
function OverviewTab({ stats, orgs, recentDecisions }: {
  stats: Stats; orgs: OrgRow[]; recentDecisions: DecisionRow[]
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Monthly Revenue"    value={`$${stats.mrr_usd.toLocaleString()}`}   sub={`ARR $${stats.arr_usd.toLocaleString()}`} trend={`${stats.pro_orgs + stats.enterprise_orgs} paying`} Icon={DollarSign}  color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" index={0} />
        <KPI label="Organizations"      value={stats.total_orgs}                        sub={`${stats.free_orgs} free · ${stats.pro_orgs} pro · ${stats.enterprise_orgs} ent`} trend={`+${stats.new_orgs_month}/mo`} Icon={Building2}   color="bg-brand-50 dark:bg-brand-950/40 text-brand-600"     index={1} />
        <KPI label="Users"              value={stats.total_users}                       trend={`+${stats.new_users_month}/mo`}                                                  Icon={Users}       color="bg-purple-50 dark:bg-purple-950/40 text-purple-600"   index={2} />
        <KPI label="Decisions"          value={stats.total_decisions}                   sub={`${stats.active_decisions} active · ${stats.resolved_decisions} resolved`} trend={`+${stats.new_decisions_week}/wk`} Icon={GitBranch}   color="bg-amber-50 dark:bg-amber-950/40 text-amber-600"     index={3} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Assumptions"   value={stats.total_assumptions}  Icon={Brain}       color="bg-red-50 dark:bg-red-950/40 text-red-600"     index={4} />
        <KPI label="Simulations"   value={stats.total_simulations}  Icon={FlaskConical} color="bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600"  index={5} />
        <KPI label="New today"     value={stats.new_orgs_today}     Icon={Activity}    color="bg-teal-50 dark:bg-teal-950/40 text-teal-600"   index={6} />
        <KPI label="Admin accounts" value={stats.admin_count}       Icon={ShieldAlert} color="bg-[var(--muted)] text-[var(--muted-foreground)]" index={7} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {(['free', 'pro', 'enterprise'] as const).map((plan, i) => {
          const count = plan === 'free' ? stats.free_orgs : plan === 'pro' ? stats.pro_orgs : stats.enterprise_orgs
          const pct   = stats.total_orgs > 0 ? Math.round((count / stats.total_orgs) * 100) : 0
          const cfg   = PLAN[plan]
          const rev   = plan === 'free' ? '$0/mo' : plan === 'pro' ? `$${(stats.pro_orgs * 29).toLocaleString()}/mo` : 'Custom'
          return (
            <motion.div key={plan} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
              className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border', cfg.badge)}>
                  <cfg.Icon className="w-3.5 h-3.5" /> {cfg.label}
                </span>
                <span className="text-xs text-[var(--muted-foreground)] font-medium">{rev}</span>
              </div>
              <p className="font-display font-bold text-4xl leading-none mb-1">{count}</p>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">{pct}% of orgs</p>
              <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: 'easeOut', delay: 0.6 + i * 0.1 }}
                  className={cn('h-full rounded-full', { 'bg-[var(--muted)]': plan === 'free', 'bg-brand-500': plan === 'pro', 'bg-amber-500': plan === 'enterprise' })} />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div>
        <h2 className="font-display font-bold text-base mb-4">Recent decisions</h2>
        <TableCard>
          <thead>
            <tr className="border-b border-[var(--border)]">
              <TH>ID</TH><TH>Organization</TH><TH>Intent</TH><TH>Status</TH><TH>When</TH>
            </tr>
          </thead>
          <tbody>
            {recentDecisions.slice(0, 10).map((d) => (
              <tr key={d.id} className="border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--background)]/40 dark:hover:bg-[var(--muted)]/20 transition-colors">
                <td className="px-5 py-3.5"><p className="text-xs font-mono text-[var(--muted-foreground)]">{d.id.slice(0, 8)}…</p></td>
                <td className="px-5 py-3.5"><p className="text-sm font-medium">{d.org_name}</p></td>
                <td className="px-5 py-3.5"><span className="text-xs capitalize bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-full">{d.intent}</span></td>
                <td className="px-5 py-3.5">
                  <span className={cn('text-xs font-medium capitalize px-2 py-0.5 rounded-full', {
                    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400': d.status === 'active',
                    'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400': d.status === 'resolved',
                    'bg-[var(--muted)] text-[var(--muted-foreground)] dark:bg-[var(--muted)]': d.status === 'draft',
                  })}>{d.status}</span>
                </td>
                <td className="px-5 py-3.5"><span className="text-xs text-[var(--muted-foreground)]">{formatRelativeTime(d.created_at)}</span></td>
              </tr>
            ))}
            {recentDecisions.length === 0 && (
              <tr><td colSpan={5} className="py-12 text-center text-sm text-[var(--muted-foreground)]">No decisions yet.</td></tr>
            )}
          </tbody>
        </TableCard>
      </div>
    </div>
  )
}

/* ── ORGANIZATIONS TAB ─────────────────────────────────── */
function OrgsTab({ orgs, refresh }: { orgs: OrgRow[]; refresh: () => void }) {
  const [search, setSearch]         = useState('')
  const [planFilter, setPlanFilter] = useState('all')

  const filtered = orgs.filter((o) => {
    const q = search.toLowerCase()
    return (o.name.toLowerCase().includes(q) || o.id.includes(q)) && (planFilter === 'all' || o.plan === planFilter)
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {(['free', 'pro', 'enterprise'] as const).map((p) => {
          const count = orgs.filter((o) => o.plan === p).length
          const cfg   = PLAN[p]
          return (
            <div key={p} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 flex items-center gap-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', cfg.badge.split(' ').slice(0, 2).join(' '))}>
                <cfg.Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl leading-none">{count}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{cfg.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <TableCard toolbar={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-semibold text-sm">All organizations</h3>
            <span className="text-[11px] bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-full font-medium">{filtered.length}/{orgs.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)] pointer-events-none" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
                className="h-9 w-48 pl-9 pr-3 text-xs rounded-xl border border-[var(--border)] bg-[var(--muted)] outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-[var(--card)] transition-all" />
            </div>
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}
              className="h-9 px-3 text-xs rounded-xl border border-[var(--border)] bg-[var(--muted)] outline-none focus:border-brand-500 transition-all text-[var(--muted-foreground)]">
              <option value="all">All plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      }>
        <thead>
          <tr className="border-b border-[var(--border)]">
            <TH>Organization</TH><TH>Plan</TH><TH>Status</TH>
            <TH right>Decisions</TH><TH right>Sims</TH><TH>Joined</TH><TH />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={7} className="py-16 text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-[var(--foreground)] dark:text-[var(--muted-foreground)]" />
              <p className="text-sm text-[var(--muted-foreground)]">No organizations found.</p>
            </td></tr>
          ) : filtered.map((org, i) => {
            const isActive = org.subscription?.status === 'active' || org.plan === 'free'
            return (
              <motion.tr key={org.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--background)]/60 dark:hover:bg-[var(--muted)]/20 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-bold flex-shrink-0">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate max-w-[160px]">{org.name}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)] font-mono">{org.id.slice(0, 8)}…</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4"><PlanBadge orgId={org.id} plan={org.plan} onDone={refresh} /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('w-1.5 h-1.5 rounded-full', isActive ? 'bg-emerald-500' : 'bg-amber-500')} />
                    <span className={cn('text-xs font-medium capitalize', isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400')}>
                      {org.subscription?.status ?? (org.plan === 'free' ? 'free' : '—')}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right"><span className="text-sm font-mono font-semibold text-[var(--muted-foreground)]">{org.decision_count}</span></td>
                <td className="px-4 py-4 text-right"><span className="text-sm font-mono text-[var(--muted-foreground)]">{org.simulation_count}</span></td>
                <td className="px-4 py-4 whitespace-nowrap"><span className="text-xs text-[var(--muted-foreground)]">{formatDate(org.created_at)}</span></td>
                <td className="px-4 py-4">
                  <button onClick={() => { navigator.clipboard.writeText(org.id); toast.success('Copied') }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-all">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </TableCard>

      {filtered.length > 0 && (
        <p className="text-xs text-[var(--muted-foreground)] text-right px-1">
          Showing {filtered.length} of {orgs.length} · Plan changes apply immediately
        </p>
      )}
    </div>
  )
}

/* ── USERS TAB ─────────────────────────────────────────── */
function UsersTab({ users }: { users: UserRow[] }) {
  const [search, setSearch] = useState('')
  const filtered = users.filter((u) => (u.full_name ?? '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total users',   value: users.length,                          Icon: Users,      color: 'bg-brand-50 dark:bg-brand-950/40 text-brand-600' },
          { label: 'Admin users',   value: users.filter((u) => u.is_admin).length,   Icon: ShieldAlert, color: 'bg-red-50 dark:bg-red-950/40 text-red-600' },
          { label: 'Regular users', value: users.filter((u) => !u.is_admin).length,  Icon: UserCheck,   color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 flex items-center gap-4">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.color)}>
              <s.Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-bold text-2xl leading-none">{s.value}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <TableCard toolbar={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-semibold text-sm">All users</h3>
            <span className="text-[11px] bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-full font-medium">{filtered.length}/{users.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)] pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…"
              className="h-9 w-48 pl-9 pr-3 text-xs rounded-xl border border-[var(--border)] bg-[var(--muted)] outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-[var(--card)] transition-all" />
          </div>
        </div>
      }>
        <thead>
          <tr className="border-b border-[var(--border)]">
            <TH>User</TH><TH>Role</TH><TH>Job title</TH><TH>Joined</TH><TH />
          </tr>
        </thead>
        <tbody>
          {filtered.map((u, i) => (
            <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className="border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--background)]/60 dark:hover:bg-[var(--muted)]/20 transition-colors group">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-bold flex-shrink-0 overflow-hidden">
                    {u.avatar_url
                      ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                      : (u.full_name?.charAt(0) ?? '?').toUpperCase()
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate max-w-[160px]">{u.full_name ?? 'Unnamed'}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] font-mono">{u.id.slice(0, 8)}…</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                {u.is_admin ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-2.5 py-1 rounded-full">
                    <ShieldAlert className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-[var(--muted)] text-[var(--muted-foreground)] px-2.5 py-1 rounded-full">
                    <UserCheck className="w-3 h-3" /> Member
                  </span>
                )}
              </td>
              <td className="px-4 py-4"><span className="text-sm text-[var(--muted-foreground)]">{u.job_title ?? '—'}</span></td>
              <td className="px-4 py-4 whitespace-nowrap"><span className="text-xs text-[var(--muted-foreground)]">{formatDate(u.created_at)}</span></td>
              <td className="px-4 py-4">
                <button onClick={() => { navigator.clipboard.writeText(u.id); toast.success('User ID copied') }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-all">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </td>
            </motion.tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={5} className="py-12 text-center text-sm text-[var(--muted-foreground)]">No users found.</td></tr>
          )}
        </tbody>
      </TableCard>
    </div>
  )
}

/* ── DECISIONS TAB ─────────────────────────────────────── */
function DecisionsTab({ decisions, stats }: { decisions: DecisionRow[]; stats: Stats }) {
  const [search, setSearch] = useState('')
  const filtered = decisions.filter((d) =>
    d.org_name.toLowerCase().includes(search.toLowerCase()) || d.id.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total"      value={stats.total_decisions}       Icon={GitBranch}  color="bg-brand-50 dark:bg-brand-950/40 text-brand-600"   index={0} />
        <KPI label="Active"     value={stats.active_decisions}      Icon={Activity}   color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" index={1} />
        <KPI label="Resolved"   value={stats.resolved_decisions}    Icon={CircleCheck} color="bg-blue-50 dark:bg-blue-950/40 text-blue-600"      index={2} />
        <KPI label="This week"  value={stats.new_decisions_week}    Icon={TrendingUp} color="bg-amber-50 dark:bg-amber-950/40 text-amber-600"   index={3} />
      </div>

      <TableCard toolbar={
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-sm">All decisions</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)] pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
              className="h-9 w-48 pl-9 pr-3 text-xs rounded-xl border border-[var(--border)] bg-[var(--muted)] outline-none focus:border-brand-500 transition-all" />
          </div>
        </div>
      }>
        <thead>
          <tr className="border-b border-[var(--border)]">
            <TH>ID</TH><TH>Organization</TH><TH>Intent</TH><TH>Status</TH><TH>Created</TH>
          </tr>
        </thead>
        <tbody>
          {filtered.slice(0, 50).map((d) => (
            <tr key={d.id} className="border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--background)]/40 dark:hover:bg-[var(--muted)]/20 transition-colors">
              <td className="px-5 py-3.5"><p className="text-xs font-mono text-[var(--muted-foreground)]">{d.id.slice(0, 8)}…</p></td>
              <td className="px-5 py-3.5"><p className="text-sm font-medium">{d.org_name}</p></td>
              <td className="px-5 py-3.5"><span className="text-xs capitalize bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-full">{d.intent}</span></td>
              <td className="px-5 py-3.5">
                <span className={cn('text-xs font-medium capitalize px-2 py-0.5 rounded-full', {
                  'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400': d.status === 'active',
                  'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400': d.status === 'resolved',
                  'bg-[var(--muted)] text-[var(--muted-foreground)] dark:bg-[var(--muted)]': d.status === 'draft',
                })}>{d.status}</span>
              </td>
              <td className="px-5 py-3.5"><span className="text-xs text-[var(--muted-foreground)]">{formatRelativeTime(d.created_at)}</span></td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={5} className="py-12 text-center text-sm text-[var(--muted-foreground)]">No decisions found.</td></tr>
          )}
        </tbody>
      </TableCard>
    </div>
  )
}

/* ── REVENUE TAB ───────────────────────────────────────── */
function RevenueTab({ stats, orgs }: { stats: Stats; orgs: OrgRow[] }) {
  const paying = orgs.filter((o) => o.plan !== 'free')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KPI label="Monthly Recurring Revenue" value={`$${stats.mrr_usd.toLocaleString()}`} sub="Estimated from plan counts" Icon={DollarSign} color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" index={0} />
        <KPI label="Annual Run Rate"            value={`$${stats.arr_usd.toLocaleString()}`} sub="MRR × 12"                   Icon={TrendingUp} color="bg-brand-50 dark:bg-brand-950/40 text-brand-600"   index={1} />
        <KPI label="Paying customers"           value={stats.pro_orgs + stats.enterprise_orgs} sub={`${stats.pro_orgs} Pro · ${stats.enterprise_orgs} Enterprise`} Icon={Crown} color="bg-amber-50 dark:bg-amber-950/40 text-amber-600" index={2} />
      </div>

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
        <h3 className="font-display font-semibold text-sm mb-5">Revenue by plan</h3>
        <div className="space-y-4">
          {[
            { label: 'Pro plan ($29/org/mo)',        count: stats.pro_orgs,        price: 29,  color: 'bg-brand-500' },
            { label: 'Enterprise plan ($299/org/mo)', count: stats.enterprise_orgs, price: 299, color: 'bg-amber-500' },
          ].map((r) => {
            const rev = r.count * r.price
            const pct = stats.mrr_usd > 0 ? Math.round((rev / stats.mrr_usd) * 100) : 0
            return (
              <div key={r.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{r.label}</span>
                  <span className="text-[var(--muted-foreground)]">{r.count} orgs · ${rev.toLocaleString()}/mo</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={cn('h-full rounded-full', r.color)} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="font-display font-bold text-base mb-4">Paying organizations</h2>
        <TableCard>
          <thead>
            <tr className="border-b border-[var(--border)]">
              <TH>Organization</TH><TH>Plan</TH><TH>Status</TH><TH>Billing</TH><TH>Renews</TH>
            </tr>
          </thead>
          <tbody>
            {paying.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-sm text-[var(--muted-foreground)]">No paying customers yet.</td></tr>
            ) : paying.map((org) => (
              <tr key={org.id} className="border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--background)]/40 dark:hover:bg-[var(--muted)]/20 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 text-xs font-bold">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold">{org.name}</p>
                  </div>
                </td>
                <td className="px-5 py-3.5"><PlanBadge orgId={org.id} plan={org.plan} onDone={() => window.location.reload()} /></td>
                <td className="px-5 py-3.5">
                  <span className={cn('text-xs font-medium capitalize', org.subscription?.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600')}>
                    {org.subscription?.status ?? '—'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs text-[var(--muted-foreground)]">{org.subscription?.stripe_customer_id ? '✓ Stripe connected' : 'Manual'}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs text-[var(--muted-foreground)]">{org.subscription?.current_period_end ? formatDate(org.subscription.current_period_end) : '—'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      </div>
    </div>
  )
}

/* ── SUPPORT TAB ───────────────────────────────────────── */
function SupportTab() {
  const channels = [
    { Icon: Mail,       title: 'General',    email: 'hello@stemmq.com',      desc: 'Questions, feedback, feature requests.',      color: 'bg-brand-50 dark:bg-brand-950/40 text-brand-600' },
    { Icon: Crown,      title: 'Enterprise', email: 'enterprise@stemmq.com', desc: 'Custom plans, SSO, contracts.',                color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' },
    { Icon: ShieldAlert, title: 'Security',  email: 'security@stemmq.com',   desc: 'Vulnerability reports, data concerns.',       color: 'bg-red-50 dark:bg-red-950/40 text-red-600' },
    { Icon: Settings,   title: 'Support',    email: 'support@stemmq.com',    desc: 'Bugs, account issues, technical problems.',   color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600' },
  ]

  const sqlActions = [
    {
      title: 'Make user admin',
      sql:  `UPDATE public.user_profiles SET is_admin = true WHERE id = 'user-uuid';`,
      desc: 'Grant admin access to a user.',
    },
    {
      title: 'Revoke admin',
      sql:  `UPDATE public.user_profiles SET is_admin = false WHERE id = 'user-uuid';`,
      desc: 'Remove admin access.',
    },
    {
      title: 'Manually upgrade org to Pro',
      sql:  `UPDATE public.organizations SET plan = 'pro' WHERE id = 'org-uuid';\nUPDATE public.subscriptions SET plan = 'pro', status = 'active' WHERE org_id = 'org-uuid';`,
      desc: 'Use when customer pays outside Stripe.',
    },
    {
      title: 'Full user overview',
      sql:  `SELECT u.email, p.full_name, p.is_admin, o.name as org, o.plan\nFROM auth.users u\nJOIN public.user_profiles p ON p.id = u.id\nJOIN public.org_members m ON m.user_id = u.id\nJOIN public.organizations o ON o.id = m.org_id\nORDER BY u.created_at DESC;`,
      desc: 'All users with their org and plan.',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-base mb-4">Support channels</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {channels.map((c) => (
            <div key={c.email} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 flex gap-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', c.color)}>
                <c.Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-0.5">{c.title}</p>
                <p className="text-xs text-[var(--muted-foreground)] mb-3 leading-relaxed">{c.desc}</p>
                <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
                  <Mail className="w-3 h-3" /> {c.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display font-bold text-base mb-4">SQL quick actions</h2>
        <div className="space-y-3">
          {sqlActions.map((a) => (
            <div key={a.title} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{a.desc}</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(a.sql); toast.success('SQL copied') }}
                  className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] bg-[var(--muted)] hover:bg-[var(--muted)] hover:bg-[var(--muted)] px-3 py-1.5 rounded-lg transition-all flex-shrink-0">
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <pre className="px-5 py-4 text-xs text-[var(--muted-foreground)] font-mono leading-relaxed overflow-x-auto bg-[var(--background)]/50 dark:bg-[var(--muted)]/30 whitespace-pre-wrap">
                {a.sql}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/40 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">Enterprise workflow</p>
            <ol className="text-xs text-amber-800/70 dark:text-amber-400/70 space-y-1.5 leading-relaxed list-decimal list-inside">
              <li>Customer emails <strong>enterprise@stemmq.com</strong></li>
              <li>Schedule call, discuss requirements, agree pricing</li>
              <li>Sign MSA/DPA if required. Collect payment (Stripe or bank)</li>
              <li>Go to <strong>Organizations tab</strong> → find org → switch plan to Enterprise</li>
              <li>Send onboarding email with SSO setup instructions</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════ */
export function AdminDashboard({ stats, orgs, users, recentDecisions, currentAdmin }: {
  stats: Stats
  orgs: OrgRow[]
  users: UserRow[]
  recentDecisions: DecisionRow[]
  currentAdmin: CurrentAdmin
}) {
  const [tab, setTab] = useState<TabId>('overview')
  const refresh       = () => window.location.reload()

  return (
    <div className="min-h-screen bg-[var(--background)]/60 dark:bg-[#0a0908]">

      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[var(--card)]/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-sm">Admin Panel</span>
                <span className="ml-2 text-[10px] bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">Restricted</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-0.5">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    tab === t.id
                      ? 'bg-[var(--muted)] text-[var(--foreground)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50'
                  )}>
                  <t.Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={refresh}
                className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] bg-[var(--muted)] hover:bg-[var(--muted)] hover:bg-[var(--muted)] px-3 py-2 rounded-xl transition-all font-medium">
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <a href="/dashboard"
                className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-2 rounded-xl transition-all font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </a>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden flex items-center gap-1.5 pb-3 overflow-x-auto">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                  tab === t.id
                    ? 'bg-[var(--card)] dark:bg-[var(--muted)] text-white dark:text-[var(--foreground)]'
                    : 'text-[var(--muted-foreground)] bg-[var(--muted)]'
                )}>
                <t.Icon className="w-3 h-3" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
            {tab === 'overview'      && <OverviewTab stats={stats} orgs={orgs} recentDecisions={recentDecisions} />}
            {tab === 'organizations' && <OrgsTab orgs={orgs} refresh={refresh} />}
            {tab === 'users'         && <UsersTab users={users} />}
            {tab === 'decisions'     && <DecisionsTab decisions={recentDecisions} stats={stats} />}
            {tab === 'revenue'       && <RevenueTab stats={stats} orgs={orgs} />}
            {tab === 'support'       && <SupportTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
