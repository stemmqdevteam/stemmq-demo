import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })

  // Must be admin
  const { data: profile } = await supabase
    .from('user_profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  const { orgId, plan } = await request.json()
  if (!orgId || !plan || !['free', 'pro', 'enterprise'].includes(plan)) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Update both tables atomically
  const [orgResult, subResult] = await Promise.all([
    admin.from('organizations').update({ plan }).eq('id', orgId),
    admin.from('subscriptions').upsert({
      org_id: orgId,
      plan,
      status: 'active',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'org_id' }),
  ])

  if (orgResult.error) return NextResponse.json({ success: false, error: orgResult.error.message }, { status: 500 })
  if (subResult.error) return NextResponse.json({ success: false, error: subResult.error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
