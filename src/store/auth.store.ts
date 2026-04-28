import { create } from 'zustand'
import type { UserProfile } from '@/types'

interface AuthUser {
  id:    string
  email: string
}

interface AuthState {
  user:          AuthUser | null
  profile:       UserProfile | null
  isLoading:     boolean
  isInitialised: boolean
  setUser:         (user: AuthUser | null) => void
  setProfile:      (profile: UserProfile | null) => void
  setLoading:      (loading: boolean) => void
  setInitialised:  (init: boolean) => void
  reset:           () => void
}

// No localStorage persist — session comes from server cookies.
// Persisting to localStorage caused stale auth state across sign-outs.
export const useAuthStore = create<AuthState>()((set) => ({
  user:          null,
  profile:       null,
  isLoading:     true,
  isInitialised: false,
  setUser:        (user)         => set({ user }),
  setProfile:     (profile)      => set({ profile }),
  setLoading:     (isLoading)    => set({ isLoading }),
  setInitialised: (isInitialised) => set({ isInitialised }),
  reset: () => set({
    user:          null,
    profile:       null,
    isLoading:     false,
    isInitialised: false,
  }),
}))
