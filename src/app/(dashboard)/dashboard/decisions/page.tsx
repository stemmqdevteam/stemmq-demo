import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getDecisions } from '@/lib/supabase/queries'
import { DecisionList } from '@/features/decisions/components/decision-list'
import { ROUTES, PER_PAGE } from '@/constants'

export const metadata: Metadata = { title: 'Decisions · StemmQ' }

interface Props {
  searchParams: Promise<{ page?: string; status?: string; intent?: string; search?: string }>
}

export default async function DecisionsPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: membership } = await supabase
    .from('org_members').select('org_id').eq('user_id', user.id).limit(1).maybeSingle()
  if (!membership) redirect(ROUTES.login)

  const params = await searchParams
  const page   = Math.max(1, parseInt(params.page ?? '1'))
  const status  = params.status
  const intent  = params.intent
  const search  = params.search

  let query = supabase
    .from('decisions')
    .select('id, title, intent, status, quality_score, created_at, tags', { count: 'exact' })
    .eq('org_id', membership.org_id)
    .order('created_at', { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1)

  if (status) query = query.eq('status', status)
  if (intent) query = query.eq('intent', intent)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data: decisions, count } = await query

  return (
    <DecisionList
      decisions={decisions ?? []}
      total={count ?? 0}
      page={page}
      status={status}
      intent={intent}
      search={search}
    />
  )
}
