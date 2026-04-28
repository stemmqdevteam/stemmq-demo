'use client'

import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  GitBranch, Plus, Search, SlidersHorizontal,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react'
import { buttonClass } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { EmptyState, ScoreRing } from '@/components/ui/primitives'
import { cn, formatRelativeTime, intentBadgeClass, statusBadgeClass } from '@/utils'
import {
  ROUTES, INTENT_LABELS, DECISION_STATUS_LABELS, PER_PAGE,
} from '@/constants'

interface DecisionRow {
  id: string
  title: string
  intent: string
  status: string
  quality_score: number | null
  created_at: string
  tags: string[]
}

interface Props {
  decisions: DecisionRow[]
  total: number
  page: number
  status?: string
  intent?: string
  search?: string
}

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'active',   label: 'Active' },
  { value: 'draft',    label: 'Draft' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'archived', label: 'Archived' },
]

const INTENT_FILTERS = [
  { value: '',           label: 'All intents' },
  { value: 'growth',     label: '📈 Growth' },
  { value: 'efficiency', label: '⚡ Efficiency' },
  { value: 'risk',       label: '🛡️ Risk' },
  { value: 'experiment', label: '🧪 Experiment' },
  { value: 'other',      label: '⚙️ Other' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: i * 0.04 },
  }),
}

export function DecisionList({
  decisions, total, page, status, intent, search,
}: Props) {
  const router    = useRouter()
  const pathname  = usePathname()
  const searchParams = useSearchParams()

  const updateQuery = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v)
        else params.delete(k)
      })
      params.delete('page') // reset to page 1 on filter change
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const totalPages = Math.ceil(total / PER_PAGE)
  const hasFilters = !!(status || intent || search)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-0.5">Decisions</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {total} decision{total !== 1 ? 's' : ''}
            {hasFilters ? ' (filtered)' : ''}
          </p>
        </div>
        <Link href={ROUTES.newDecision} className={buttonClass({ variant: 'primary' })}>
          <Plus className="w-4 h-4" /> New Decision
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
          <input
            defaultValue={search}
            placeholder="Search decisions…"
            className={cn(
              'w-full h-10 pl-9 pr-3 rounded-[10px] border text-sm outline-none transition-all',
              'bg-[var(--card)]',
              'border-[var(--border)]',
              'focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10',
              'placeholder:text-[var(--muted-foreground)]'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateQuery({ search: (e.target as HTMLInputElement).value || undefined })
              }
            }}
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-1 bg-[var(--muted)] rounded-[10px] p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => updateQuery({ status: f.value || undefined })}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                (status ?? '') === f.value
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Intent filter */}
        <select
          value={intent ?? ''}
          onChange={(e) => updateQuery({ intent: e.target.value || undefined })}
          className={cn(
            'h-10 px-3 rounded-[10px] border text-sm outline-none transition-all cursor-pointer',
            'bg-[var(--card)]',
            'border-[var(--border)]',
            'focus:border-brand-500 text-[var(--muted-foreground)]'
          )}
        >
          {INTENT_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => updateQuery({ status: undefined, intent: undefined, search: undefined })}
            className="flex items-center gap-1.5 px-3 h-10 rounded-[10px] text-sm text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* List */}
      {decisions.length === 0 ? (
        <Card>
          <EmptyState
            icon={<GitBranch className="w-8 h-8" />}
            title={hasFilters ? 'No decisions match your filters' : 'No decisions yet'}
            description={
              hasFilters
                ? 'Try changing or clearing your filters.'
                : 'Create your first decision to start building decision intelligence.'
            }
            action={
              !hasFilters ? (
                <Link href={ROUTES.newDecision} className={buttonClass({ variant: 'primary', size: 'sm' })}>
                  <Plus className="w-4 h-4" /> Create decision
                </Link>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {decisions.map((d, i) => (
            <motion.div key={d.id} variants={fadeUp} custom={i} initial="hidden" animate="show">
              <Link
                href={`${ROUTES.decisions}/${d.id}`}
                className="group flex items-center gap-4 p-4 bg-[var(--card)] rounded-[14px] border border-[var(--border)] hover:border-[var(--muted-foreground)]/30 hover:shadow-md transition-all duration-200"
              >
                {/* Intent indicator */}
                <div className={cn('w-1 self-stretch rounded-full flex-shrink-0', {
                  'bg-emerald-400': d.intent === 'growth',
                  'bg-blue-400':    d.intent === 'efficiency',
                  'bg-red-400':     d.intent === 'risk',
                  'bg-purple-400':  d.intent === 'experiment',
                  'bg-[var(--muted)]': d.intent === 'other',
                })} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-[var(--accent)] transition-colors mb-1.5">
                    {d.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', intentBadgeClass(d.intent))}>
                      {INTENT_LABELS[d.intent] ?? d.intent}
                    </span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusBadgeClass(d.status))}>
                      {DECISION_STATUS_LABELS[d.status] ?? d.status}
                    </span>
                    {d.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" size="xs">#{tag}</Badge>
                    ))}
                    <span className="text-xs text-[var(--muted-foreground)] ml-auto hidden sm:block">
                      {formatRelativeTime(d.created_at)}
                    </span>
                  </div>
                </div>

                {d.quality_score != null && (
                  <ScoreRing score={Math.round(d.quality_score)} size={40} strokeWidth={3.5} />
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-[var(--muted-foreground)]">
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => updateQuery({ page: String(page - 1) })}
              disabled={page <= 1}
              className={cn(
                buttonClass({ variant: 'outline', size: 'sm' }),
                'disabled:opacity-40 disabled:pointer-events-none'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateQuery({ page: String(page + 1) })}
              disabled={page >= totalPages}
              className={cn(
                buttonClass({ variant: 'outline', size: 'sm' }),
                'disabled:opacity-40 disabled:pointer-events-none'
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
