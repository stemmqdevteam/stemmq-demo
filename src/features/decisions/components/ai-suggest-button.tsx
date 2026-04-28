'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Plus, Loader2, AlertCircle, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { usePlan } from '@/store'
import { buttonClass } from '@/components/ui/button'
import { cn } from '@/utils'

interface Props {
  /** Current form values to send as context */
  title: string
  description: string
  intent: string
  reasoning: string
  existingAssumptions: string[]
  /** Called with each selected suggestion */
  onAdd: (assumption: string) => void
}

/**
 * AI Assumption Generator
 *
 * How it works:
 * 1. User fills in the decision title/context
 * 2. Clicks this button
 * 3. We send the context to /api/ai/assumptions
 * 4. Claude reads the decision and returns 5 assumptions the team may have missed
 * 5. User can pick which ones to add with one click
 *
 * This is the #1 reason teams upgrade to Pro — surfacing blind spots
 * before they become expensive mistakes.
 */
export function AISuggestButton({
  title,
  description,
  intent,
  reasoning,
  existingAssumptions,
  onAdd,
}: Props) {
  const [loading, setLoading]           = useState(false)
  const [suggestions, setSuggestions]   = useState<string[]>([])
  const [added, setAdded]               = useState<Set<number>>(new Set())
  const [error, setError]               = useState<string | null>(null)
  const [open, setOpen]                 = useState(false)
  const { isPro, plan }                 = usePlan()

  const generate = async () => {
    if (!title.trim()) {
      toast.error('Add a decision title first so Claude has context.')
      return
    }

    setLoading(true)
    setError(null)
    setSuggestions([])
    setAdded(new Set())
    setOpen(true)

    try {
      const res = await fetch('/api/ai/assumptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          intent,
          reasoning,
          existing_assumptions: existingAssumptions.filter(Boolean),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Failed to generate suggestions.')
        return
      }

      setSuggestions(data.assumptions ?? [])
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = (suggestion: string, index: number) => {
    onAdd(suggestion)
    setAdded((prev) => new Set([...prev, index]))
    toast.success('Assumption added')
  }

  // Free plan: show locked state
  if (!isPro && process.env.NODE_ENV === 'production') {
    return (
      <div className="flex items-center gap-2 text-sm text-surface-400">
        <Lock className="w-3.5 h-3.5" />
        <span>AI assumption generation requires</span>
        <a href="/dashboard/settings/billing" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
          Pro plan
        </a>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className={cn(
          buttonClass({ variant: 'secondary', size: 'sm' }),
          'gap-2 border border-purple-200 dark:border-purple-800',
          'text-purple-700 dark:text-purple-300',
          'bg-purple-50 dark:bg-purple-950/30',
          'hover:bg-purple-100 dark:hover:bg-purple-950/50',
          'disabled:opacity-60'
        )}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
        {loading ? 'StemmQ is thinking…' : 'Generate with AI'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-3"
          >
            <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  AI-generated assumptions
                </p>
                <span className="text-xs text-purple-500/60 ml-auto">
                  Click to add
                </span>
              </div>

              {loading && (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 animate-pulse" />
                  ))}
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {!loading && !error && suggestions.length > 0 && (
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => !added.has(i) && handleAdd(s, i)}
                      disabled={added.has(i)}
                      className={cn(
                        'w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg text-sm transition-all',
                        added.has(i)
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 cursor-default opacity-70'
                          : 'bg-white dark:bg-surface-900 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-surface-700 dark:text-surface-300 border border-purple-100 dark:border-purple-900 hover:border-purple-300'
                      )}
                    >
                      <Plus className={cn(
                        'w-3.5 h-3.5 flex-shrink-0 mt-0.5',
                        added.has(i) ? 'text-emerald-500' : 'text-purple-400'
                      )} />
                      <span>{s}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {!loading && !error && suggestions.length === 0 && (
                <p className="text-xs text-surface-400 text-center py-2">
                  No suggestions generated. Try adding more context to your decision.
                </p>
              )}

              {!loading && suggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-purple-100 dark:border-purple-900 flex items-center justify-between">
                  <p className="text-xs text-purple-500/70">
                    {added.size} of {suggestions.length} added
                  </p>
                  <button
                    type="button"
                    onClick={generate}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
