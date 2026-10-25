import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import type { NextRequest } from "next/server"

export type RateLimitTier =
  | "PUBLIC_READ"
  | "PUBLIC_MUTATION"
  | "AUTH_SENSITIVE"
  | "ADMIN"
  | "NONE"

export interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
}

export const RATE_LIMIT_TIERS: Record<
  Exclude<RateLimitTier, "NONE">,
  RateLimitConfig
> = {
  PUBLIC_READ: {
    maxAttempts: 120,
    windowMs: 60 * 1000,
  },
  PUBLIC_MUTATION: {
    maxAttempts: 20,
    windowMs: 60 * 1000,
  },
  AUTH_SENSITIVE: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
  },
  ADMIN: {
    maxAttempts: 300,
    windowMs: 60 * 1000,
  },
}

interface RateLimitRecord {
  count: number
  resetAt: number
}

const memoryStore = new Map<string, RateLimitRecord>()

function cleanupExpired(now: number): void {
  if (memoryStore.size > 10000) {
    for (const [key, record] of memoryStore.entries()) {
      if (record.resetAt <= now) {
        memoryStore.delete(key)
      }
    }
  }
}

export function extractClientIp(request: NextRequest | Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim()
    if (firstIp) return firstIp
  }

  const realIp = request.headers.get("x-real-ip")?.trim()
  if (realIp) return realIp

  const cfConnectingIp = request.headers.get("cf-connecting-ip")?.trim()
  if (cfConnectingIp) return cfConnectingIp

  return "127.0.0.1"
}

export interface RateLimitCheckResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfterSeconds: number
  limit: number
  headers: Record<string, string>
}

let redisInstance: Redis | null | undefined

function getRedisInstance(): Redis | null {
  if (redisInstance !== undefined) {
    return redisInstance
  }
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    redisInstance = null
    return null
  }
  try {
    redisInstance = new Redis({ url, token })
    return redisInstance
  } catch {
    redisInstance = null
    return null
  }
}

const upstashLimiters = new Map<string, Ratelimit>()

function getUpstashLimiter(
  tier: Exclude<RateLimitTier, "NONE">
): Ratelimit | null {
  const redis = getRedisInstance()
  if (!redis) return null

  let limiter = upstashLimiters.get(tier)
  if (!limiter) {
    const config = RATE_LIMIT_TIERS[tier]
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        config.maxAttempts,
        `${config.windowMs} ms`
      ),
      analytics: true,
      prefix: `rizfolio:api:ratelimit:${tier.toLowerCase()}`,
    })
    upstashLimiters.set(tier, limiter)
  }
  return limiter
}

export function evaluateRateLimitMemory(
  key: string,
  config: RateLimitConfig
): RateLimitCheckResult {
  const now = Date.now()
  cleanupExpired(now)

  let record = memoryStore.get(key)

  if (!record || record.resetAt <= now) {
    record = {
      count: 1,
      resetAt: now + config.windowMs,
    }
    memoryStore.set(key, record)
  } else {
    record.count += 1
  }

  const allowed = record.count <= config.maxAttempts
  const remaining = Math.max(0, config.maxAttempts - record.count)
  const retryAfterSeconds = allowed
    ? 0
    : Math.max(1, Math.ceil((record.resetAt - now) / 1000))

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(config.maxAttempts),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(record.resetAt / 1000)),
  }

  if (!allowed) {
    headers["Retry-After"] = String(retryAfterSeconds)
  }

  return {
    allowed,
    remaining,
    resetAt: record.resetAt,
    retryAfterSeconds,
    limit: config.maxAttempts,
    headers,
  }
}

export function evaluateRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitCheckResult {
  return evaluateRateLimitMemory(key, config)
}

export async function checkRateLimitAsync(
  request: NextRequest | Request,
  tier: RateLimitTier = "PUBLIC_READ",
  customIdentifier?: string
): Promise<RateLimitCheckResult> {
  if (tier === "NONE") {
    return {
      allowed: true,
      remaining: 999999,
      resetAt: Date.now() + 60000,
      retryAfterSeconds: 0,
      limit: 999999,
      headers: {},
    }
  }

  const clientIp = extractClientIp(request)
  const identifier = customIdentifier || clientIp
  const rateLimitKey = `${tier}:${identifier}`
  const config = RATE_LIMIT_TIERS[tier]

  const limiter = getUpstashLimiter(tier)
  if (limiter) {
    try {
      const res = await limiter.limit(identifier)
      const now = Date.now()
      const retryAfterSeconds = res.success
        ? 0
        : Math.max(1, Math.ceil((res.reset - now) / 1000))

      const headers: Record<string, string> = {
        "X-RateLimit-Limit": String(res.limit),
        "X-RateLimit-Remaining": String(Math.max(0, res.remaining)),
        "X-RateLimit-Reset": String(Math.ceil(res.reset / 1000)),
      }

      if (!res.success) {
        headers["Retry-After"] = String(retryAfterSeconds)
      }

      return {
        allowed: res.success,
        remaining: Math.max(0, res.remaining),
        resetAt: res.reset,
        retryAfterSeconds,
        limit: res.limit,
        headers,
      }
    } catch {
      return evaluateRateLimitMemory(rateLimitKey, config)
    }
  }

  return evaluateRateLimitMemory(rateLimitKey, config)
}

function createHybridCheckResult(
  syncResult: RateLimitCheckResult,
  asyncPromise: Promise<RateLimitCheckResult>
): RateLimitCheckResult & Promise<RateLimitCheckResult> {
  const p = asyncPromise as unknown as RateLimitCheckResult &
    Promise<RateLimitCheckResult>
  p.allowed = syncResult.allowed
  p.remaining = syncResult.remaining
  p.resetAt = syncResult.resetAt
  p.retryAfterSeconds = syncResult.retryAfterSeconds
  p.limit = syncResult.limit
  p.headers = syncResult.headers
  return p
}

export function checkRateLimit(
  request: NextRequest | Request,
  tier: RateLimitTier = "PUBLIC_READ",
  customIdentifier?: string
): RateLimitCheckResult & Promise<RateLimitCheckResult> {
  if (tier === "NONE") {
    const noneResult: RateLimitCheckResult = {
      allowed: true,
      remaining: 999999,
      resetAt: Date.now() + 60000,
      retryAfterSeconds: 0,
      limit: 999999,
      headers: {},
    }
    return createHybridCheckResult(noneResult, Promise.resolve(noneResult))
  }

  const clientIp = extractClientIp(request)
  const identifier = customIdentifier || clientIp
  const rateLimitKey = `${tier}:${identifier}`
  const config = RATE_LIMIT_TIERS[tier]

  const syncResult = evaluateRateLimitMemory(rateLimitKey, config)
  const redis = getRedisInstance()
  const asyncPromise = redis
    ? checkRateLimitAsync(request, tier, customIdentifier)
    : Promise.resolve(syncResult)

  return createHybridCheckResult(syncResult, asyncPromise)
}

export async function resetRateLimitKey(key: string): Promise<void> {
  memoryStore.delete(key)
  const redis = getRedisInstance()
  if (redis) {
    try {
      const keys = await redis.keys(`rizfolio:api:ratelimit:*${key}*`)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      void error
    }
  }
}
