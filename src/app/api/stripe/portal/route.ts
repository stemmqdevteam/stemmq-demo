import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

/**
 * POST /api/stripe/portal
 *
 * Creates a Stripe Customer Portal session.
 * This lets users manage their subscription directly:
 * - Update payment method
 * - Cancel subscription
 * - Download invoices
 * - Change plan
 */
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: membership } = await supabase
      .from('org_members')
      .select('org_id, role')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (!membership) return NextResponse.json({ error: 'No organization' }, { status: 403 })
    if (!['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Only admins can manage billing' }, { status: 403 })
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('org_id', membership.org_id)
      .single()

    if (!sub?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No billing account found. Please upgrade to a paid plan first.' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.billingPortal.sessions.create({
      customer:   sub.stripe_customer_id,
      return_url: `${appUrl}/dashboard/settings/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/portal] error:', err)
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 })
  }
}
