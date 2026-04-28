'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FlaskConical, GitBranch, AlertTriangle, Shuffle,
  ChevronRight, ChevronLeft, Loader2, Sparkles,
  Target, ToggleLeft, Sliders, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { createSimulation, saveSimulationResult } from '@/features/simulations/actions'
import { buttonClass } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/utils'
import type { SimulationType, SimulationVariable, SimulationResult } from '@/types'

interface DecisionOption {
  id:              string
  title:           string
  intent:          string
  status:          string
  quality_score:   number | null
  description:     string | null
  assumptions:     { content: string; status: string }[]
  expected_outcomes: { title: string; target_value?: string }[]
}

interface Props {
  decisions: DecisionOption[]
  orgId:     string
  orgContext: {
    accuracy_rate:    number | null
    avg_quality_score: number | null
    resolved_count:   number
    failure_patterns: string
  }
  onComplete: () => void
  onCancel:   () => void
}

// ── Type config ───────────────────────────────────────────
const SIM_TYPES: {
  id:          SimulationType
  label:       string
  description: string
  icon:        React.ElementType
  color:       string
  variables:   Omit<SimulationVariable, 'value'>[]
}[] = [
  {
    id:          'assumption_flip',
    label:       'Assumption Flip',
    description: 'What if a key assumption turns out to be wrong? Model the downstream impact.',
    icon:        ToggleLeft,
    color:       'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    variables: [
      { id: 'assumption_content', label: 'Which assumption fails?',       description: 'Paste the assumption that turns out wrong', type: 'text' },
      { id: 'severity',           label: 'How wrong is it?',              description: 'Scale of 1 (slightly off) to 10 (completely wrong)', type: 'scale' },
      { id: 'early_detection',    label: 'Do we detect it early?',        description: 'Would we catch this mistake in time to adjust?', type: 'boolean' },
    ],
  },
  {
    id:          'alternative_decision',
    label:       'Alternative Decision',
    description: 'What if you had chosen a different path? Compare outcomes against your actual decision.',
    icon:        Shuffle,
    color:       'text-brand-600 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800',
    variables: [
      { id: 'alternative',     label: 'What would the alternative have been?', description: 'Describe the other option you could have chosen', type: 'text' },
      { id: 'resource_delta',  label: 'Resource difference',                   description: 'Would this alternative have cost more or less? (scale -5 to +5)', type: 'scale' },
      { id: 'team_alignment',  label: 'Team alignment on alternative',         description: 'Would the team have been aligned on this choice?', type: 'boolean' },
    ],
  },
  {
    id:          'risk_scenario',
    label:       'Risk Scenario',
    description: 'Stress-test your decision against changed market or competitive conditions.',
    icon:        AlertTriangle,
    color:       'text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    variables: [
      { id: 'scenario',          label: 'Describe the risk scenario',     description: 'What external condition changes? (e.g. recession, competitor launch)', type: 'text' },
      { id: 'severity',          label: 'Severity of disruption',         description: 'Scale of 1 (mild) to 10 (catastrophic)', type: 'scale' },
      { id: 'prepared',          label: 'Are you prepared for this?',     description: 'Does your team have a contingency plan?', type: 'boolean' },
    ],
  },
]

// ── Scale input ───────────────────────────────────────────
function ScaleInput({ value, onChange, min = 1, max = 10 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              'flex-1 h-9 rounded-lg text-sm font-medium transition-all border',
              value === n
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-brand-300'
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
        <span>Low</span><span>High</span>
      </div>
    </div>
  )
}

// ── Main wizard ───────────────────────────────────────────
export function NewSimulationWizard({ decisions, orgId, orgContext, onComplete, onCancel }: Props) {
  const [step, setStep]                   = useState(0) // 0=type, 1=decision, 2=variables, 3=running/result
  const [simType, setSimType]             = useState<SimulationType | null>(null)
  const [selectedDecision, setSelected]   = useState<DecisionOption | null>(null)
  const [variables, setVariables]         = useState<SimulationVariable[]>([])
  const [title, setTitle]                 = useState('')
  const [running, setRunning]             = useState(false)
  const [result, setResult]               = useState<SimulationResult | null>(null)
  const [simId, setSimId]                 = useState<string | null>(null)
  const [isPending, startTransition]      = useTransition()

  const selectedType = SIM_TYPES.find((t) => t.id === simType)

  // Step 0 → pick type
  const handleTypeSelect = (type: SimulationType) => {
    const cfg = SIM_TYPES.find((t) => t.id === type)!
    setSimType(type)
    // Initialise variables with defaults
    setVariables(cfg.variables.map((v) => ({
      ...v,
      value: v.type === 'boolean' ? false : v.type === 'scale' ? 5 : '',
    })))
    setStep(1)
  }

  // Step 1 → pick decision
  const handleDecisionSelect = (d: DecisionOption) => {
    setSelected(d)
    setTitle(`${selectedType?.label}: ${d.title}`)
    setStep(2)
  }

  // Step 2 → update variable
  const updateVar = (id: string, value: SimulationVariable['value']) => {
    setVariables((prev) => prev.map((v) => v.id === id ? { ...v, value } : v))
  }

  // Step 2 → run simulation
  const handleRun = async () => {
    if (!simType || !selectedDecision) return

    // Validate text variables
    const emptyText = variables.find((v) => v.type === 'text' && !(v.value as string).trim())
    if (emptyText) {
      toast.error(`Please fill in: ${emptyText.label}`)
      return
    }

    setRunning(true)
    setStep(3)

    try {
      // Create simulation record
      const createResult = await createSimulation({
        decisionId:  selectedDecision.id,
        title,
        description: `${selectedType?.description}`,
        type:        simType,
        variables,
        orgId,
      })

      if (!createResult.success || !createResult.data) {
        toast.error(createResult.error ?? 'Failed to create simulation')
        setRunning(false)
        setStep(2)
        return
      }

      setSimId(createResult.data.id)

      // Run AI simulation
      const res = await fetch('/api/ai/simulate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:       simType,
          decision:   selectedDecision,
          variables,
          orgContext,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Simulation failed')
        setRunning(false)
        setStep(2)
        return
      }

      const simResult: SimulationResult = data.result

      // Save result
      await saveSimulationResult(createResult.data.id, simResult)
      setResult(simResult)
    } catch {
      toast.error('Network error. Please try again.')
      setRunning(false)
      setStep(2)
    } finally {
      setRunning(false)
    }
  }

  const impactColor = result
    ? result.impact_score > 20 ? 'text-emerald-600 dark:text-emerald-400'
      : result.impact_score < -20 ? 'text-red-600 dark:text-red-400'
      : 'text-amber-600 dark:text-amber-400'
    : ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm">New Simulation</h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                {step === 0 ? 'Choose scenario type' : step === 1 ? 'Select decision' : step === 2 ? 'Configure variables' : running ? 'Running analysis…' : 'Results'}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-6 pt-3">
          {[0, 1, 2, 3].map((s) => (
            <div key={s} className={cn('h-1 flex-1 rounded-full transition-colors', s <= step ? 'bg-brand-500' : 'bg-[var(--muted)]')} />
          ))}
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* Step 0 — Type */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                <p className="text-sm text-[var(--muted-foreground)] mb-4">What kind of scenario do you want to explore?</p>
                {SIM_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTypeSelect(t.id)}
                    className={cn(
                      'w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-sm',
                      t.color
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-black/20 flex items-center justify-center flex-shrink-0">
                      <t.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm mb-0.5">{t.label}</p>
                      <p className="text-xs opacity-75 leading-relaxed">{t.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-3 ml-auto opacity-50" />
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 1 — Pick decision */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">Which decision should this simulation be based on?</p>
                {decisions.length === 0 ? (
                  <div className="text-center py-8 text-[var(--muted-foreground)]">
                    <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No decisions yet. Create one first.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {decisions.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => handleDecisionSelect(d)}
                        className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/30 dark:hover:bg-brand-950/10 transition-all"
                      >
                        <div className={cn('w-2 h-8 rounded-full flex-shrink-0', {
                          'bg-emerald-400': d.intent === 'growth',
                          'bg-blue-400':    d.intent === 'efficiency',
                          'bg-red-400':     d.intent === 'risk',
                          'bg-purple-400':  d.intent === 'experiment',
                          'bg-[var(--muted)]': d.intent === 'other',
                        })} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{d.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 capitalize">{d.status} · {d.intent}</p>
                        </div>
                        {d.quality_score != null && (
                          <span className="text-xs font-mono text-[var(--muted-foreground)] flex-shrink-0">DQS {Math.round(d.quality_score)}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2 — Variables */}
            {step === 2 && selectedType && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Simulating</p>
                  <p className="text-sm font-medium truncate">{selectedDecision?.title}</p>
                </div>

                {variables.map((v) => (
                  <div key={v.id}>
                    <label className="text-sm font-medium text-[var(--muted-foreground)] block mb-1">
                      {v.label}
                    </label>
                    <p className="text-xs text-[var(--muted-foreground)] mb-2">{v.description}</p>

                    {v.type === 'text' && (
                      <textarea
                        value={v.value as string}
                        onChange={(e) => updateVar(v.id, e.target.value)}
                        placeholder="Describe in detail…"
                        rows={3}
                        className={cn(
                          'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none',
                          'bg-[var(--card)]',
                          'border-[var(--border)]',
                          'focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10',
                          'placeholder:text-[var(--muted-foreground)]'
                        )}
                      />
                    )}

                    {v.type === 'scale' && (
                      <ScaleInput
                        value={v.value as number}
                        onChange={(val) => updateVar(v.id, val)}
                        min={1}
                        max={10}
                      />
                    )}

                    {v.type === 'boolean' && (
                      <div className="flex gap-2">
                        {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map((opt) => (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => updateVar(v.id, opt.value)}
                            className={cn(
                              'flex-1 h-10 rounded-xl border-2 text-sm font-medium transition-all',
                              v.value === opt.value
                                ? 'bg-brand-500 text-white border-brand-500'
                                : 'bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-brand-300'
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 3 — Running / Result */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {running ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mx-auto mb-5">
                      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                    </div>
                    <p className="font-display font-semibold text-base mb-1">Running simulation…</p>
                    <p className="text-sm text-[var(--muted-foreground)]">AI is analysing your decision context and historical data.</p>
                    <div className="flex justify-center gap-1 mt-6">
                      {['Fetching context', 'Modelling scenarios', 'Calculating outcomes'].map((label, i) => (
                        <motion.div
                          key={label}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.7 }}
                          className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2.5 py-1 rounded-full"
                        >
                          {label}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-5">
                    {/* Impact summary */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[var(--muted)]/50 rounded-xl p-4 text-center">
                        <p className="text-xs text-[var(--muted-foreground)] mb-1">Impact score</p>
                        <p className={cn('font-display font-bold text-3xl', impactColor)}>
                          {result.impact_score > 0 ? '+' : ''}{result.impact_score}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">out of ±100</p>
                      </div>
                      <div className="bg-[var(--muted)]/50 rounded-xl p-4 text-center">
                        <p className="text-xs text-[var(--muted-foreground)] mb-1">Confidence</p>
                        <p className="font-display font-bold text-3xl text-brand-600 dark:text-brand-400">
                          {result.confidence}%
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">in this analysis</p>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                        <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">Recommendation</p>
                      </div>
                      <p className="text-sm text-brand-800 dark:text-brand-200 leading-relaxed">{result.recommendation}</p>
                    </div>

                    {/* Key findings */}
                    {result.key_findings.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Key findings</p>
                        <div className="space-y-1.5">
                          {result.key_findings.map((f, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                              <span className="w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-950/40 text-brand-600 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risks */}
                    {result.risk_factors.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Risk factors</p>
                        <div className="space-y-1.5">
                          {result.risk_factors.map((r, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Opportunities */}
                    {result.opportunities.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Opportunities</p>
                        <div className="space-y-1.5">
                          {result.opportunities.map((o, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                              <Target className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              {o}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
          <button
            onClick={() => step > 0 && !running && !result ? setStep(step - 1) : onCancel()}
            disabled={running}
            className={cn(buttonClass({ variant: 'ghost', size: 'sm' }), 'gap-2')}
          >
            {result ? 'Close' : step === 0 ? 'Cancel' : <><ChevronLeft className="w-3.5 h-3.5" /> Back</>}
          </button>

          {step === 2 && (
            <button
              onClick={handleRun}
              disabled={running}
              className={cn(buttonClass({ variant: 'primary', size: 'sm' }), 'gap-2')}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Run simulation
            </button>
          )}

          {result && (
            <button
              onClick={() => { setStep(0); setSimType(null); setSelected(null); setResult(null); onComplete() }}
              className={cn(buttonClass({ variant: 'primary', size: 'sm' }), 'gap-2')}
            >
              Run another
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
