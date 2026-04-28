'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore, useOrgStore } from '@/store'
import type { UserProfile, Organization, Subscription } from '@/types'

interface Props {
  children:     React.ReactNode
  profile:      UserProfile | null
  org:          Organization | null
  subscription: Subscription | null
}

/**
 * SessionProvider — hydrates client stores from server-fetched data.
 *
 * CRITICAL: Store mutations MUST happen inside useEffect, never during render.
 * Calling setState during render triggers "Cannot update a component while
 * rendering a different component" in React 18 concurrent mode.
 *
 * We use useRef to ensure hydration only happens once even in StrictMode.
 */
export function SessionProvider({ children, profile, org, subscription }: Props) {
  const hydrated = useRef(false)

  // Run synchronously in a layout effect (before paint) to prevent flash
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true

    const authStore = useAuthStore.getState()
    const orgStore  = useOrgStore.getState()

    if (profile) {
      authStore.setProfile(profile)
      authStore.setUser({ id: profile.id, email: '' })
    }
    orgStore.setOrg(org)
    orgStore.setSubscription(subscription)
    authStore.setLoading(false)
    authStore.setInitialised(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Empty deps intentional — only hydrate once from initial server props

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) useAuthStore.getState().setUser({ id: user.id, email: user.email ?? '' })
    })

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        useAuthStore.getState().reset()
        useOrgStore.getState().reset()
      }
    })

    return () => authSub.unsubscribe()
  }, [])

  return <>{children}</>
}
