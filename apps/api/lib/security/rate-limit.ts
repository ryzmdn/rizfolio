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

export const RATE_LIMIT_TIERS: Record<Exclude<RateLimitTier, "NONE">, RateLimitConfig> = {
  PUBLIC_READ: {
    maxAttempts: 120,
    windowMs: 60 * 1000, // 120 requests per minute
  },
  PUBLIC_MUTATION: {
    maxAttempts: 15,
    windowMs: 60 * 1000, // 15 write requests per minute
  },
  AUTH_SENSITIVE: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 5 attempts per 15 minutes
  },
  ADMIN: {
    maxAttempts: 300,
    windowMs: 60 * 1000, // 300 requests per minute
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

export function evaluateRateLimit(
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

export function checkRateLimit(
  request: NextRequest | Request,
  tier: RateLimitTier = "PUBLIC_READ",
  customIdentifier?: string
): RateLimitCheckResult {
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

  return evaluateRateLimit(rateLimitKey, config)
}

export function resetRateLimitKey(key: string): void {
  memoryStore.delete(key)
}
