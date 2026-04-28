import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/constants'
import { UsageView } from '@/features/settings/components/usage-view'
export const metadata: Metadata = { title: 'Usage · StemmQ' }
export default async function UsagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)
  const { data: membership } = await supabase.from('org_members').select('org_id, role').eq('user_id', user.id).limit(1).maybeSingle()
  if (!membership) redirect(ROUTES.login)
  const [
    { data: subscription },
    { count: decisions },
    { count: assumptions },
    { count: simulations },
    { data: aiUsage },
  ] = await Promise.all([
    supabase.from('subscriptions').select('plan, status').eq('org_id', membership.org_id).single(),
    supabase.from('decisions').select('*', { count: 'exact', head: true }).eq('org_id', membership.org_id),
    supabase.from('assumptions').select('*', { count: 'exact', head: true }).eq('org_id', membership.org_id),
    supabase.from('simulations').select('*', { count: 'exact', head: true }).eq('org_id', membership.org_id),
    supabase.from('audit_logs').select('*', { count: 'exact', head: false }).eq('user_id', user.id).eq('action', 'ai_assumption_generated')
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ])
  return (
    <UsageView
      plan={subscription?.plan ?? 'free'}
      decisions={decisions ?? 0}
      assumptions={assumptions ?? 0}
      simulations={simulations ?? 0}
      aiUsageThisMonth={aiUsage?.length ?? 0}
    />
  )
}
