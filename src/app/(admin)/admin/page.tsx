import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/features/admin/components/admin-dashboard'

export const metadata: Metadata = { title: 'Admin · StemmQ' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  const admin = createAdminClient()

  const { data: adminProfile, error: adminErr } = await admin
    .from('user_profiles').select('is_admin, full_name').eq('id', user.id).single()

  if (adminErr || !adminProfile?.is_admin) redirect('/dashboard')

  const [
    { data: orgs },
    { data: allUsers },
    { data: decisions },
    { data: subscriptions },
    { data: assumptions },
    { data: simulations },
    { data: notifications },
  ] = await Promise.all([
    admin.from('organizations').select('id, name, plan, config, created_at').order('created_at', { ascending: false }),
    admin.from('user_profiles').select('id, full_name, avatar_url, job_title, is_admin, created_at').order('created_at', { ascending: false }),
    admin.from('decisions').select('id, org_id, status, intent, created_at').order('created_at', { ascending: false }),
    admin.from('subscriptions').select('org_id, plan, status, stripe_customer_id, stripe_subscription_id, current_period_end, created_at').order('created_at', { ascending: false }),
    admin.from('assumptions').select('id, org_id, status, created_at'),
    admin.from('simulations').select('id, org_id, type, status, created_at'),
    admin.from('notifications').select('id, created_at').order('created_at', { ascending: false }).limit(1000),
  ])

  const now          = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - 7)
  const startOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const proOrgs  = subscriptions?.filter((s: { plan: string; status: string }) => s.plan === 'pro'        && s.status === 'active').length ?? 0
  const entOrgs  = subscriptions?.filter((s: { plan: string; status: string }) => s.plan === 'enterprise' && s.status === 'active').length ?? 0
  const freeOrgs = (orgs?.length ?? 0) - proOrgs - entOrgs

  const stats = {
    // Totals
    total_orgs:        orgs?.length        ?? 0,
    total_users:       allUsers?.length    ?? 0,
    total_decisions:   decisions?.length   ?? 0,
    total_assumptions: assumptions?.length ?? 0,
    total_simulations: simulations?.length ?? 0,
    // Revenue
    mrr_usd:    proOrgs * 29 + entOrgs * 299,
    arr_usd:    (proOrgs * 29 + entOrgs * 299) * 12,
    // Plans
    free_orgs:       freeOrgs,
    pro_orgs:        proOrgs,
    enterprise_orgs: entOrgs,
    // Growth
    new_orgs_today:   orgs?.filter((o: { created_at: string | number | Date }) => new Date(o.created_at) >= startOfDay).length  ?? 0,
    new_orgs_week:    orgs?.filter((o: { created_at: string | number | Date }) => new Date(o.created_at) >= startOfWeek).length ?? 0,
    new_orgs_month:   orgs?.filter((o: { created_at: string | number | Date }) => new Date(o.created_at) >= startOfMonth).length ?? 0,
    new_users_month:  allUsers?.filter((u: { created_at: string | number | Date }) => new Date(u.created_at) >= startOfMonth).length ?? 0,
    new_decisions_week: decisions?.filter((d: { created_at: string | number | Date }) => new Date(d.created_at) >= startOfWeek).length ?? 0,
    active_decisions:   decisions?.filter((d: { status: string }) => d.status === 'active').length ?? 0,
    resolved_decisions: decisions?.filter((d: { status: string }) => d.status === 'resolved').length ?? 0,
    admin_count:        allUsers?.filter((u: { is_admin: any }) => u.is_admin).length ?? 0,
  }

  const orgRows = (orgs ?? []).map((org: { id: any }) => ({
    ...org,
    decision_count:   decisions?.filter((d: { org_id: any }) => d.org_id === org.id).length   ?? 0,
    member_count:     allUsers?.length ?? 0, // will be fetched per-org in future
    simulation_count: simulations?.filter((s: { org_id: any }) => s.org_id === org.id).length ?? 0,
    subscription:     subscriptions?.find((s: { org_id: any }) => s.org_id === org.id) ?? null,
  }))

  const userRows = (allUsers ?? []).map((u: any) => ({
    ...u,
    org: orgs?.find((o: any) => {
      // match via subscriptions/members — simplified for now
      return false
    }) ?? null,
  }))

  const recentDecisions = (decisions ?? []).slice(0, 50).map((d: { org_id: any }) => ({
    ...d,
    org_name: orgs?.find((o: { id: any }) => o.id === d.org_id)?.name ?? 'Unknown',
  }))

  const currentAdmin = { id: user.id, full_name: adminProfile.full_name }

  return (
    <AdminDashboard
      stats={stats}
      orgs={orgRows}
      users={allUsers ?? []}
      recentDecisions={recentDecisions}
      currentAdmin={currentAdmin}
    />
  )
}