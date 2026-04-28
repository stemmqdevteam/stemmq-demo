'use client'

import { useCallback } from 'react'
import { useAuthStore, useOrgStore } from '@/store'

export function useAuth() {
  const store    = useAuthStore()
  const resetOrg = useOrgStore((s) => s.reset)

  const signOut = useCallback(() => {
    // Clear stores immediately so UI updates
    store.reset()
    resetOrg()
    // Use server route — properly clears the HttpOnly session cookie
    window.location.href = '/signout'
  }, [store, resetOrg])

  return {
    user:          store.user,
    profile:       store.profile,
    isLoading:     store.isLoading,
    isInitialised: store.isInitialised,
    signOut,
  }
}
