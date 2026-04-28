import { create } from 'zustand'
import type { Organization, Subscription, PlanType } from '@/types'
import { PLAN_FEATURES } from '@/types'

interface OrgState {
  org:          Organization | null
  subscription: Subscription | null
  setOrg:          (org: Organization | null) => void
  setSubscription: (sub: Subscription | null) => void
  updateConfig:    (patch: Partial<Organization['config']>) => void
  reset:           () => void
}

// No persist — server always injects fresh org + subscription data
// on every dashboard load via SessionProvider
export const useOrgStore = create<OrgState>()((set) => ({
  org:          null,
  subscription: null,
  setOrg:          (org)          => set({ org }),
  setSubscription: (subscription) => set({ subscription }),
  updateConfig:    (patch)        => set((s) =>
    s.org
      ? { org: { ...s.org, config: { ...s.org.config, ...patch } } }
      : {}
  ),
  reset: () => set({ org: null, subscription: null }),
}))

// ── Derived plan hook ─────────────────────────────────────
// Single source of truth: subscription.plan > org.plan > 'free'
// This means manually updating subscriptions.plan in DB takes effect
// immediately on next page load (no stale localStorage cache)
export function usePlan() {
  const { org, subscription } = useOrgStore()

  const plan: PlanType = subscription?.plan ?? org?.plan ?? 'free'
  const features = PLAN_FEATURES[plan] ?? PLAN_FEATURES.free
  const isActive = !subscription ||
    ['active', 'trialing'].includes(subscription.status)

  return {
    plan,
    features,
    isActive,
    isPro:        (plan === 'pro' || plan === 'enterprise') && isActive,
    isEnterprise: plan === 'enterprise' && isActive,
    can: (feature: keyof typeof features): boolean =>
      isActive && Boolean(features[feature]),
  }
}
