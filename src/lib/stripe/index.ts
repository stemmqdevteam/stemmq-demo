import Stripe from 'stripe'

/**
 * Server-only Stripe client.
 * Never import this in client components.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript:  true,
})

/**
 * Stripe Price IDs — set these in your .env.local
 * Create prices in Stripe Dashboard → Products
 *
 * Naming convention:
 *   STRIPE_PRICE_PRO_MONTHLY  — $29/user/month
 *   STRIPE_PRICE_PRO_YEARLY   — $290/user/year (2 months free)
 *   STRIPE_PRICE_ENT_MONTHLY  — custom / contact sales
 */
export const STRIPE_PRICES = {
  pro_monthly:  process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
  pro_yearly:   process.env.STRIPE_PRICE_PRO_YEARLY  ?? '',
} as const

/** Map Stripe price ID → our plan type */
export function getPlanFromPriceId(priceId: string): 'pro' | 'enterprise' | null {
  if (priceId === STRIPE_PRICES.pro_monthly) return 'pro'
  if (priceId === STRIPE_PRICES.pro_yearly)  return 'pro'
  return null
}

/** Map our plan → Stripe price ID */
export function getPriceIdForPlan(
  plan: 'pro',
  interval: 'monthly' | 'yearly' = 'monthly'
): string {
  if (plan === 'pro') {
    return interval === 'yearly' ? STRIPE_PRICES.pro_yearly : STRIPE_PRICES.pro_monthly
  }
  return STRIPE_PRICES.pro_monthly
}
