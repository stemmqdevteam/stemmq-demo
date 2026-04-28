'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Edit2, Trash2, MoreHorizontal,
  Clock, DollarSign, RotateCcw, Users, Tag,
  Target, Brain, CheckCircle2, Archive, Play,
  FileText, AlertTriangle, ChevronRight,
  GitBranch, Zap, TrendingUp, Circle,
  CalendarDays, Hash, ShieldAlert,
} from 'lucide-react'
import { toast } from 'sonner'
import { changeDecisionStatus, deleteDecision } from '@/features/decisions/actions'
import { AssumptionPanel } from '@/features/assumptions/components/assumption-panel'
import { OutcomePanel } from '@/features/decisions/components/outcome-panel'
import { buttonClass } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScoreRing } from '@/components/ui/primitives'
import {
  cn, formatDate, formatRelativeTime, formatCurrency,
  intentBadgeClass, statusBadgeClass, scoreTextColor,
} from '@/utils'
import {
  ROUTES, INTENT_LABELS, DECISION_STATUS_LABELS,
  TIME_HORIZON_LABELS, REVERSIBILITY_LABELS,
} from '@/constants'
import type { Decision } from '@/types'

const INTENT_GRADIENT: Record<string, string> = {
  growth:     'from-brand-500 to-violet-600',
  efficiency: 'from-blue-500 to-cyan-500',
  risk:       'from-red-500 to-rose-600',
  experiment: 'from-purple-500 to-fuchsia-600',
  other:      'from-[var(--muted-foreground)] to-[var(--muted-foreground)]',
}
const STATUS_COLORS: Record<string, string> = {
  active:   'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  draft:    'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  resolved: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  archived: 'bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]',
}
const STATUS_DOT: Record<string, string> = {
  active: 'bg-emerald-500', draft: 'bg-amber-400', resolved: 'bg-blue-400', archived: 'bg-[var(--muted-foreground)]',
}
const STATUS_ACTIONS = [
  { status: 'active',   label: 'Mark active',   icon: Play,         color: 'text-emerald-600 dark:text-emerald-400' },
  { status: 'draft',    label: 'Move to draft',  icon: FileText,     color: 'text-amber-600 dark:text-amber-400' },
  { status: 'resolved', label: 'Resolve',        icon: CheckCircle2, color: 'text-blue-600 dark:text-blue-400' },
  { status: 'archived', label: 'Archive',        icon: Archive,      color: 'text-[var(--muted-foreground)]' },
] as const

function ResolveModal({ decisionId, onClose }: { decisionId: string; onClose: () => void }) {
  const [notes, setNotes] = useState('')
  const [isPending, startTransition] = useTransition()
  const handleResolve = () => {
    startTransition(async () => {
      const result = await changeDecisionStatus(decisionId, 'resolved', notes)
      if (result.success) { toast.success('Decision resolved'); onClose() }
      else toast.error(result.error)
    })
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[var(--foreground)]">Resolve this decision</h3>
            <p className="text-[12px] text-[var(--muted-foreground)]">Document what happened and what you learned.</p>
          </div>
        </div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} autoFocus
          placeholder="What was the outcome? What assumptions proved correct or incorrect?"
          className={cn(
            'w-full rounded-xl border-2 px-3.5 py-3 text-sm outline-none transition-all resize-none',
            'bg-[var(--muted)] text-[var(--foreground)]',
            'border-[var(--border)] placeholder:text-[var(--muted-foreground)]',
            'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15',
          )} />
        <div className="flex gap-2.5 justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors">
            Cancel
          </button>
          <button onClick={handleResolve} disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-all disabled:opacity-60"
            style={{ boxShadow: '0 4px 16px rgba(91,91,214,0.3)' }}>
            {isPending
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resolving…</>
              : <><CheckCircle2 className="w-3.5 h-3.5" />Resolve decision</>}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function MetaRow({ icon: Icon, label, value, className }: {
  icon: React.ElementType; label: string; value: string; className?: string
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[var(--border)] last:border-0">
      <div className="w-7 h-7 rounded-lg bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
        <Icon style={{ width: 13, height: 13 }} className="text-[var(--muted-foreground)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</p>
        <p className={cn('text-[13px] font-medium text-[var(--foreground)] mt-0.5 leading-tight', className)}>{value}</p>
      </div>
    </div>
  )
}

function QualityGauge({ score, breakdown }: { score: number; breakdown: { label: string; met: boolean }[] }) {
  const color = score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
  const barColor = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs work'
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" strokeWidth="5" stroke="currentColor" className="text-[var(--muted)]" />
            <motion.circle cx="32" cy="32" r="26" fill="none" strokeWidth="5"
              strokeLinecap="round" stroke="currentColor"
              className={score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'}
              initial={{ strokeDasharray: '0 163.4' }}
              animate={{ strokeDasharray: `${(score / 100) * 163.4} 163.4` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('text-lg font-display font-bold leading-none', color)}>{score}</span>
          </div>
        </div>
        <div>
          <p className={cn('text-base font-bold font-display', color)}>{label}</p>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Decision Quality Score</p>
        </div>
      </div>
      <div className="h-1.5 bg-[var(--muted)] rounded-full overflow-hidden mb-4">
        <motion.div className={cn('h-full rounded-full', barColor)}
          initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }} />
      </div>
      <div className="space-y-1.5">
        {breakdown.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={cn('w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0',
              item.met ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-[var(--muted)]')}>
              {item.met
                ? <CheckCircle2 style={{ width: 10, height: 10 }} className="text-emerald-600 dark:text-emerald-400" />
                : <Circle style={{ width: 10, height: 10 }} className="text-[var(--muted-foreground)]" />}
            </div>
            <span className={cn('text-[12px]', item.met ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] opacity-60')}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Tab({ active, onClick, children, count }: {
  active: boolean; onClick: () => void; children: React.ReactNode; count?: number
}) {
  return (
    <button onClick={onClick}
      className={cn(
        'relative flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold transition-colors whitespace-nowrap',
        active ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
      )}>
      {children}
      {count !== undefined && count > 0 && (
        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none',
          active ? 'bg-[var(--accent)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]')}>
          {count}
        </span>
      )}
      {active && (
        <motion.div layoutId="tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)] rounded-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
      )}
    </button>
  )
}

export function DecisionDetail({ decision, orgId, canEdit }: {
  decision: Decision; orgId: string; canEdit: boolean
}) {
  const [showMenu,    setShowMenu]    = useState(false)
  const [showResolve, setShowResolve] = useState(false)
  const [activeTab,   setActiveTab]   = useState<'assumptions' | 'outcomes' | 'context'>('assumptions')
  const [isPending, startTransition]  = useTransition()

  const isResolved = decision.status === 'resolved'
  const isArchived = decision.status === 'archived'
  const gradient   = INTENT_GRADIENT[decision.intent] ?? INTENT_GRADIENT.other
  const unresolvedCount = (decision.assumptions ?? []).filter(a => a.status === 'unknown').length

  const handleStatusChange = (status: typeof STATUS_ACTIONS[number]['status']) => {
    if (status === 'resolved') { setShowResolve(true); setShowMenu(false); return }
    startTransition(async () => {
      const result = await changeDecisionStatus(decision.id, status)
      if (result.success) toast.success(`Decision marked as ${DECISION_STATUS_LABELS[status]}`)
      else toast.error(result.error)
    })
    setShowMenu(false)
  }

  const handleDelete = async () => {
    if (!confirm('Permanently delete this decision? This cannot be undone.')) return
    await deleteDecision(decision.id)
  }

  const availableActions = STATUS_ACTIONS.filter(a => a.status !== decision.status)

  const qualityBreakdown = [
    { label: 'Has description',  met: !!decision.description },
    { label: 'Has reasoning',    met: !!decision.reasoning },
    { label: 'Has assumptions',  met: (decision.assumptions?.length ?? 0) > 0 },
    { label: 'Has outcomes',     met: (decision.expected_outcomes?.length ?? 0) > 0 },
    { label: 'Has time horizon', met: !!decision.time_horizon },
    { label: 'Has stakeholders', met: (decision.stakeholders?.length ?? 0) > 0 },
  ]

  return (
    <div className="min-h-full bg-[var(--background)]">
      <AnimatePresence>
        {showResolve && <ResolveModal decisionId={decision.id} onClose={() => setShowResolve(false)} />}
      </AnimatePresence>

      {/* Hero banner */}
      <div className={cn('relative overflow-hidden bg-gradient-to-br', gradient)} style={{ minHeight: 180 }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative px-5 sm:px-8 pt-5 pb-16">
          {/* Nav */}
          <div className="flex items-center justify-between mb-6">
            <Link href={ROUTES.decisions}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to decisions
            </Link>
            <div className="flex items-center gap-2">
              {canEdit && !isArchived && (
                <Link href={`${ROUTES.decisions}/${decision.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-white/15 hover:bg-white/25 text-white transition-all">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </Link>
              )}
              {canEdit && (
                <div className="relative">
                  <button onClick={() => setShowMenu(v => !v)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {showMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.12 }}
                          className="absolute right-0 top-full mt-1.5 w-48 bg-[var(--card)] rounded-2xl border border-[var(--border)] z-20 overflow-hidden py-1.5"
                          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                          {availableActions.map(action => (
                            <button key={action.status} onClick={() => handleStatusChange(action.status)} disabled={isPending}
                              className={cn('w-full text-left px-4 py-2.5 text-[13px] font-medium flex items-center gap-2.5 hover:bg-[var(--muted)] transition-colors', action.color)}>
                              <action.icon className="w-4 h-4 flex-shrink-0" /> {action.label}
                            </button>
                          ))}
                          <div className="border-t border-[var(--border)] my-1" />
                          <button onClick={handleDelete}
                            className="w-full text-left px-4 py-2.5 text-[13px] font-medium flex items-center gap-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                            <Trash2 className="w-4 h-4 flex-shrink-0" /> Delete decision
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white uppercase tracking-wide">
                {INTENT_LABELS[decision.intent] ?? decision.intent}
              </span>
              <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide', STATUS_COLORS[decision.status] ?? STATUS_COLORS.draft)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_DOT[decision.status] ?? 'bg-amber-400')} />
                {DECISION_STATUS_LABELS[decision.status] ?? decision.status}
              </span>
              {decision.category && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/15 text-white/90">
                  {decision.category}
                </span>
              )}
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug max-w-2xl">
              {decision.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Content — overlaps hero */}
      <div className="relative -mt-8 px-5 sm:px-8 pb-10">
        <div className="grid lg:grid-cols-3 gap-5 items-start">

          {/* Left 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {decision.description
                      ? <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{decision.description}</p>
                      : <p className="text-sm text-[var(--muted-foreground)] italic opacity-60">No description added.</p>}
                  </div>
                  {decision.quality_score != null && (
                    <div className="flex-shrink-0 flex flex-col items-center gap-1">
                      <ScoreRing score={Math.round(decision.quality_score)} size={56} strokeWidth={4} />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">DQS</p>
                    </div>
                  )}
                </div>
                {isResolved && decision.resolution_notes && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                    <p className="text-[11px] font-bold text-blue-700 dark:text-blue-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                      <CheckCircle2 style={{ width: 12, height: 12 }} /> Resolution notes
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300/80 leading-relaxed">{decision.resolution_notes}</p>
                  </div>
                )}
                {unresolvedCount > 0 && !isResolved && !isArchived && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 flex items-center gap-2.5">
                    <AlertTriangle style={{ width: 14, height: 14 }} className="text-amber-500 flex-shrink-0" />
                    <p className="text-[12px] text-amber-700 dark:text-amber-300 font-medium">
                      {unresolvedCount} assumption{unresolvedCount !== 1 ? 's' : ''} still pending validation
                    </p>
                    <button onClick={() => setActiveTab('assumptions')}
                      className="ml-auto text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:underline underline-offset-2">
                      Review →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div className="flex border-b border-[var(--border)] overflow-x-auto">
                  <Tab active={activeTab === 'assumptions'} onClick={() => setActiveTab('assumptions')} count={(decision.assumptions ?? []).length}>
                    <Brain style={{ width: 14, height: 14 }} /> Assumptions
                  </Tab>
                  <Tab active={activeTab === 'outcomes'} onClick={() => setActiveTab('outcomes')} count={(decision.expected_outcomes ?? []).length}>
                    <Target style={{ width: 14, height: 14 }} /> Outcomes
                  </Tab>
                  <Tab active={activeTab === 'context'} onClick={() => setActiveTab('context')}>
                    <FileText style={{ width: 14, height: 14 }} /> Context
                  </Tab>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="p-5">
                    {activeTab === 'assumptions' && (
                      <AssumptionPanel assumptions={decision.assumptions ?? []} decisionId={decision.id}
                        orgId={orgId} canEdit={canEdit && !isArchived} />
                    )}
                    {activeTab === 'outcomes' && (
                      <OutcomePanel outcomes={decision.outcomes ?? []} expectedOutcomes={decision.expected_outcomes ?? []}
                        decisionId={decision.id} orgId={orgId} canEdit={canEdit} />
                    )}
                    {activeTab === 'context' && (
                      <div className="space-y-6">
                        {decision.reasoning && (
                          <div>
                            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Reasoning</h3>
                            <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">{decision.reasoning}</p>
                          </div>
                        )}
                        {decision.expected_outcomes && decision.expected_outcomes.length > 0 && (
                          <div>
                            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Expected outcomes</h3>
                            <div className="space-y-2.5">
                              {decision.expected_outcomes.map(o => (
                                <div key={o.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)]">
                                  <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Target style={{ width: 13, height: 13 }} className="text-brand-600 dark:text-brand-400" />
                                  </div>
                                  <div>
                                    <p className="text-[13px] font-semibold text-[var(--foreground)]">{o.title}</p>
                                    {(o.metric || o.target_value || o.timeframe) && (
                                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                                        {[o.metric, o.target_value, o.timeframe].filter(Boolean).join(' · ')}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {decision.stakeholders && decision.stakeholders.length > 0 && (
                          <div>
                            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Stakeholders</h3>
                            <div className="flex flex-wrap gap-2">
                              {decision.stakeholders.map(s => (
                                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--muted)] border border-[var(--border)] text-[12px] font-medium text-[var(--foreground)]">
                                  <Users style={{ width: 11, height: 11 }} className="text-[var(--muted-foreground)]" /> {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {!decision.reasoning && !decision.expected_outcomes?.length && !decision.stakeholders?.length && (
                          <div className="py-10 text-center">
                            <FileText className="w-10 h-10 mx-auto mb-3 text-[var(--muted-foreground)] opacity-30" />
                            <p className="text-sm text-[var(--muted-foreground)]">No additional context added.</p>
                            {canEdit && !isArchived && (
                              <Link href={`${ROUTES.decisions}/${decision.id}/edit`}
                                className="inline-flex items-center gap-1 mt-3 text-[12px] font-semibold text-[var(--accent)] hover:underline underline-offset-2">
                                Add context <ChevronRight style={{ width: 12, height: 12 }} />
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right 1/3 */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="space-y-4">

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Details</h3>
              <MetaRow icon={CalendarDays} label="Created" value={formatDate(decision.created_at)} />
              {decision.time_horizon && <MetaRow icon={Clock} label="Time horizon" value={TIME_HORIZON_LABELS[decision.time_horizon] ?? decision.time_horizon} />}
              {decision.reversibility && <MetaRow icon={RotateCcw} label="Reversibility" value={REVERSIBILITY_LABELS[decision.reversibility] ?? decision.reversibility} />}
              {decision.financial_exposure != null && <MetaRow icon={DollarSign} label="Financial exposure" value={formatCurrency(decision.financial_exposure)} />}
              {isResolved && decision.resolved_at && <MetaRow icon={CheckCircle2} label="Resolved" value={formatDate(decision.resolved_at)} className="text-blue-600 dark:text-blue-400" />}
            </div>

            {decision.quality_score != null && (
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Quality</h3>
                <QualityGauge score={Math.round(decision.quality_score)} breakdown={qualityBreakdown} />
              </div>
            )}

            {decision.tags && decision.tags.length > 0 && (
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3 flex items-center gap-1.5">
                  <Hash style={{ width: 12, height: 12 }} /> Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {decision.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-[11px] font-semibold border border-brand-200 dark:border-brand-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!isResolved && !isArchived && canEdit && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <button onClick={() => setShowResolve(true)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] group transition-all">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <CheckCircle2 style={{ width: 16, height: 16 }} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">Resolve this decision</p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">Document the outcome & learnings</p>
                  </div>
                  <ChevronRight style={{ width: 14, height: 14 }} className="text-[var(--muted-foreground)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}