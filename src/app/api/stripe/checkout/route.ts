import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, getPriceIdForPlan } from '@/lib/stripe'

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout session for plan upgrades.
 * After payment, Stripe redirects to /api/stripe/webhook
 * which updates the subscription in our DB.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { plan = 'pro', interval = 'monthly' } = await request.json()

    // Get org + subscription
    const { data: membership } = await supabase
      .from('org_members')
      .select('org_id, role, organizations(name)')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (!membership) return NextResponse.json({ error: 'No organization' }, { status: 403 })
    if (!['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Only admins can manage billing' }, { status: 403 })
    }

    const orgId = membership.org_id
    const orgName = (Array.isArray(membership.organizations)
      ? membership.organizations[0]
      : membership.organizations) as { name: string } | null

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('org_id', orgId)
      .single()

    const priceId = getPriceIdForPlan(plan as 'pro', interval as 'monthly' | 'yearly')
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    // Reuse existing Stripe customer or create new one
    let customerId = sub?.stripe_customer_id ?? undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  orgName?.name ?? undefined,
        metadata: {
          org_id:  orgId,
          user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID immediately
      await supabase
        .from('subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('org_id', orgId)
    }

    const session = await stripe.checkout.sessions.create({
      customer:             customerId,
      mode:                 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price:    priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/settings/billing?success=true`,
      cancel_url:  `${appUrl}/dashboard/settings/billing?canceled=true`,
      metadata: {
        org_id:  orgId,
        user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          org_id:  orgId,
          user_id: user.id,
        },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout] error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
