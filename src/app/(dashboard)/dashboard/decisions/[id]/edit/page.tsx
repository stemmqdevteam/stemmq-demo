import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DecisionForm } from '@/features/decisions/components/decision-form'
import { ROUTES } from '@/constants'

export const metadata: Metadata = { title: 'Edit Decision · StemmQ' }

export default async function EditDecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: membership } = await supabase
    .from('org_members').select('org_id').eq('user_id', user.id).limit(1).maybeSingle()
  if (!membership) redirect(ROUTES.login)

  const { data: decision } = await supabase
    .from('decisions')
    .select(`*, assumptions (id, content, status), expected_outcomes (id, title, metric, target_value, timeframe)`)
    .eq('id', id).eq('org_id', membership.org_id).single()

  if (!decision) notFound()

  return (
    <div className="h-[calc(100dvh-0px)] lg:h-full flex flex-col overflow-hidden">
      <DecisionForm mode="edit" decision={decision} orgId={membership.org_id} />
    </div>
  )
}