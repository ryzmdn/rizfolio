export interface RateLimitOptions {
  maxAttempts?: number
  windowMs?: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfterSeconds: number
  totalAttempts: number
}

interface RateLimitRecord {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

const DEFAULT_MAX_ATTEMPTS = 5
const DEFAULT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function cleanupExpiredRecords(now: number): void {
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key)
    }
  }
}

export function getRateLimitStatus(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const now = Date.now()
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS

  cleanupExpiredRecords(now)

  const record = rateLimitStore.get(identifier)

  if (!record || record.resetAt <= now) {
    return {
      allowed: true,
      remaining: maxAttempts,
      resetAt: now + windowMs,
      retryAfterSeconds: 0,
      totalAttempts: 0,
    }
  }

  const allowed = record.count < maxAttempts
  const remaining = Math.max(0, maxAttempts - record.count)
  const retryAfterSeconds = allowed
    ? 0
    : Math.max(1, Math.ceil((record.resetAt - now) / 1000))

  return {
    allowed,
    remaining,
    resetAt: record.resetAt,
    retryAfterSeconds,
    totalAttempts: record.count,
  }
}

export function consumeRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const now = Date.now()
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS

  cleanupExpiredRecords(now)

  let record = rateLimitStore.get(identifier)

  if (!record || record.resetAt <= now) {
    record = {
      count: 1,
      resetAt: now + windowMs,
    }
    rateLimitStore.set(identifier, record)
  } else {
    record.count += 1
  }

  const allowed = record.count <= maxAttempts
  const remaining = Math.max(0, maxAttempts - record.count)
  const retryAfterSeconds = allowed
    ? 0
    : Math.max(1, Math.ceil((record.resetAt - now) / 1000))

  return {
    allowed,
    remaining,
    resetAt: record.resetAt,
    retryAfterSeconds,
    totalAttempts: record.count,
  }
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  return getRateLimitStatus(identifier, options)
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}
