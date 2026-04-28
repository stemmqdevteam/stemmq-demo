/**
 * In-memory rate limiter for API routes.
 * Uses a sliding window approach.
 * For production at scale → replace with Upstash Redis.
 *
 * Usage:
 *   const result = await rateLimit('magic-link', ip, { max: 5, windowMs: 60_000 })
 *   if (!result.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
 */

interface RateLimitRecord {
  count:     number
  resetTime: number
}

// In-memory store — resets on cold start (acceptable for MVP)
// Production: swap this map for Upstash Redis
const store = new Map<string, RateLimitRecord>()

// Cleanup old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (record.resetTime < now) store.delete(key)
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  max:      number   // max requests per window
  windowMs: number   // window size in ms
}

interface RateLimitResult {
  success:    boolean
  limit:      number
  remaining:  number
  resetTime:  number
}

export function rateLimit(
  prefix:  string,
  key:     string,
  options: RateLimitOptions
): RateLimitResult {
  const id  = `${prefix}:${key}`
  const now = Date.now()

  const record = store.get(id)

  if (!record || record.resetTime < now) {
    // New window
    const newRecord: RateLimitRecord = {
      count:     1,
      resetTime: now + options.windowMs,
    }
    store.set(id, newRecord)
    return { success: true, limit: options.max, remaining: options.max - 1, resetTime: newRecord.resetTime }
  }

  if (record.count >= options.max) {
    return { success: false, limit: options.max, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return { success: true, limit: options.max, remaining: options.max - record.count, resetTime: record.resetTime }
}

/** Extract real IP from request (Vercel / Cloudflare / direct) */
export function getClientIP(request: Request): string {
  const headers = request instanceof Request ? request.headers : new Headers()
  return (
    headers.get('cf-connecting-ip')     ??  // Cloudflare
    headers.get('x-real-ip')            ??  // nginx proxy
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??  // load balancer
    'unknown'
  )
}
