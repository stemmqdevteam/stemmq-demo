import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-side Supabase client.
 * Works in Server Components, Server Actions, and Route Handlers.
 *
 * Cookie writes are wrapped in try/catch because Server Components
 * cannot set cookies — only Route Handlers and Server Actions can.
 * The try/catch is intentional; it silences the error in read-only contexts.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Silenced in Server Component context (read-only)
            // Route Handlers and Server Actions can write cookies fine
          }
        },
      },
    }
  )
}

/**
 * Service-role client — bypasses RLS.
 * Server-side ONLY. Never import in client components.
 */
export function createAdminClient() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
