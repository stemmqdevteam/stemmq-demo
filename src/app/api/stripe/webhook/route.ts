import { NextResponse } from 'next/server'
import { stripe, getPlanFromPriceId } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { pushNotification } from '@/lib/notifications'
import type Stripe from 'stripe'

/**
 * POST /api/stripe/webhook
 *
 * Stripe calls this endpoint whenever something happens to a subscription.
 * We update our DB to reflect the current state.
 *
 * IMPORTANT: Add this URL to your Stripe Dashboard → Webhooks:
 *   https://yourdomain.com/api/stripe/webhook
 *
 * Events we handle:
 *   checkout.session.completed     → payment succeeded, activate plan
 *   customer.subscription.updated  → plan changed or renewed
 *   customer.subscription.deleted  → subscription cancelled, downgrade to free
 *   invoice.payment_failed         → payment failed, notify user
 */

// Tell Next.js not to parse the body — Stripe needs raw bytes for signature verification
export const config = { api: { bodyParser: false } }

async function getOrgIdFromCustomer(
  admin: ReturnType<typeof createAdminClient>,
  customerId: string
): Promise<string | null> {
  const { data } = await admin
    .from('subscriptions')
    .select('org_id')
    .eq('stripe_customer_id', customerId)
    .single()
  return data?.org_id ?? null
}

export async function POST(request: Request) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  try {
    switch (event.type) {

      // ── Payment succeeded → activate plan ─────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.CheckoutSession
        if (session.mode !== 'subscription') break

        const orgId  = session.metadata?.org_id
        const userId = session.metadata?.user_id

        if (!orgId) {
          console.error('[webhook] checkout.session.completed: no org_id in metadata')
          break
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )
        const priceId = subscription.items.data[0]?.price.id
        const plan    = getPlanFromPriceId(priceId) ?? 'pro'

        await admin.from('subscriptions').update({
          plan,
          status:                     subscription.status,
          stripe_customer_id:         session.customer as string,
          stripe_subscription_id:     subscription.id,
          stripe_price_id:            priceId,
          current_period_start:       new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end:         new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end:       subscription.cancel_at_period_end,
        }).eq('org_id', orgId)

        await admin.from('organizations').update({ plan }).eq('id', orgId)

        // Notify the user
        if (userId) {
          await pushNotification({
            userId,
            orgId,
            type:        'success',
            source:      'billing',
            title:       `🎉 Welcome to StemmQ ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`,
            body:        'Your plan has been upgraded. All Pro features are now unlocked.',
            actionUrl:   '/dashboard',
            actionLabel: 'Go to dashboard',
          })
        }

        console.log(`[webhook] Upgraded org ${orgId} to ${plan}`)
        break
      }

      // ── Subscription updated (renewal, plan change) ────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId   = subscription.customer as string
        const orgId        = await getOrgIdFromCustomer(admin, customerId)

        if (!orgId) break

        const priceId = subscription.items.data[0]?.price.id
        const plan    = getPlanFromPriceId(priceId) ?? 'pro'

        await admin.from('subscriptions').update({
          plan,
          status:                 subscription.status,
          stripe_price_id:        priceId,
          current_period_start:   new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end:     new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end:   subscription.cancel_at_period_end,
        }).eq('org_id', orgId)

        await admin.from('organizations').update({ plan }).eq('id', orgId)

        console.log(`[webhook] Updated subscription for org ${orgId}: ${plan}, status: ${subscription.status}`)
        break
      }

      // ── Subscription cancelled → downgrade to free ─────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId   = subscription.customer as string
        const orgId        = await getOrgIdFromCustomer(admin, customerId)

        if (!orgId) break

        await admin.from('subscriptions').update({
          plan:                   'free',
          status:                 'canceled',
          stripe_subscription_id: null,
          stripe_price_id:        null,
          current_period_end:     null,
          cancel_at_period_end:   false,
        }).eq('org_id', orgId)

        await admin.from('organizations').update({ plan: 'free' }).eq('id', orgId)

        // Find org owner to notify
        const { data: owner } = await admin
          .from('org_members')
          .select('user_id')
          .eq('org_id', orgId)
          .eq('role', 'owner')
          .single()

        if (owner) {
          await pushNotification({
            userId:      owner.user_id,
            orgId,
            type:        'warning',
            source:      'billing',
            title:       'Subscription cancelled — downgraded to Free',
            body:        'Your workspace has been moved to the Free plan. Upgrade any time to restore Pro features.',
            actionUrl:   '/dashboard/settings/billing',
            actionLabel: 'Resubscribe',
          })
        }

        console.log(`[webhook] Cancelled subscription for org ${orgId}`)
        break
      }

      // ── Payment failed ─────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice    = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const orgId      = await getOrgIdFromCustomer(admin, customerId)

        if (!orgId) break

        await admin.from('subscriptions')
          .update({ status: 'past_due' })
          .eq('org_id', orgId)

        const { data: owner } = await admin
          .from('org_members')
          .select('user_id')
          .eq('org_id', orgId)
          .eq('role', 'owner')
          .single()

        if (owner) {
          await pushNotification({
            userId:      owner.user_id,
            orgId,
            type:        'error',
            source:      'billing',
            title:       '⚠️ Payment failed',
            body:        'We could not charge your payment method. Please update your billing details to keep your Pro features.',
            actionUrl:   '/dashboard/settings/billing',
            actionLabel: 'Update payment',
          })
        }

        console.log(`[webhook] Payment failed for org ${orgId}`)
        break
      }

      default:
        console.log(`[webhook] Unhandled event: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[stripe/webhook] handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
