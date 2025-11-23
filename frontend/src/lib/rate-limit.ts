import { NextRequest } from 'next/server'

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry>
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.limits = new Map()
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetAt < now) {
        this.limits.delete(key)
      }
    }
  }

  /**
   * Check if request is allowed under rate limit
   * @param identifier - Unique identifier (usually IP address)
   * @param limit - Maximum requests allowed in window
   * @param windowMs - Time window in milliseconds
   * @returns Object with allowed status and remaining requests
   */
  check(
    identifier: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || entry.resetAt < now) {
      // First request or expired window - create new entry
      const resetAt = now + windowMs
      this.limits.set(identifier, { count: 1, resetAt })
      return { allowed: true, remaining: limit - 1, resetAt }
    }

    if (entry.count >= limit) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetAt: entry.resetAt }
    }

    // Increment count
    entry.count++
    this.limits.set(identifier, entry)
    return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt }
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string): void {
    this.limits.delete(identifier)
  }

  /**
   * Clear all rate limits
   */
  clear(): void {
    this.limits.clear()
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter()

/**
 * Extract identifier from request (IP address or fallback)
 */
export function getIdentifier(req: NextRequest): string {
  // Try to get real IP from various headers (reverse proxy, cloudflare, etc.)
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfConnectingIp = req.headers.get('cf-connecting-ip')

  if (cfConnectingIp) return cfConnectingIp
  if (realIp) return realIp
  if (forwarded) {
    // x-forwarded-for can be comma-separated list, take first IP
    return forwarded.split(',')[0].trim()
  }

  // Fallback to a generic identifier
  return 'unknown'
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Contact form: 5 submissions per hour per IP
  contact: {
    limit: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // Profile updates: 20 updates per hour per user
  profile: {
    limit: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // General API: 100 requests per 15 minutes
  general: {
    limit: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
} as const

/**
 * Apply rate limiting to a request
 * @param req - Next.js request object
 * @param config - Rate limit configuration
 * @returns Object with allowed status and headers to send
 */
export function applyRateLimit(
  req: NextRequest,
  config: { limit: number; windowMs: number }
): {
  allowed: boolean
  headers: Record<string, string>
  message?: string
} {
  const identifier = getIdentifier(req)
  const { allowed, remaining, resetAt } = rateLimiter.check(
    identifier,
    config.limit,
    config.windowMs
  )

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': config.limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetAt).toISOString(),
  }

  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
    headers['Retry-After'] = retryAfter.toString()

    return {
      allowed: false,
      headers,
      message: `Rate limit exceeded. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
    }
  }

  return { allowed: true, headers }
}

export { rateLimiter }
