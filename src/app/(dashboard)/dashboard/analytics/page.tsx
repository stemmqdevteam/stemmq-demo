import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getAnalyticsData } from '@/lib/supabase/queries'
import { AnalyticsDashboard } from '@/features/analytics/components/analytics-dashboard'
import { ROUTES } from '@/constants'

export const metadata: Metadata = { title: 'Analytics · StemmQ' }

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: membership } = await supabase
    .from('org_members').select('org_id').eq('user_id', user.id).limit(1).maybeSingle()
  if (!membership) redirect(ROUTES.login)

  const data = await getAnalyticsData(supabase, membership.org_id)

  return <AnalyticsDashboard data={data} />
}
