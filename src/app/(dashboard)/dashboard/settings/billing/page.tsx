import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BillingView } from '@/features/billing/components/billing-view'
import { ROUTES } from '@/constants'

export const metadata: Metadata = { title: 'Billing · StemmQ' }

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: membership } = await supabase
    .from('org_members').select('org_id, role').eq('user_id', user.id).limit(1).maybeSingle()
  if (!membership) redirect(ROUTES.login)

  const [{ data: subscription }, { data: org }] = await Promise.all([
    supabase.from('subscriptions').select('plan, status, current_period_end, cancel_at_period_end, stripe_customer_id').eq('org_id', membership.org_id).single(),
    supabase.from('organizations').select('name, plan').eq('id', membership.org_id).single(),
  ])

  return (
    <BillingView
      subscription={subscription ?? null}
      org={org ?? null}
      isAdmin={['owner', 'admin'].includes(membership.role)}
    />
  )
}
