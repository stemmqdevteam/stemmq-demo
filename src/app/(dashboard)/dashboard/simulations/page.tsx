import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SimulationsList } from '@/features/simulations/components/simulations-list'
import { ROUTES, PLAN_FEATURES } from '@/constants'

export const metadata: Metadata = { title: 'Simulations · StemmQ' }

export default async function SimulationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: membership } = await supabase
    .from('org_members').select('org_id').eq('user_id', user.id).limit(1).maybeSingle()
  if (!membership) redirect(ROUTES.login)

  const orgId = membership.org_id

  const { data: sub } = await supabase
    .from('subscriptions').select('plan, status').eq('org_id', orgId).single()

  const plan        = sub?.plan ?? 'free'
  const isActive    = !sub || ['active', 'trialing'].includes(sub.status)
  const canSimulate = (plan === 'pro' || plan === 'enterprise') && isActive

  // Load data in parallel
  const [
    { data: simulations },
    { data: decisions },
    { data: allAssumptions },
    { data: scores },
  ] = await Promise.all([
    supabase
      .from('simulations')
      .select('*, decisions(title, intent, quality_score)')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false }),
    supabase
      .from('decisions')
      .select('id, title, intent, status, quality_score, description, expected_outcomes, assumptions(*)')
      .eq('org_id', orgId)
      .in('status', ['active', 'resolved'])
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('assumptions')
      .select('status')
      .eq('org_id', orgId)
      .neq('status', 'unknown'),
    supabase
      .from('decisions')
      .select('quality_score')
      .eq('org_id', orgId)
      .not('quality_score', 'is', null),
  ])

  // Build org context for AI
  const resolved   = allAssumptions?.filter((a) => a.status !== 'unknown') ?? []
  const correct    = allAssumptions?.filter((a) => a.status === 'correct')  ?? []
  const accuracyRate = resolved.length > 0
    ? Math.round((correct.length / resolved.length) * 100)
    : null

  const avgScore = scores && scores.length > 0
    ? Math.round(scores.reduce((s, d) => s + (d.quality_score ?? 0), 0) / scores.length)
    : null

  const orgContext = {
    accuracy_rate:     accuracyRate,
    avg_quality_score: avgScore,
    resolved_count:    decisions?.filter((d) => d.status === 'resolved').length ?? 0,
    failure_patterns:  accuracyRate !== null && accuracyRate < 50
      ? 'Low assumption accuracy — historical overconfidence detected'
      : 'No significant failure patterns',
  }

  // Shape decisions for the wizard
  const decisionOptions = (decisions ?? []).map((d) => ({
    id:               d.id,
    title:            d.title,
    intent:           d.intent,
    status:           d.status,
    quality_score:    d.quality_score,
    description:      d.description,
    assumptions:      (d.assumptions ?? []).map((a: { content: string; status: string }) => ({
      content: a.content,
      status:  a.status,
    })),
    expected_outcomes: (d.expected_outcomes ?? []).map((o: { title: string; target_value?: string }) => ({
      title:        o.title,
      target_value: o.target_value,
    })),
  }))

  return (
    <SimulationsList
      simulations={(simulations ?? []) as Parameters<typeof SimulationsList>[0]['simulations']}
      decisions={decisionOptions}
      orgId={orgId}
      orgContext={orgContext}
      canSimulate={canSimulate}
    />
  )
}
