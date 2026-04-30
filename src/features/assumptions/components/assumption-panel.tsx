'use client'

import { useActionState, useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, CheckCircle2, XCircle, MinusCircle,
  ChevronDown, Trash2, RotateCcw, Brain,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  createAssumption,
  resolveAssumption,
  unresolveAssumption,
  deleteAssumption,
} from '@/features/assumptions/actions'
import { Button } from '@/components/ui/button'
import { cn, formatRelativeTime, assumptionStatusClass } from '@/utils'
import { ASSUMPTION_STATUS_LABELS } from '@/constants'
import type { Assumption, ActionResult } from '@/types'

/* ── Status config ───────────────────────────────────────── */
const STATUS_ICONS = {
  unknown:           { icon: MinusCircle, color: 'text-surface-400' },
  correct:           { icon: CheckCircle2, color: 'text-emerald-500' },
  incorrect:         { icon: XCircle, color: 'text-red-500' },
  partially_correct: { icon: MinusCircle, color: 'text-amber-500' },
}

/* ── Single assumption item ──────────────────────────────── */
function AssumptionItem({
  assumption,
  decisionId,
  canEdit,
}: {
  assumption: Assumption
  decisionId: string
  canEdit: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [isPending, startTransition] = useTransition()

  const statusCfg = STATUS_ICONS[assumption.status] ?? STATUS_ICONS.unknown
  const Icon      = statusCfg.icon

  const handleUnresolve = () => {
    startTransition(async () => {
      const result = await unresolveAssumption(assumption.id, decisionId)
      if (!result.success) toast.error(result.error)
    })
  }

  const handleDelete = () => {
    if (!confirm('Delete this assumption?')) return
    startTransition(async () => {
      const result = await deleteAssumption(assumption.id, decisionId)
      if (!result.success) toast.error(result.error)
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-surface-100 dark:border-surface-800 rounded-xl overflow-hidden"
    >
      {/* Main row */}
      <div className="flex items-start gap-3 p-3.5">
        <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', statusCfg.color)} />

        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm leading-relaxed',
            assumption.status === 'incorrect' && 'line-through text-surface-400',
          )}>
            {assumption.content}
          </p>
          {assumption.resolution_note && (
            <p className="text-xs text-surface-400 mt-1 italic">
              Note: {assumption.resolution_note}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', assumptionStatusClass(assumption.status))}>
              {ASSUMPTION_STATUS_LABELS[assumption.status]}
            </span>
            {assumption.ai_generated && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-medium">
                AI suggested
              </span>
            )}
            <span className="text-xs text-surface-400">
              {formatRelativeTime(assumption.created_at)}
            </span>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {assumption.status === 'unknown' ? (
              <button
                onClick={() => setResolving((v) => !v)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors font-medium"
              >
                Resolve
              </button>
            ) : (
              <button
                onClick={handleUnresolve}
                disabled={isPending}
                title="Reset to unresolved"
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Resolve form */}
      <AnimatePresence>
        {resolving && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ResolveForm
              assumptionId={assumption.id}
              decisionId={decisionId}
              onClose={() => setResolving(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Resolve form ────────────────────────────────────────── */
function ResolveForm({
  assumptionId, decisionId, onClose,
}: {
  assumptionId: string; decisionId: string; onClose: () => void
}) {
  const action = resolveAssumption.bind(null, assumptionId, decisionId)
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(
    action as (state: ActionResult, formData: FormData) => Promise<ActionResult>,
    { success: false, error: undefined }
  )

  if (state.success) {
    onClose()
  }

  return (
    <form
      action={formAction}
      className="border-t border-surface-100 dark:border-surface-800 p-3.5 bg-surface-50 dark:bg-surface-800/50 space-y-3"
    >
      <p className="text-xs font-medium text-surface-700 dark:text-surface-300">
        Mark this assumption as:
      </p>
      <div className="grid grid-cols-3 gap-2">
        {([
          { value: 'correct',           label: 'Correct',    icon: CheckCircle2, color: 'text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800' },
          { value: 'partially_correct', label: 'Partial',    icon: MinusCircle,  color: 'text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800' },
          { value: 'incorrect',         label: 'Incorrect',  icon: XCircle,      color: 'text-red-500 border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800' },
        ] as const).map((opt) => (
          <label key={opt.value} className={cn('flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 cursor-pointer transition-all has-[:checked]:ring-2 has-[:checked]:ring-brand-500', opt.color)}>
            <input type="radio" name="status" value={opt.value} className="sr-only" required />
            <opt.icon className="w-4 h-4" />
            <span className="text-xs font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
      <input
        name="resolution_note"
        placeholder="Optional: what proved this right or wrong?"
        className={cn(
          'w-full h-9 px-3 text-xs rounded-lg border outline-none transition-all',
          'bg-white dark:bg-surface-900',
          'border-surface-200 dark:border-surface-700',
          'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10',
          'placeholder:text-surface-400'
        )}
      />
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button type="submit" size="sm" loading={isPending}>Save</Button>
      </div>
    </form>
  )
}

/* ── Main Panel ──────────────────────────────────────────── */
export function AssumptionPanel({
  assumptions,
  decisionId,
  orgId,
  canEdit = true,
}: {
  assumptions: Assumption[]
  decisionId: string
  orgId: string
  canEdit?: boolean
}) {
  const [showAdd, setShowAdd] = useState(false)

  const action = createAssumption.bind(null, decisionId, orgId)
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(
    action as (state: ActionResult, formData: FormData) => Promise<ActionResult>,
    { success: false, error: undefined }
  )

  if (state.success && showAdd) setShowAdd(false)

  const resolved   = assumptions.filter((a) => a.status !== 'unknown')
  const unresolved = assumptions.filter((a) => a.status === 'unknown')
  const correct    = assumptions.filter((a) => a.status === 'correct')
  const accuracy   = resolved.length > 0 ? Math.round((correct.length / resolved.length) * 100) : null

  return (
    <div>
      {/* Stats */}
      {assumptions.length > 0 && (
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="text-surface-500">
            {assumptions.length} assumption{assumptions.length !== 1 ? 's' : ''}
          </span>
          <span className="text-surface-300 dark:text-surface-700">·</span>
          <span className="text-amber-600 dark:text-amber-400">
            {unresolved.length} unresolved
          </span>
          {accuracy !== null && (
            <>
              <span className="text-surface-300 dark:text-surface-700">·</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {accuracy}% accuracy
              </span>
            </>
          )}
        </div>
      )}

      {/* List */}
      <div className="space-y-2 mb-4">
        {assumptions.length === 0 ? (
          <div className="text-center py-8 text-surface-400">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No assumptions documented yet.</p>
          </div>
        ) : (
          <AnimatePresence>
            {assumptions.map((a) => (
              <AssumptionItem key={a.id} assumption={a} decisionId={decisionId} canEdit={canEdit} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add form */}
      {canEdit && (
        <AnimatePresence>
          {showAdd ? (
            <motion.form
              action={formAction}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="border border-brand-200 dark:border-brand-800 rounded-xl p-4 space-y-3 bg-brand-50/30 dark:bg-brand-950/10"
            >
              <input
                name="content"
                autoFocus
                placeholder="e.g. Users will prefer the new checkout flow"
                className={cn(
                  'w-full h-10 px-3 text-sm rounded-[10px] border outline-none transition-all',
                  'bg-white dark:bg-surface-900',
                  'border-surface-200 dark:border-surface-700',
                  'focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10',
                  'placeholder:text-surface-400'
                )}
              />
              {state.error && !state.success && (
                <p className="text-xs text-red-600">{state.error}</p>
              )}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" loading={isPending}>
                  Add assumption
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add assumption
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
