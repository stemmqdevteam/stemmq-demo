'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FlaskConical, Plus, Trash2, ChevronDown, ChevronUp,
  ToggleLeft, Shuffle, AlertTriangle, Sparkles, Target,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react'
import { toast } from 'sonner'
import { deleteSimulation } from '@/features/simulations/actions'
import { NewSimulationWizard } from './new-simulation-wizard'
import { buttonClass } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn, formatRelativeTime } from '@/utils'
import type { Simulation, SimulationType } from '@/types'

interface DecisionOption {
  id: string; title: string; intent: string; status: string
  quality_score: number | null; description: string | null
  assumptions: { content: string; status: string }[]
  expected_outcomes: { title: string; target_value?: string }[]
}

interface Props {
  simulations: Simulation[]
  decisions:   DecisionOption[]
  orgId:       string
  orgContext: {
    accuracy_rate:     number | null
    avg_quality_score: number | null
    resolved_count:    number
    failure_patterns:  string
  }
  canSimulate: boolean
}

const TYPE_CONFIG: Record<SimulationType, { icon: React.ElementType; label: string; color: string }> = {
  assumption_flip:      { icon: ToggleLeft,   label: 'Assumption Flip',      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' },
  alternative_decision: { icon: Shuffle,      label: 'Alternative Decision', color: 'bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400' },
  risk_scenario:        { icon: AlertTriangle, label: 'Risk Scenario',       color: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400' },
}

function ImpactIndicator({ score }: { score: number }) {
  const isPositive = score > 0
  const isNegative = score < 0
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  return (
    <div className={cn(
      'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
      isPositive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
      isNegative ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                   'bg-surface-100 text-surface-500 dark:bg-surface-800'
    )}>
      <Icon className="w-3 h-3" />
      {isPositive ? '+' : ''}{score}
    </div>
  )
}

function SimulationCard({ simulation }: { simulation: Simulation }) {
  const [expanded, setExpanded]      = useState(false)
  const [isPending, startTransition] = useTransition()

  const cfg    = TYPE_CONFIG[simulation.type]
  const Icon   = cfg.icon
  const result = simulation.result

  const handleDelete = () => {
    if (!confirm('Delete this simulation?')) return
    startTransition(async () => {
      const res = await deleteSimulation(simulation.id)
      if (!res.success) toast.error(res.error)
      else toast.success('Simulation deleted')
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 overflow-hidden"
    >
      {/* Header row */}
      <div
        className="flex items-start gap-4 p-5 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
        onClick={() => result && setExpanded((v) => !v)}
      >
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', cfg.color)}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate mb-1">
            {simulation.title}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" size="xs">{cfg.label}</Badge>
            {simulation.decisions?.title && (
              <span className="text-xs text-surface-400 truncate max-w-[200px]">
                on "{simulation.decisions.title}"
              </span>
            )}
            <span className="text-xs text-surface-400">{formatRelativeTime(simulation.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {result && <ImpactIndicator score={result.impact_score} />}
          {result && (
            <span className="text-xs text-surface-400">{result.confidence}% confidence</span>
          )}
          {!result && simulation.status === 'pending' && (
            <Badge variant="default" size="xs">Pending</Badge>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete() }}
            disabled={isPending}
            className="p-1.5 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {result && (
            <button type="button" className="text-surface-400">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded result */}
      <AnimatePresence>
        {expanded && result && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-surface-50 dark:border-surface-800 pt-4">

              {/* Recommendation */}
              <div className="p-3.5 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">Recommendation</p>
                </div>
                <p className="text-sm text-brand-800 dark:text-brand-200 leading-relaxed">{result.recommendation}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Findings */}
                {result.key_findings.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Key findings</p>
                    <div className="space-y-1.5">
                      {result.key_findings.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400">
                          <span className="w-3.5 h-3.5 rounded-full bg-brand-100 dark:bg-brand-950/40 text-brand-600 text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risks */}
                {result.risk_factors.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Risk factors</p>
                    <div className="space-y-1.5">
                      {result.risk_factors.map((r, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />{r}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Opportunities */}
              {result.opportunities.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Opportunities</p>
                  <div className="flex flex-wrap gap-2">
                    {result.opportunities.map((o, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full">
                        <Target className="w-3 h-3" />{o}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function SimulationsList({ simulations, decisions, orgId, orgContext, canSimulate }: Props) {
  const [showWizard, setShowWizard] = useState(false)

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-0.5">Simulations</h1>
          <p className="text-sm text-surface-500">
            Model scenarios, stress-test decisions, and explore alternatives.
          </p>
        </div>
        {canSimulate && (
          <button
            onClick={() => setShowWizard(true)}
            className={cn(buttonClass({ variant: 'primary' }), 'gap-2')}
          >
            <Plus className="w-4 h-4" /> New simulation
          </button>
        )}
      </div>

      {/* Pro gate */}
      {!canSimulate && (
        <Card className="text-center py-12 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center mx-auto mb-4">
            <FlaskConical className="w-7 h-7 text-purple-500" />
          </div>
          <h3 className="font-display font-bold text-base mb-2">Simulations require Pro</h3>
          <p className="text-sm text-surface-500 max-w-sm mx-auto mb-5">
            Model what-if scenarios, stress-test decisions, and explore alternatives using AI-powered analysis grounded in your historical data.
          </p>
          <a href="/dashboard/settings/billing" className={cn(buttonClass({ variant: 'primary', size: 'sm' }), 'gap-2')}>
            Upgrade to Pro <FlaskConical className="w-3.5 h-3.5" />
          </a>
        </Card>
      )}

      {/* How it works — shown when empty */}
      {canSimulate && simulations.length === 0 && (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: ToggleLeft, title: 'Assumption Flip', description: 'What if a key assumption turned out to be wrong? Model the cascade effect on your decision.', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
            { icon: Shuffle,    title: 'Alternative Decision', description: "Compare your actual choice against an alternative path. What would have changed?", color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/30' },
            { icon: AlertTriangle, title: 'Risk Scenario', description: 'Stress-test decisions against market changes, competitor moves, or macro disruptions.', color: 'text-red-500 bg-red-50 dark:bg-red-950/30' },
          ].map((s) => (
            <Card key={s.title}>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', s.color)}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="font-display font-semibold text-sm mb-1.5">{s.title}</p>
              <p className="text-xs text-surface-500 leading-relaxed">{s.description}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Simulations list */}
      {simulations.length === 0 && canSimulate ? (
        <Card className="text-center py-12">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mx-auto mb-4">
            <FlaskConical className="w-7 h-7 text-brand-500" />
          </div>
          <h3 className="font-display font-semibold text-base mb-1">No simulations yet</h3>
          <p className="text-sm text-surface-400 mb-5">
            Run your first what-if analysis on any of your decisions.
          </p>
          <button onClick={() => setShowWizard(true)} className={cn(buttonClass({ variant: 'primary', size: 'sm' }), 'gap-2')}>
            <Plus className="w-4 h-4" /> Run first simulation
          </button>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {simulations.map((sim) => (
              <SimulationCard key={sim.id} simulation={sim} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Wizard modal */}
      <AnimatePresence>
        {showWizard && (
          <NewSimulationWizard
            decisions={decisions}
            orgId={orgId}
            orgContext={orgContext}
            onComplete={() => setShowWizard(false)}
            onCancel={() => setShowWizard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
