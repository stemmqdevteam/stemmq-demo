import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardOverview } from '@/features/analytics/components/dashboard-overview'
import { ROUTES } from '@/constants'
import type { DashboardStats } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Dashboard · StemmQ' }

async function getDashboardStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  orgId: string,
  userId: string,
): Promise<DashboardStats> {
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    totalResult,
    activeResult,
    resolvedResult,
    monthResult,
    assumptionsResult,
    qualityResult,
    accuracyResult,
  ] = await Promise.all([
    supabase.from('decisions').select('*', { count: 'exact', head: true })
      .eq('org_id', orgId),
    supabase.from('decisions').select('*', { count: 'exact', head: true })
      .eq('org_id', orgId).eq('status', 'active'),
    supabase.from('decisions').select('*', { count: 'exact', head: true })
      .eq('org_id', orgId).eq('status', 'resolved'),
    supabase.from('decisions').select('*', { count: 'exact', head: true })
      .eq('org_id', orgId).gte('created_at', firstOfMonth),
    supabase.from('assumptions').select('*', { count: 'exact', head: true })
      .eq('org_id', orgId).eq('status', 'pending'),
    supabase.from('decisions').select('quality_score')
      .eq('org_id', orgId).not('quality_score', 'is', null),
    supabase.from('assumptions').select('outcome')
      .eq('org_id', orgId).eq('status', 'resolved'),
  ])
  
  // Avg quality score
  const scores = qualityResult.data?.map(d => d.quality_score).filter(Boolean) ?? []
  const avgQuality = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null

  // Assumption accuracy
  const outcomes = accuracyResult.data ?? []
  const correct  = outcomes.filter(a => a.outcome === 'correct').length
  const accuracy = outcomes.length > 0 ? Math.round((correct / outcomes.length) * 100) : null

  return {
    total_decisions:      totalResult.count ?? 0,
    active_decisions:     activeResult.count ?? 0,
    resolved_decisions:   resolvedResult.count ?? 0,
    decisions_this_month: monthResult.count ?? 0,
    pending_assumptions:  assumptionsResult.count ?? 0,
    avg_quality_score:    avgQuality,
    assumption_accuracy:  accuracy,
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const [profileResult, membershipResult] = await Promise.all([
    supabase.from('user_profiles').select('full_name').eq('id', user.id).single(),
    supabase
      .from('org_members')
      .select('org_id, organizations(id, name, config)')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle(),
  ])

  const orgRaw = membershipResult.data?.organizations
  const org    = Array.isArray(orgRaw) ? orgRaw[0] : orgRaw
  const orgId  = org?.id

  if (!orgId) redirect(ROUTES.login)

  const [stats, decisionsResult] = await Promise.all([
    getDashboardStats(supabase, orgId, user.id),
    supabase
      .from('decisions')
      .select('id, title, intent, status, quality_score, created_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const serverFirstName = profileResult.data?.full_name?.split(' ')[0] ?? null

  return (
    <div className="page-enter">
      <DashboardOverview
        stats={stats}
        recentDecisions={decisionsResult.data ?? []}
        serverFirstName={serverFirstName}
      />
    </div>
  )
}
