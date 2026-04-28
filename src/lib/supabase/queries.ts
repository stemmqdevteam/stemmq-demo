/**
 * Shared server-side query helpers.
 * Import in Server Components and Server Actions — never in client components.
 *
 * Pattern:
 *   const supabase = await createClient()
 *   const data = await getDecisions(supabase, orgId)
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Decision, Assumption, DashboardStats } from '@/types'

// ── User / Org ────────────────────────────────────────────

export async function getUserProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function getUserOrgMembership(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('org_members')
    .select('org_id, role, organizations(*)')
    .eq('user_id', userId)
    .limit(1)
    .single()
  return { data, error }
}

export async function getOrgSubscription(supabase: SupabaseClient, orgId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('org_id', orgId)
    .single()
  return { data, error }
}

// ── Decisions ─────────────────────────────────────────────

export async function getDecisions(
  supabase: SupabaseClient,
  orgId: string,
  opts: { page?: number; perPage?: number; status?: string; intent?: string } = {}
) {
  const { page = 1, perPage = 20, status, intent } = opts
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('decisions')
    .select(
      'id, title, intent, status, quality_score, created_at, created_by, tags',
      { count: 'exact' }
    )
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status) query = query.eq('status', status)
  if (intent) query = query.eq('intent', intent)

  return query
}

export async function getDecisionById(
  supabase: SupabaseClient,
  decisionId: string,
  orgId: string
) {
  const { data, error } = await supabase
    .from('decisions')
    .select('*, assumptions(*), outcomes(*)')
    .eq('id', decisionId)
    .maybeSingle()

  // Verify org access in application code (RLS also enforces this)
  if (data && data.org_id !== orgId) {
    return { data: null, error: null }
  }

  return { data: data as Decision | null, error }
}

// ── Assumptions ───────────────────────────────────────────

export async function getAssumptionsByDecision(
  supabase: SupabaseClient,
  decisionId: string
) {
  const { data, error } = await supabase
    .from('assumptions')
    .select('*')
    .eq('decision_id', decisionId)
    .order('sort_order', { ascending: true })
  return { data: data as Assumption[] | null, error }
}

export async function getPendingAssumptions(supabase: SupabaseClient, orgId: string) {
  const { data, error } = await supabase
    .from('assumptions')
    .select('*, decisions(title)')
    .eq('org_id', orgId)
    .eq('status', 'unknown')
    .order('created_at', { ascending: false })
    .limit(20)
  return { data, error }
}

// ── Dashboard ─────────────────────────────────────────────

export async function getDashboardStats(
  supabase: SupabaseClient,
  orgId: string
): Promise<DashboardStats> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { count: total },
    { count: active },
    { count: resolved },
    { count: thisMonth },
    { count: pending },
    { data: scores },
    { data: assumptions },
  ] = await Promise.all([
    supabase
      .from('decisions')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId),
    supabase
      .from('decisions')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('status', 'active'),
    supabase
      .from('decisions')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('status', 'resolved'),
    supabase
      .from('decisions')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .gte('created_at', startOfMonth),
    supabase
      .from('assumptions')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('status', 'unknown'),
    supabase
      .from('decisions')
      .select('quality_score')
      .eq('org_id', orgId)
      .not('quality_score', 'is', null),
    supabase
      .from('assumptions')
      .select('status')
      .eq('org_id', orgId)
      .neq('status', 'unknown'),
  ])

  const avgQuality =
    scores && scores.length > 0
      ? scores.reduce((acc, d) => acc + (d.quality_score ?? 0), 0) / scores.length
      : null

  const correctCount =
    assumptions?.filter((a) => a.status === 'correct').length ?? 0
  const totalResolved = assumptions?.length ?? 0
  const accuracy = totalResolved > 0 ? (correctCount / totalResolved) * 100 : null

  return {
    total_decisions: total ?? 0,
    active_decisions: active ?? 0,
    resolved_decisions: resolved ?? 0,
    avg_quality_score: avgQuality ? Math.round(avgQuality * 10) / 10 : null,
    assumption_accuracy: accuracy ? Math.round(accuracy * 10) / 10 : null,
    pending_assumptions: pending ?? 0,
    decisions_this_month: thisMonth ?? 0,
  }
}

// ── Notifications ─────────────────────────────────────────

export async function getNotifications(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  return { data, error }
}

export async function getUnreadNotificationCount(
  supabase: SupabaseClient,
  userId: string
) {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)
  return { count: count ?? 0, error }
}

// ── Analytics ─────────────────────────────────────────────

export async function getAnalyticsData(supabase: SupabaseClient, orgId: string) {
  const now = new Date()

  // Last 6 months of data
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      key:   d.toISOString().slice(0, 7), // "2025-01"
      label: d.toLocaleString('default', { month: 'short' }),
      start: d.toISOString(),
      end:   new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString(),
    }
  })

  const [
    { data: allDecisions },
    { data: allAssumptions },
  ] = await Promise.all([
    supabase
      .from('decisions')
      .select('id, title, intent, status, quality_score, created_at, resolved_at')
      .eq('org_id', orgId),
    supabase
      .from('assumptions')
      .select('status, created_at, resolved_at')
      .eq('org_id', orgId),
  ])

  const decisions   = allDecisions   ?? []
  const assumptions = allAssumptions ?? []

  // Decisions trend (last 6 months)
  const decisions_trend = months.map((m) => ({
    month:     m.label,
    decisions: decisions.filter((d) => d.created_at >= m.start && d.created_at <= m.end).length,
    resolved:  decisions.filter((d) => d.resolved_at && d.resolved_at >= m.start && d.resolved_at <= m.end).length,
  }))

  // Intent breakdown
  const intents = ['growth', 'efficiency', 'risk', 'experiment', 'other']
  const intent_breakdown = intents.map((intent) => ({
    intent,
    count: decisions.filter((d) => d.intent === intent).length,
    color: '',
  }))

  // Assumption accuracy trend (last 6 months)
  const assumption_trend = months.map((m) => {
    const monthResolved = assumptions.filter(
      (a) => a.status !== 'unknown' && a.resolved_at && a.resolved_at >= m.start && a.resolved_at <= m.end
    )
    const correct = monthResolved.filter((a) => a.status === 'correct').length
    const accuracy = monthResolved.length > 0
      ? Math.round((correct / monthResolved.length) * 100)
      : 0
    return { month: m.label, accuracy, total: monthResolved.length }
  })

  // DQS distribution (buckets of 20)
  const buckets = ['0–20', '21–40', '41–60', '61–80', '81–100']
  const scored = decisions.filter((d) => d.quality_score !== null)
  const dqs_distribution = buckets.map((range, i) => ({
    range,
    count: scored.filter((d) => {
      const s = d.quality_score!
      return s >= i * 20 && s <= (i + 1) * 20
    }).length,
  }))

  // Top performers
  const top_performers = [...scored]
    .sort((a, b) => (b.quality_score ?? 0) - (a.quality_score ?? 0))
    .slice(0, 5)
    .map((d) => ({ title: d.title, score: d.quality_score! }))

  // Overall stats
  const resolved    = decisions.filter((d) => d.status === 'resolved')
  const correctA    = assumptions.filter((a) => a.status === 'correct')
  const resolvedA   = assumptions.filter((a) => a.status !== 'unknown')
  const pendingA    = assumptions.filter((a) => a.status === 'unknown')
  const avgScore    = scored.length > 0
    ? scored.reduce((s, d) => s + (d.quality_score ?? 0), 0) / scored.length
    : null
  const accuracy    = resolvedA.length > 0
    ? (correctA.length / resolvedA.length) * 100
    : null

  return {
    total_decisions:     decisions.length,
    resolved_decisions:  resolved.length,
    avg_quality_score:   avgScore ? Math.round(avgScore * 10) / 10 : null,
    assumption_accuracy: accuracy ? Math.round(accuracy * 10) / 10 : null,
    pending_assumptions: pendingA.length,
    decisions_trend,
    intent_breakdown,
    assumption_trend,
    dqs_distribution,
    top_performers,
  }
}
