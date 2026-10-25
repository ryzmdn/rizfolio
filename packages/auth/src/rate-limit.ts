import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

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
const DEFAULT_WINDOW_MS = 15 * 60 * 1000

function cleanupExpiredRecords(now: number): void {
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key)
    }
  }
}

let redisClient: Redis | null | undefined

function getRedisClient(): Redis | null {
  if (redisClient !== undefined) {
    return redisClient
  }
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    redisClient = null
    return null
  }
  try {
    redisClient = new Redis({ url, token })
    return redisClient
  } catch {
    redisClient = null
    return null
  }
}

const upstashLimiters = new Map<string, Ratelimit>()

function getUpstashLimiter(
  maxAttempts: number,
  windowMs: number
): Ratelimit | null {
  const redis = getRedisClient()
  if (!redis) return null

  const cacheKey = `${maxAttempts}:${windowMs}`
  let limiter = upstashLimiters.get(cacheKey)
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxAttempts, `${windowMs} ms`),
      analytics: true,
      prefix: "rizfolio:auth:ratelimit",
    })
    upstashLimiters.set(cacheKey, limiter)
  }
  return limiter
}

export function getRateLimitStatusMemory(
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

export function consumeRateLimitMemory(
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

export function resetRateLimitMemory(identifier: string): void {
  rateLimitStore.delete(identifier)
}

export async function consumeRateLimitAsync(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS
  const limiter = getUpstashLimiter(maxAttempts, windowMs)

  if (!limiter) {
    return consumeRateLimitMemory(identifier, options)
  }

  try {
    const res = await limiter.limit(identifier)
    const now = Date.now()
    const retryAfterSeconds = res.success
      ? 0
      : Math.max(1, Math.ceil((res.reset - now) / 1000))

    return {
      allowed: res.success,
      remaining: Math.max(0, res.remaining),
      resetAt: res.reset,
      retryAfterSeconds,
      totalAttempts: Math.max(0, maxAttempts - res.remaining),
    }
  } catch {
    return consumeRateLimitMemory(identifier, options)
  }
}

export async function getRateLimitStatusAsync(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS
  const limiter = getUpstashLimiter(maxAttempts, windowMs)

  if (!limiter) {
    return getRateLimitStatusMemory(identifier, options)
  }

  try {
    const res = await limiter.getRemaining(identifier)
    const now = Date.now()
    const allowed = res.remaining > 0
    const retryAfterSeconds = allowed
      ? 0
      : Math.max(1, Math.ceil((res.reset - now) / 1000))

    return {
      allowed,
      remaining: Math.max(0, res.remaining),
      resetAt: res.reset,
      retryAfterSeconds,
      totalAttempts: Math.max(0, maxAttempts - res.remaining),
    }
  } catch {
    return getRateLimitStatusMemory(identifier, options)
  }
}

export async function resetRateLimitAsync(identifier: string): Promise<void> {
  resetRateLimitMemory(identifier)
  const redis = getRedisClient()
  if (redis) {
    try {
      const keys = await redis.keys(`rizfolio:auth:ratelimit:*${identifier}*`)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      void error
    }
  }
}

export function getRateLimitStatusSync(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  return getRateLimitStatusMemory(identifier, options)
}

export function consumeRateLimitSync(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  return consumeRateLimitMemory(identifier, options)
}

export function resetRateLimitSync(identifier: string): void {
  resetRateLimitMemory(identifier)
}

export function checkRateLimitSync(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  return getRateLimitStatusMemory(identifier, options)
}

function createHybridResult(
  syncResult: RateLimitResult,
  asyncPromise: Promise<RateLimitResult>
): RateLimitResult & Promise<RateLimitResult> {
  const p = asyncPromise as unknown as RateLimitResult &
    Promise<RateLimitResult>
  p.allowed = syncResult.allowed
  p.remaining = syncResult.remaining
  p.resetAt = syncResult.resetAt
  p.retryAfterSeconds = syncResult.retryAfterSeconds
  p.totalAttempts = syncResult.totalAttempts
  return p
}

export function getRateLimitStatus(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult & Promise<RateLimitResult> {
  const syncResult = getRateLimitStatusMemory(identifier, options)
  const redis = getRedisClient()
  const asyncPromise = redis
    ? getRateLimitStatusAsync(identifier, options)
    : Promise.resolve(syncResult)
  return createHybridResult(syncResult, asyncPromise)
}

export function consumeRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult & Promise<RateLimitResult> {
  const syncResult = consumeRateLimitMemory(identifier, options)
  const redis = getRedisClient()
  const asyncPromise = redis
    ? consumeRateLimitAsync(identifier, options)
    : Promise.resolve(syncResult)
  return createHybridResult(syncResult, asyncPromise)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> & RateLimitResult {
  return getRateLimitStatus(identifier, options)
}

export function resetRateLimit(identifier: string): void {
  resetRateLimitMemory(identifier)
  void resetRateLimitAsync(identifier)
}
