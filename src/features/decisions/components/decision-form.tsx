'use client'

import { useActionState, useState, useTransition, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch, Brain, Target, DollarSign, Clock,
  RotateCcw, Users, Tag, Lightbulb, AlertCircle,
  X, Plus, Check, ArrowLeft, ArrowRight, ChevronRight,
  FileText, Layers, Eye, Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { createDecision, updateDecision } from '@/features/decisions/actions'
import { AISuggestButton } from '@/features/decisions/components/ai-suggest-button'
import { cn } from '@/utils'
import type { Decision, ActionResult } from '@/types'

interface ExpectedOutcome {
  id: string; title: string; metric: string; target_value: string; timeframe: string
}
interface Props {
  mode: 'create' | 'edit'
  decision?: Decision
  orgId: string
  onCancel?: () => void
}

type StepId = 'core' | 'assumptions' | 'outcomes' | 'details' | 'people' | 'review'

const STEPS: { id: StepId; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'core', label: 'Decision', icon: GitBranch, description: 'Title, intent & context' },
  { id: 'assumptions', label: 'Assumptions', icon: Brain, description: 'Beliefs this relies on' },
  { id: 'outcomes', label: 'Outcomes', icon: Target, description: 'Expected results & metrics' },
  { id: 'details', label: 'Details', icon: Clock, description: 'Horizon, risk & financials' },
  { id: 'people', label: 'People', icon: Users, description: 'Stakeholders & tags' },
  { id: 'review', label: 'Review', icon: Eye, description: 'Confirm & submit' },
]

const INTENT_OPTIONS = [
  { value: 'growth', label: 'Growth', desc: 'Expand, acquire, scale', icon: '📈' },
  { value: 'efficiency', label: 'Efficiency', desc: 'Reduce cost, improve ops', icon: '⚡' },
  { value: 'risk', label: 'Risk', desc: 'Mitigate, protect, prevent', icon: '🛡️' },
  { value: 'experiment', label: 'Experiment', desc: 'Test hypothesis, learn', icon: '🧪' },
  { value: 'other', label: 'Other', desc: 'Something else entirely', icon: '⚙️' },
]

const HORIZON_OPTIONS = [
  { value: 'days', label: 'Days', desc: 'Less than 1 week' },
  { value: 'weeks', label: 'Weeks', desc: '1–4 weeks' },
  { value: 'months', label: 'Months', desc: '1–6 months' },
  { value: 'quarters', label: 'Quarters', desc: '3–12 months' },
  { value: 'years', label: 'Years', desc: '1+ years' },
]

const REVERSIBILITY_OPTIONS = [
  { value: 'easily_reversible', label: 'Easily reversible', desc: 'Undo at any time', color: 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20' },
  { value: 'reversible', label: 'Reversible', desc: 'Possible but costly', color: 'border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/20' },
  { value: 'difficult', label: 'Difficult', desc: 'Significant cost to undo', color: 'border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-950/20' },
  { value: 'irreversible', label: 'Irreversible', desc: 'Cannot be undone', color: 'border-red-400 dark:border-red-600 bg-red-50/50 dark:bg-red-950/20' },
]

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.18 } }),
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100
  return (
    <div className="w-full h-[3px] bg-[var(--muted)] rounded-full overflow-hidden">
      <motion.div className="h-full rounded-full" style={{ background: 'var(--accent)' }}
        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }} />
    </div>
  )
}

function Label({ children, required, hint }: { children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-[13px] font-semibold text-[var(--foreground)]">
        {children}{required && <span className="text-[var(--accent)] ml-0.5">*</span>}
      </label>
      {hint && <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{hint}</p>}
    </div>
  )
}

const inputCls = cn(
  'w-full px-3.5 py-2.5 text-sm rounded-xl border-2 outline-none transition-all',
  'bg-[var(--card)] text-[var(--foreground)]',
  'border-[var(--border)] placeholder:text-[var(--muted-foreground)]',
  'hover:border-[var(--muted-foreground)]/40',
  'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15',
)

function OptionCard({ selected, onClick, children, colorClass }: {
  selected: boolean; onClick: () => void; children: React.ReactNode; colorClass?: string
}) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 p-3.5 rounded-xl border-2 text-left w-full transition-all duration-150',
        selected
          ? cn('border-[var(--accent)] bg-[var(--accent-muted)]', colorClass)
          : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/40 hover:bg-[var(--muted)]',
      )}>
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-white" />
        </span>
      )}
      {children}
    </button>
  )
}

function StepCore({ title, setTitle, intent, setIntent, description, setDescription, category, setCategory, error }: {
  title: string; setTitle: (v: string) => void; intent: string; setIntent: (v: string) => void
  description: string; setDescription: (v: string) => void; category: string; setCategory: (v: string) => void; error?: string
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>Decision title</Label>
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Launch paid tier for enterprise customers" autoFocus
          className={cn(inputCls, error && 'border-red-500 focus:border-red-500')} />
        {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
        <p className="text-[11px] text-[var(--muted-foreground)] mt-1.5">Be specific. A good title is a complete sentence.</p>
      </div>
      <div>
        <Label required>Intent</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INTENT_OPTIONS.map(opt => (
            <OptionCard key={opt.value} selected={intent === opt.value} onClick={() => setIntent(opt.value)}>
              <span className="text-lg flex-shrink-0">{opt.icon}</span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[var(--foreground)] truncate">{opt.label}</p>
                <p className="text-[11px] text-[var(--muted-foreground)] truncate">{opt.desc}</p>
              </div>
            </OptionCard>
          ))}
        </div>
      </div>
      <div>
        <Label hint="What's the situation? Why now?">Context & background</Label>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="What's the situation? Why is this decision being made now?"
          rows={4} className={cn(inputCls, 'resize-none')} />
      </div>
      <div>
        <Label hint="e.g. Product, Marketing, Engineering">Category</Label>
        <input value={category} onChange={e => setCategory(e.target.value)}
          placeholder="e.g. Product" className={inputCls} />
      </div>
    </div>
  )
}

function StepAssumptions({ assumptions, setAssumptions, title, description, intent, reasoning }: {
  assumptions: string[]; setAssumptions: (v: string[]) => void
  title: string; description: string; intent: string; reasoning: string
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
        Every assumption this decision depends on. These are tracked over time — mark each correct, incorrect, or partially correct as reality unfolds.
      </p>
      <div className="space-y-2.5">
        <AnimatePresence>
          {assumptions.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
              className="flex gap-2 items-center">
              <span className="text-[11px] font-mono text-[var(--muted-foreground)] w-5 flex-shrink-0 text-right">{i + 1}</span>
              <input value={a} onChange={e => setAssumptions(assumptions.map((x, idx) => idx === i ? e.target.value : x))}
                placeholder={`e.g. "Users will prefer the new checkout flow"`}
                className={cn(inputCls, 'flex-1')} />
              <button type="button" onClick={() => setAssumptions(assumptions.filter((_, idx) => idx !== i))}
                disabled={assumptions.length <= 1}
                className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-30 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-3 flex-wrap pt-1">
        <button type="button" onClick={() => setAssumptions([...assumptions, ''])}
          className="flex items-center gap-2 text-[13px] font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity">
          <Plus className="w-3.5 h-3.5" /> Add assumption
        </button>
        <AISuggestButton title={title} description={description} intent={intent} reasoning={reasoning}
          existingAssumptions={assumptions}
          onAdd={s => setAssumptions([...assumptions.filter(a => a.trim()), s])} />
      </div>
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-700 dark:text-amber-300 leading-relaxed">
            Decisions with tracked assumptions have 40% better outcomes. Add at least one to unlock the Quality Index.
          </p>
        </div>
      </div>
    </div>
  )
}

function StepOutcomes({ outcomes, setOutcomes }: {
  outcomes: ExpectedOutcome[]; setOutcomes: (v: ExpectedOutcome[]) => void
}) {
  const add = () => setOutcomes([...outcomes, { id: Math.random().toString(36).slice(2), title: '', metric: '', target_value: '', timeframe: '' }])
  const update = (i: number, key: keyof ExpectedOutcome, val: string) =>
    setOutcomes(outcomes.map((o, idx) => idx === i ? { ...o, [key]: val } : o))
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
        What results do you expect? Link metrics to targets and timeframes for measurable accountability.
      </p>
      {outcomes.length === 0 && (
        <div className="py-8 text-center border-2 border-dashed border-[var(--border)] rounded-xl">
          <Target className="w-8 h-8 mx-auto mb-2 text-[var(--muted-foreground)] opacity-40" />
          <p className="text-sm text-[var(--muted-foreground)]">No outcomes yet</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Optional but strongly encouraged</p>
        </div>
      )}
      <div className="space-y-3">
        {outcomes.map((o, i) => (
          <motion.div key={o.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="relative p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 space-y-3">
            <button type="button" onClick={() => setOutcomes(outcomes.filter((_, idx) => idx !== i))}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
            <div>
              <Label>Outcome {i + 1}</Label>
              <input value={o.title} onChange={e => update(i, 'title', e.target.value)}
                placeholder="e.g. Increase MRR by 20%" className={inputCls} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Metric</Label><input value={o.metric} onChange={e => update(i, 'metric', e.target.value)} placeholder="e.g. MRR" className={inputCls} /></div>
              <div><Label>Target</Label><input value={o.target_value} onChange={e => update(i, 'target_value', e.target.value)} placeholder="+$50k" className={inputCls} /></div>
              <div><Label>Timeframe</Label><input value={o.timeframe} onChange={e => update(i, 'timeframe', e.target.value)} placeholder="Q2 2025" className={inputCls} /></div>
            </div>
          </motion.div>
        ))}
      </div>
      <button type="button" onClick={add}
        className="flex items-center gap-2 text-[13px] font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity">
        <Plus className="w-3.5 h-3.5" /> Add expected outcome
      </button>
    </div>
  )
}

function StepDetails({ reasoning, setReasoning, horizon, setHorizon, reversibility, setReversibility, financial, setFinancial }: {
  reasoning: string; setReasoning: (v: string) => void; horizon: string; setHorizon: (v: string) => void
  reversibility: string; setReversibility: (v: string) => void; financial: string; setFinancial: (v: string) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label hint="Why this approach over alternatives?">Reasoning</Label>
        <textarea value={reasoning} onChange={e => setReasoning(e.target.value)}
          placeholder="Document your thinking process. What alternatives were considered?" rows={3}
          className={cn(inputCls, 'resize-none')} />
      </div>
      <div>
        <Label>Time horizon</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HORIZON_OPTIONS.map(opt => (
            <OptionCard key={opt.value} selected={horizon === opt.value} onClick={() => setHorizon(opt.value)}>
              <div><p className="text-[13px] font-semibold text-[var(--foreground)]">{opt.label}</p><p className="text-[11px] text-[var(--muted-foreground)]">{opt.desc}</p></div>
            </OptionCard>
          ))}
        </div>
      </div>
      <div>
        <Label>Reversibility</Label>
        <div className="grid grid-cols-2 gap-2">
          {REVERSIBILITY_OPTIONS.map(opt => (
            <OptionCard key={opt.value} selected={reversibility === opt.value} onClick={() => setReversibility(opt.value)}
              colorClass={reversibility === opt.value ? opt.color : ''}>
              <div><p className="text-[13px] font-semibold text-[var(--foreground)]">{opt.label}</p><p className="text-[11px] text-[var(--muted-foreground)]">{opt.desc}</p></div>
            </OptionCard>
          ))}
        </div>
      </div>
      <div>
        <Label hint="Estimated cost or revenue impact">Financial exposure ($)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input type="number" value={financial} onChange={e => setFinancial(e.target.value)}
            placeholder="0" className={cn(inputCls, 'pl-9')} />
        </div>
      </div>
    </div>
  )
}

function StepPeople({ stakeholders, setStakeholders, tags, setTags }: {
  stakeholders: string[]; setStakeholders: (v: string[]) => void; tags: string[]; setTags: (v: string[]) => void
}) {
  const [stInput, setStInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const addSt = () => { if (stInput.trim()) { setStakeholders([...stakeholders, stInput.trim()]); setStInput('') } }
  const addTag = () => { if (tagInput.trim() && tags.length < 10) { setTags([...tags, tagInput.trim().toLowerCase()]); setTagInput('') } }
  return (
    <div className="space-y-6">
      <div>
        <Label hint="Who is affected by or involved in this decision?">Stakeholders</Label>
        <div className="flex gap-2">
          <input value={stInput} onChange={e => setStInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSt() } }}
            placeholder="Add a stakeholder name or role" className={cn(inputCls, 'flex-1')} />
          <button type="button" onClick={addSt}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
            Add
          </button>
        </div>
        {stakeholders.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {stakeholders.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--muted)] text-[13px] font-medium text-[var(--foreground)] border border-[var(--border)]">
                <Users className="w-3 h-3 text-[var(--muted-foreground)]" />{s}
                <button type="button" onClick={() => setStakeholders(stakeholders.filter((_, idx) => idx !== i))}
                  className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors ml-0.5"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div>
        <Label hint="Label this decision for easy filtering. Max 10 tags.">Tags</Label>
        <div className="flex gap-2">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            placeholder="Add a tag" className={cn(inputCls, 'flex-1')} disabled={tags.length >= 10} />
          <button type="button" onClick={addTag} disabled={tags.length >= 10}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors disabled:opacity-40">
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-[12px] font-semibold border border-brand-200 dark:border-brand-800">
                #{t}<button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                  className="text-brand-400 hover:text-red-500 transition-colors ml-0.5"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StepReview({ title, intent, description, category, assumptions, outcomes, reasoning, horizon, reversibility, financial, stakeholders, tags }: {
  title: string; intent: string; description: string; category: string; assumptions: string[]; outcomes: ExpectedOutcome[]
  reasoning: string; horizon: string; reversibility: string; financial: string; stakeholders: string[]; tags: string[]
}) {
  const Row = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <div className="flex gap-4 py-2.5 border-b border-[var(--border)] last:border-0">
        <span className="text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide w-28 flex-shrink-0 pt-0.5">{label}</span>
        <span className="text-[13px] text-[var(--foreground)] flex-1 leading-relaxed">{value}</span>
      </div>
    ) : null

  const filledAssumptions = assumptions.filter(a => a.trim())
  const filledOutcomes = outcomes.filter(o => o.title.trim())
  const completeness = [!!title.trim(), !!intent, !!description.trim(), filledAssumptions.length > 0,
  filledOutcomes.length > 0, !!reasoning.trim(), !!horizon, !!reversibility, !!financial, stakeholders.length > 0
  ].filter(Boolean).length
  const pct = Math.round((completeness / 10) * 100)
  const scoreColor = pct >= 80 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--muted-foreground)]'

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-violet-50 dark:from-brand-950/30 dark:to-violet-950/20 border border-brand-100 dark:border-brand-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Completeness preview</span>
          <span className={cn('text-lg font-display font-bold', scoreColor)}>{pct}%</span>
        </div>
        <div className="h-2 bg-white/60 dark:bg-black/20 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full rounded-full', pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-brand-500')} />
        </div>
        <p className="text-[11px] text-[var(--muted-foreground)] mt-2">
          {pct >= 80 ? '✦ Excellent — this decision is well documented' : pct >= 60 ? '▲ Good — consider adding more context' : 'Add more details to improve the quality score'}
        </p>
      </div>
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 py-3 bg-[var(--muted)]/50 border-b border-[var(--border)]">
          <p className="text-[12px] font-bold text-[var(--foreground)] uppercase tracking-wide">Summary</p>
        </div>
        <div className="px-4">
          <Row label="Title" value={title || '—'} />
          <Row label="Intent" value={INTENT_OPTIONS.find(o => o.value === intent)?.label || '—'} />
          <Row label="Description" value={description || '—'} />
          <Row label="Category" value={category || '—'} />
          <Row label="Assumptions" value={filledAssumptions.length > 0 ? `${filledAssumptions.length} assumption${filledAssumptions.length !== 1 ? 's' : ''}` : '—'} />
          <Row label="Outcomes" value={filledOutcomes.length > 0 ? `${filledOutcomes.length} outcome${filledOutcomes.length !== 1 ? 's' : ''}` : '—'} />
          <Row label="Horizon" value={HORIZON_OPTIONS.find(o => o.value === horizon)?.label || '—'} />
          <Row label="Reversible" value={REVERSIBILITY_OPTIONS.find(o => o.value === reversibility)?.label || '—'} />
          <Row label="Exposure" value={financial ? `$${parseInt(financial).toLocaleString()}` : '—'} />
          <Row label="Stakeholders" value={stakeholders.length > 0 ? stakeholders.join(', ') : '—'} />
          <Row label="Tags" value={tags.length > 0 ? tags.map(t => `#${t}`).join(' ') : '—'} />
        </div>
      </div>
    </div>
  )
}

export function DecisionForm({ mode, decision, orgId, onCancel }: Props) {
  const [stepIdx, setStepIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const [formError, setFormError] = useState<string | null>(null)
  const [title, setTitle] = useState(decision?.title ?? '')
  const [intent, setIntent] = useState(decision?.intent ?? '')
  const [description, setDescription] = useState(decision?.description ?? '')
  const [category, setCategory] = useState(decision?.category ?? '')
  const [assumptions, setAssumptions] = useState<string[]>(decision?.assumptions?.map(a => a.content) ?? [''])
  const [outcomes, setOutcomes] = useState<ExpectedOutcome[]>(
    (decision?.expected_outcomes ?? []).map(o => ({ id: o.id, title: o.title, metric: o.metric ?? '', target_value: o.target_value ?? '', timeframe: o.timeframe ?? '' }))
  )
  const [reasoning, setReasoning] = useState(decision?.reasoning ?? '')
  const [horizon, setHorizon] = useState(decision?.time_horizon ?? '')
  const [reversibility, setReversibility] = useState(decision?.reversibility ?? '')
  const [financial, setFinancial] = useState(decision?.financial_exposure?.toString() ?? '')
  const [stakeholders, setStakeholders] = useState<string[]>(decision?.stakeholders ?? [])
  const [tags, setTags] = useState<string[]>(decision?.tags ?? [])
  const [isPending, startTransition] = useTransition()

  const currentStep = STEPS[stepIdx]
  const isFirst = stepIdx === 0
  const isLast = stepIdx === STEPS.length - 1

  const validate = (): boolean => {
    if (currentStep.id === 'core') {
      if (!title.trim()) { setFormError('Please enter a decision title.'); return false }
      if (!intent) { setFormError('Please select an intent.'); return false }
    }
    if (currentStep.id === 'assumptions') {
      if (assumptions.filter(a => a.trim()).length === 0) { setFormError('Please add at least one assumption.'); return false }
    }
    return true
  }

  const goTo = (idx: number, direction: number) => { setDir(direction); setStepIdx(idx); setFormError(null) }

  const handleNext = () => {
    if (!validate()) return
    if (isLast) return handleSubmit()
    goTo(stepIdx + 1, 1)
  }
  const handleBack = () => {
    if (isFirst) { onCancel?.(); return }
    goTo(stepIdx - 1, -1)
  }
  const handleSubmit = () => {
    setFormError(null)
    startTransition(async () => {
      const fd = new FormData()
      fd.append('title', title.trim()); fd.append('intent', intent); fd.append('description', description)
      fd.append('category', category); fd.append('reasoning', reasoning); fd.append('time_horizon', horizon)
      fd.append('reversibility', reversibility); fd.append('financial_exposure', financial)
      fd.append('assumptions', JSON.stringify(assumptions.filter(a => a.trim())))
      fd.append('expected_outcomes', JSON.stringify(outcomes.filter(o => o.title.trim())))
      fd.append('stakeholders', JSON.stringify(stakeholders)); fd.append('tags', tags.join(','))
      // Server actions written for useActionState take (prevState, formData).
      // We pass the initial state as the first argument when calling directly.
      const INIT: ActionResult = { success: false, error: undefined, fieldErrors: {} }
      let result: ActionResult
      if (mode === 'create') {
        result = await (createDecision as (s: ActionResult, fd: FormData) => Promise<ActionResult>)(INIT, fd)
      } else {
        const boundAction = updateDecision.bind(null, decision!.id) as (s: ActionResult, fd: FormData) => Promise<ActionResult>
        result = await boundAction(INIT, fd)
      }
      if (result?.success === false) setFormError(result.error ?? 'Something went wrong.')
    })
  }

  const stepContent: Record<StepId, React.ReactNode> = {
    core: <StepCore title={title} setTitle={setTitle} intent={intent} setIntent={setIntent}
      description={description} setDescription={setDescription} category={category} setCategory={setCategory}
      error={formError && (!title.trim() || !intent) ? formError : undefined} />,
    assumptions: <StepAssumptions assumptions={assumptions} setAssumptions={setAssumptions}
      title={title} description={description} intent={intent} reasoning={reasoning} />,
    outcomes: <StepOutcomes outcomes={outcomes} setOutcomes={setOutcomes} />,
    details: <StepDetails reasoning={reasoning} setReasoning={setReasoning} horizon={horizon} setHorizon={setHorizon}
      reversibility={reversibility} setReversibility={setReversibility} financial={financial} setFinancial={setFinancial} />,
    people: <StepPeople stakeholders={stakeholders} setStakeholders={setStakeholders} tags={tags} setTags={setTags} />,
    review: <StepReview title={title} intent={intent} description={description} category={category}
      assumptions={assumptions} outcomes={outcomes} reasoning={reasoning} horizon={horizon}
      reversibility={reversibility} financial={financial} stakeholders={stakeholders} tags={tags} />,
  }

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Header */}
      <div className="flex-shrink-0 px-5 sm:px-6 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-[14px] text-[var(--foreground)]">
              {mode === 'create' ? 'New Decision' : 'Edit Decision'}
            </span>
          </div>
          <span className="text-[12px] font-medium text-[var(--muted-foreground)]">
            Step {stepIdx + 1} of {STEPS.length}
          </span>
        </div>
        <ProgressBar current={stepIdx} total={STEPS.length} />
        <div className="flex items-center justify-between mt-3 mb-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done = i < stepIdx; const current = i === stepIdx
            return (
              <button key={s.id} type="button" onClick={() => { if (i < stepIdx) goTo(i, -1) }}
                disabled={i > stepIdx} className={cn('flex flex-col items-center gap-1 transition-all', i < stepIdx ? 'cursor-pointer' : 'cursor-default')}>
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center transition-all',
                  done ? 'bg-[var(--accent)] text-white' :
                    current ? 'bg-[var(--accent-muted)] border-2 border-[var(--accent)] text-[var(--accent)]' :
                      'bg-[var(--muted)] text-[var(--muted-foreground)]')}>
                  {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className={cn('text-[9px] uppercase tracking-wider font-bold hidden sm:block',
                  current ? 'text-[var(--accent)]' : done ? 'text-[var(--foreground)] opacity-60' : 'text-[var(--muted-foreground)]')}>
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={currentStep.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pb-4 border-b border-[var(--border)]">
            <h2 className="font-display text-lg font-bold text-[var(--foreground)] leading-tight">{currentStep.label}</h2>
            <p className="text-[12px] text-[var(--muted-foreground)] mt-0.5">{currentStep.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scrollable step body */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 min-h-0">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={currentStep.id} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
            {stepContent[currentStep.id]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-5 sm:px-6 py-4 border-t border-[var(--border)] bg-[var(--card)]">
        {formError && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 mb-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-[12px] text-red-700 dark:text-red-300">{formError}</p>
          </motion.div>
        )}
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={handleBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all">
            <ArrowLeft className="w-4 h-4" />
            {isFirst ? 'Cancel' : 'Back'}
          </button>
          <p className="text-[11px] text-[var(--muted-foreground)] text-center flex-1 hidden sm:block">More context = higher quality score</p>
          <button type="button" onClick={handleNext} disabled={isPending}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all',
              isLast ? 'bg-[var(--accent)] text-white hover:opacity-90' : 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90',
              isPending && 'opacity-60 cursor-not-allowed',
            )}
            style={isLast ? { boxShadow: '0 4px 20px rgba(91,91,214,0.3)' } : undefined}>
            {isPending ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
            ) : isLast ? (
              <><Check className="w-4 h-4" />{mode === 'create' ? 'Create decision' : 'Save changes'}</>
            ) : (
              <>Continue<ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}