import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DecisionForm } from '@/features/decisions/components/decision-form'
import { ROUTES } from '@/constants'

export const metadata: Metadata = { title: 'New Decision · StemmQ' }

export default async function NewDecisionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: membership } = await supabase
    .from('org_members').select('org_id').eq('user_id', user.id).limit(1).maybeSingle()
  if (!membership) redirect(ROUTES.login)

  return (
    <div className="h-[calc(100dvh-0px)] lg:h-full flex flex-col overflow-hidden">
      <DecisionForm mode="create" orgId={membership.org_id} />
    </div>
  )
}