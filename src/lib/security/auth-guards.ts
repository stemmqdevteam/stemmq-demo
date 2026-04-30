import { NextResponse } from 'next/server'
import { rateLimit, getClientIP } from './rate-limit'

/**
 * Apply rate limiting to an auth endpoint.
 * Returns a 429 response if the limit is exceeded, null otherwise.
 *
 * Limits (conservative for auth — these are sensitive endpoints):
 *   magic-link:  5 requests per 60 seconds per IP
 *   oauth:       10 requests per 60 seconds per IP
 *   callback:    20 requests per 60 seconds per IP (Google redirects fast)
 */
export function checkAuthRateLimit(
  type: 'magic-link' | 'oauth' | 'callback' | 'api',
  request: Request
): NextResponse | null {
  const ip = getClientIP(request)

  type LimitType = 'magic-link' | 'oauth' | 'callback' | 'api'

  const limits: Record<LimitType, { max: number; windowMs: number }> = {
    'magic-link': { max: 5, windowMs: 60_000 },
    'oauth': { max: 10, windowMs: 60_000 },
    'callback': { max: 20, windowMs: 60_000 },
    'api': { max: 60, windowMs: 60_000 },
  }

  const config = limits[type] 
  // ?? limits.api  --- IGNORE ---
  const result = rateLimit(type, ip, config)

  if (!result.success) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000)
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please wait before trying again.', retryAfter }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(result.resetTime),
        },
      }
    )
  }

  return null  // no limit hit — allow request
}

/**
 * Validate that the redirect URL is safe (prevents open redirect attacks).
 * Only allows relative paths on the same origin.
 */
export function sanitizeRedirect(redirect: string | null, fallback = '/dashboard'): string {
  if (!redirect) return fallback
  // Must start with / and not be a protocol-relative URL (//)
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return fallback
  // Must not contain protocol characters
  if (/[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]/.test(redirect)) return fallback
  return redirect
}

/**
 * Validate email domain to block disposable email providers.
 * Add more domains as needed.
 */
const BLOCKED_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'temp-mail.org', 'throwaway.email',
  'yopmail.com', 'trashmail.com', '10minutemail.com', 'fakeinbox.com',
]

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return true
  return BLOCKED_DOMAINS.includes(domain)
}
