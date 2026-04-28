import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getPendingAssumptions } from '@/lib/supabase/queries'
import { ROUTES, ASSUMPTION_STATUS_LABELS } from '@/constants'
import { cn, formatRelativeTime, assumptionStatusClass } from '@/utils'
import { EmptyState } from '@/components/ui/primitives'
import { Brain } from 'lucide-react'
import { PageMotion } from '@/components/ui/page-motion'

export const metadata: Metadata = { title: 'Assumptions · StemmQ' }

export default async function AssumptionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: membership } = await supabase
    .from('org_members').select('org_id').eq('user_id', user.id).limit(1).maybeSingle()
  if (!membership) redirect(ROUTES.login)

  const { data: pending } = await getPendingAssumptions(supabase, membership.org_id)

  // Also load recently resolved
  const { data: resolved } = await supabase
    .from('assumptions')
    .select('*, decisions(id, title)')
    .eq('org_id', membership.org_id)
    .neq('status', 'unknown')
    .order('resolved_at', { ascending: false })
    .limit(20)

  const total = (pending?.length ?? 0) + (resolved?.length ?? 0)

  return (
    <PageMotion>
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-1">Assumptions</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Track and resolve assumptions across all decisions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total tracked',  value: total },
          { label: 'Pending resolve', value: pending?.length ?? 0, accent: 'text-amber-600 dark:text-amber-400' },
          { label: 'Resolved',       value: resolved?.length ?? 0, accent: 'text-emerald-600 dark:text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4">
            <p className="text-xs text-[var(--muted-foreground)] mb-1">{s.label}</p>
            <p className={cn('font-display font-bold text-2xl', s.accent)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pending */}
      <section className="mb-8">
        <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          Unresolved ({pending?.length ?? 0})
        </h2>
        {!pending?.length ? (
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-8 text-center text-[var(--muted-foreground)]">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">All assumptions resolved — great work!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pending.map((a) => {
              const dec = Array.isArray(a.decisions) ? a.decisions[0] : a.decisions
              return (
                <Link
                  key={a.id}
                  href={`${ROUTES.decisions}/${a.decision_id}`}
                  className="flex items-start gap-4 p-4 bg-[var(--card)] rounded-2xl border border-[var(--border)] hover:border-amber-200 dark:hover:border-amber-800 hover:shadow-sm transition-all group"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-brand-600  transition-colors">
                      {a.content}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      On: <span className="text-[var(--muted-foreground)]">{dec?.title ?? 'Unknown decision'}</span>
                      {' · '}{formatRelativeTime(a.created_at)}
                    </p>
                  </div>
                  <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                    Resolve →
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Resolved */}
      {(resolved?.length ?? 0) > 0 && (
        <section>
          <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Recently resolved ({resolved?.length ?? 0})
          </h2>
          <div className="space-y-2">
            {resolved?.map((a) => {
              const dec = Array.isArray(a.decisions) ? a.decisions[0] : a.decisions
              return (
                <Link
                  key={a.id}
                  href={`${ROUTES.decisions}/${a.decision_id}`}
                  className="flex items-start gap-4 p-4 bg-[var(--card)] rounded-2xl border border-[var(--border)] hover:shadow-sm transition-all group opacity-75 hover:opacity-100"
                >
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-2', {
                    'bg-emerald-400': a.status === 'correct',
                    'bg-red-400':     a.status === 'incorrect',
                    'bg-amber-400':   a.status === 'partially_correct',
                  })} />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium', a.status === 'incorrect' && 'line-through text-[var(--muted-foreground)]')}>
                      {a.content}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      {dec?.title ?? 'Unknown decision'} · {formatRelativeTime(a.created_at)}
                    </p>
                  </div>
                  <span className={cn(
                    'text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0',
                    assumptionStatusClass(a.status)
                  )}>
                    {ASSUMPTION_STATUS_LABELS[a.status]}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
    </PageMotion>
  )
}
