import { describe, it, expect, beforeEach } from "vitest"
import {
  createSessionToken,
  verifySessionToken,
  validateOwnerSession,
  requireOwnerSession,
  consumeRateLimit,
  getRateLimitStatus,
  resetRateLimit,
  JWT_ISSUER,
  JWT_AUDIENCE,
  SESSION_COOKIE_OPTIONS,
  hashPassword,
  comparePasswords,
} from "./index"

describe("Rate Limiter & Brute-Force Sliding Window Defense", () => {
  const testIp = "192.168.1.100"

  beforeEach(() => {
    resetRateLimit(testIp)
  })

  it("should initialize with full available attempts", () => {
    const status = getRateLimitStatus(testIp, { maxAttempts: 5 })
    expect(status.allowed).toBe(true)
    expect(status.remaining).toBe(5)
  })

  it("should decrement remaining attempts on consumption", () => {
    const first = consumeRateLimit(testIp, { maxAttempts: 5 })
    expect(first.allowed).toBe(true)
    expect(first.remaining).toBe(4)

    const second = consumeRateLimit(testIp, { maxAttempts: 5 })
    expect(second.allowed).toBe(true)
    expect(second.remaining).toBe(3)
  })

  it("should block requests when maximum attempts are exceeded", () => {
    for (let i = 0; i < 5; i++) {
      consumeRateLimit(testIp, { maxAttempts: 5 })
    }

    const blocked = consumeRateLimit(testIp, { maxAttempts: 5 })
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it("should isolate quotas per client IP identifier", () => {
    const otherIp = "192.168.1.101"
    resetRateLimit(otherIp)

    for (let i = 0; i < 5; i++) {
      consumeRateLimit(testIp, { maxAttempts: 5 })
    }

    const otherStatus = getRateLimitStatus(otherIp, { maxAttempts: 5 })
    expect(otherStatus.allowed).toBe(true)
    expect(otherStatus.remaining).toBe(5)
  })

  it("should restore quota on manual reset", () => {
    for (let i = 0; i < 5; i++) {
      consumeRateLimit(testIp, { maxAttempts: 5 })
    }

    resetRateLimit(testIp)
    const restored = getRateLimitStatus(testIp, { maxAttempts: 5 })
    expect(restored.allowed).toBe(true)
    expect(restored.remaining).toBe(5)
  })
})

describe("Password Hashing & Constant-Time Verification", () => {
  it("should produce a valid salted hash and verify correctly", async () => {
    const plaintext = "SuperSecretSecureP@ss2026!"
    const hash = await hashPassword(plaintext)

    expect(typeof hash).toBe("string")
    expect(hash).not.toBe(plaintext)
    expect(hash.startsWith("$2")).toBe(true)

    const isMatch = await comparePasswords(plaintext, hash)
    expect(isMatch).toBe(true)

    const isMismatch = await comparePasswords("WrongPassword123", hash)
    expect(isMismatch).toBe(false)
  })
})

describe("Cryptographic JWT Session Integrity", () => {
  process.env.CMS_SESSION_SECRET =
    "a-super-secret-key-at-least-32-characters-long-12345"
  process.env.CMS_OWNER_EMAIL = "admin@rizkyramadhan.dev"

  const payload = {
    userId: "usr_secure_999",
    email: "admin@rizkyramadhan.dev",
    role: "OWNER",
  }

  it("should create a signed JWT session token with issuer and audience", async () => {
    const token = await createSessionToken(payload, "24h")
    expect(typeof token).toBe("string")
    expect(token.length).toBeGreaterThan(50)

    const verified = await verifySessionToken(token)
    expect(verified).not.toBeNull()
    expect(verified?.userId).toBe(payload.userId)
    expect(verified?.email).toBe(payload.email)
    expect(verified?.iss).toBe(JWT_ISSUER)
    expect(verified?.aud).toBe(JWT_AUDIENCE)
    expect(typeof verified?.jti).toBe("string")
  })

  it("should reject tampered JWT signatures", async () => {
    const token = await createSessionToken(payload, "24h")
    const tampered = token.slice(0, -8) + "xxxxxxxx"
    const verified = await verifySessionToken(tampered)
    expect(verified).toBeNull()
  })

  it("should enforce session cookie security options", () => {
    expect(SESSION_COOKIE_OPTIONS.sameSite).toBe("lax")
    expect(SESSION_COOKIE_OPTIONS.httpOnly).toBe(true)
    expect(SESSION_COOKIE_OPTIONS.maxAge).toBe(86400)
  })

  it("should authorize owner session and reject unauthorized roles or emails", async () => {
    const ownerToken = await createSessionToken(payload, "24h")
    const ownerSession = await validateOwnerSession(ownerToken)
    expect(ownerSession).not.toBeNull()
    expect(ownerSession?.role).toBe("OWNER")

    const userToken = await createSessionToken({
      userId: "usr_regular",
      email: "admin@rizkyramadhan.dev",
      role: "USER",
    })
    const userSession = await validateOwnerSession(userToken)
    expect(userSession).toBeNull()

    const imposterToken = await createSessionToken({
      userId: "usr_hacker",
      email: "intruder@evil.com",
      role: "OWNER",
    })
    const imposterSession = await validateOwnerSession(imposterToken)
    expect(imposterSession).toBeNull()

    const required = await requireOwnerSession(ownerToken)
    expect(required.userId).toBe(payload.userId)

    await expect(requireOwnerSession("invalid-token-string")).rejects.toThrow()
  })
})

describe("Download Token Regex & Format Validation", () => {
  const SECURE_TOKEN_REGEX = /^[a-zA-Z0-9_-]{32,128}$/

  it("should validate secure tokens and reject malicious payloads", () => {
    expect(SECURE_TOKEN_REGEX.test("a".repeat(32))).toBe(true)
    expect(SECURE_TOKEN_REGEX.test("a".repeat(64))).toBe(true)
    expect(
      SECURE_TOKEN_REGEX.test("e4b3c2a1-5d6e-7f8a-9b0c-1d2e3f4a5b6c")
    ).toBe(true)

    expect(SECURE_TOKEN_REGEX.test("short")).toBe(false)
    expect(SECURE_TOKEN_REGEX.test("' OR '1'='1")).toBe(false)
    expect(SECURE_TOKEN_REGEX.test("<script>alert(1)</script>")).toBe(false)
  })
})
