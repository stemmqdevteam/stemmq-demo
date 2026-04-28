'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, TrendingUp, TrendingDown, Minus, X, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { createOutcome } from '@/features/assumptions/actions'
import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/utils'
import type { Outcome, ExpectedOutcome } from '@/types'

interface Props {
  outcomes: Outcome[]
  expectedOutcomes: ExpectedOutcome[]
  decisionId: string
  orgId: string
  canEdit: boolean
}

function DeviationBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null
  const abs = Math.abs(pct)
  const up  = pct >= 0

  return (
    <div className={cn(
      'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
      abs <= 5  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' :
      abs <= 20 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
                  'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
    )}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {up ? '+' : ''}{pct}%
    </div>
  )
}

export function OutcomePanel({ outcomes, expectedOutcomes, decisionId, orgId, canEdit }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createOutcome(decisionId, orgId, fd)
      if (result.success) {
        toast.success('Outcome recorded')
        setShowForm(false)
        ;(e.target as HTMLFormElement).reset()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div>
      {/* Expected outcomes reference */}
      {expectedOutcomes.length > 0 && outcomes.length === 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-surface-500 mb-2">Expected outcomes (to track against)</p>
          <div className="space-y-2">
            {expectedOutcomes.map((o) => (
              <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-dashed border-surface-200 dark:border-surface-700">
                <Minus className="w-4 h-4 text-surface-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-600 dark:text-surface-400 truncate">{o.title}</p>
                  {(o.metric || o.target_value) && (
                    <p className="text-xs text-surface-400 mt-0.5">
                      {o.metric} → {o.target_value}
                      {o.timeframe && ` by ${o.timeframe}`}
                    </p>
                  )}
                </div>
                <span className="text-xs text-surface-400 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-full">Awaiting</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recorded outcomes */}
      {outcomes.length > 0 && (
        <div className="space-y-3 mb-4">
          {outcomes.map((o) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl border border-surface-100 dark:border-surface-800"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-sm font-medium">{o.title}</p>
                <DeviationBadge pct={o.deviation_pct ?? null} />
              </div>
              {o.description && (
                <p className="text-xs text-surface-500 mb-2">{o.description}</p>
              )}
              {(o.expected_value || o.actual_value) && (
                <div className="flex items-center gap-4 text-xs">
                  {o.expected_value && (
                    <span className="text-surface-400">
                      Expected: <strong className="text-surface-600 dark:text-surface-400">{o.expected_value}</strong>
                    </span>
                  )}
                  {o.actual_value && (
                    <span className="text-surface-400">
                      Actual: <strong className={cn(
                        o.deviation_pct !== null && o.deviation_pct !== undefined
                          ? Math.abs(o.deviation_pct) <= 5 ? 'text-emerald-600' :
                            Math.abs(o.deviation_pct) <= 20 ? 'text-amber-600' : 'text-red-600'
                          : 'text-surface-600 dark:text-surface-400'
                      )}>{o.actual_value}</strong>
                    </span>
                  )}
                </div>
              )}
              {o.measured_at && (
                <p className="text-xs text-surface-400 mt-2">Measured {formatDate(o.measured_at)}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {outcomes.length === 0 && expectedOutcomes.length === 0 && (
        <div className="text-center py-8 text-surface-400">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No outcomes recorded yet.</p>
          <p className="text-xs mt-1">Record actual results to measure decision quality.</p>
        </div>
      )}

      {/* Add outcome form */}
      {canEdit && (
        <AnimatePresence>
          {showForm ? (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="border border-brand-200 dark:border-brand-800 rounded-xl p-4 space-y-3 bg-brand-50/30 dark:bg-brand-950/10"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  name="title"
                  required
                  placeholder="Outcome title *"
                  className={cn(
                    'h-10 px-3 text-sm rounded-[10px] border outline-none transition-all sm:col-span-2',
                    'bg-white dark:bg-surface-900',
                    'border-surface-200 dark:border-surface-700',
                    'focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10',
                    'placeholder:text-surface-400'
                  )}
                />
                <input
                  name="expected_value"
                  placeholder="Expected value"
                  className={cn(
                    'h-10 px-3 text-sm rounded-[10px] border outline-none transition-all',
                    'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700',
                    'focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 placeholder:text-surface-400'
                  )}
                />
                <input
                  name="actual_value"
                  placeholder="Actual value"
                  className={cn(
                    'h-10 px-3 text-sm rounded-[10px] border outline-none transition-all',
                    'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700',
                    'focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 placeholder:text-surface-400'
                  )}
                />
                <input
                  name="notes"
                  placeholder="Notes (optional)"
                  className={cn(
                    'h-10 px-3 text-sm rounded-[10px] border outline-none transition-all sm:col-span-2',
                    'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700',
                    'focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 placeholder:text-surface-400'
                  )}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" loading={isPending}>
                  Record outcome
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Record outcome
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
