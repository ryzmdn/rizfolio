import { describe, it, expect } from "vitest"
import crypto from "crypto"
import {
  verifyStripeSignature,
  constantTimeCompare,
  generateDownloadToken,
} from "../lib/security/commerce"
import { RATE_LIMIT_TIERS } from "../lib/security/rate-limit"

describe("Stripe Webhook Signature & Replay Attack Defense", () => {
  const secret = "whsec_test_secret_for_security_suite"
  const rawBody = JSON.stringify({
    id: "evt_123456789",
    type: "checkout.session.completed",
  })

  function generateValidHeader(body: string, timestamp: number, webhookSecret: string): string {
    const payload = `${timestamp}.${body}`
    const sig = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex")
    return `t=${timestamp},v1=${sig}`
  }

  it("should accept valid signature within timestamp tolerance", () => {
    const currentSec = Math.floor(Date.now() / 1000)
    const header = generateValidHeader(rawBody, currentSec, secret)
    const isValid = verifyStripeSignature(rawBody, header, secret)
    expect(isValid).toBe(true)
  })

  it("should reject expired timestamp older than 300 seconds", () => {
    const expiredSec = Math.floor(Date.now() / 1000) - 301
    const header = generateValidHeader(rawBody, expiredSec, secret)
    const isValid = verifyStripeSignature(rawBody, header, secret)
    expect(isValid).toBe(false)
  })

  it("should reject signature generated with wrong secret", () => {
    const currentSec = Math.floor(Date.now() / 1000)
    const header = generateValidHeader(rawBody, currentSec, "wrong_secret")
    const isValid = verifyStripeSignature(rawBody, header, secret)
    expect(isValid).toBe(false)
  })

  it("should reject tampered payload body", () => {
    const currentSec = Math.floor(Date.now() / 1000)
    const header = generateValidHeader(rawBody, currentSec, secret)
    const tamperedBody = rawBody.replace("completed", "failed")
    const isValid = verifyStripeSignature(tamperedBody, header, secret)
    expect(isValid).toBe(false)
  })

  it("should reject empty or missing signature header", () => {
    expect(verifyStripeSignature(rawBody, null, secret)).toBe(false)
    expect(verifyStripeSignature(rawBody, "", secret)).toBe(false)
  })
})

describe("Secure Download Token Provisioning", () => {
  it("should generate 64-character hex tokens with 7-day expiration", () => {
    const tokenInfo = generateDownloadToken(7)
    expect(typeof tokenInfo.token).toBe("string")
    expect(tokenInfo.token.length).toBe(64)
    expect(/^[a-f0-9]{64}$/.test(tokenInfo.token)).toBe(true)

    const expectedMinMs = Date.now() + 6.9 * 24 * 60 * 60 * 1000
    const expectedMaxMs = Date.now() + 7.1 * 24 * 60 * 60 * 1000
    expect(tokenInfo.expiresAt.getTime()).toBeGreaterThan(expectedMinMs)
    expect(tokenInfo.expiresAt.getTime()).toBeLessThan(expectedMaxMs)
  })
})

describe("Coupon Validation & Constant-Time Comparison", () => {
  it("should return true for matching coupon codes", () => {
    expect(constantTimeCompare("SAVE20", "SAVE20")).toBe(true)
    expect(constantTimeCompare("SUMMER2026", "SUMMER2026")).toBe(true)
  })

  it("should return false for mismatched coupon codes", () => {
    expect(constantTimeCompare("SAVE20", "SAVE30")).toBe(false)
    expect(constantTimeCompare("SAVE20", "SAVE200")).toBe(false)
    expect(constantTimeCompare("SHORT", "LONGER_CODE")).toBe(false)
  })
})

describe("API Gateway Rate Limit Tiers", () => {
  it("should configure appropriate rate limit quotas", () => {
    expect(RATE_LIMIT_TIERS.PUBLIC_READ.maxAttempts).toBe(120)
    expect(RATE_LIMIT_TIERS.PUBLIC_MUTATION.maxAttempts).toBe(20)
    expect(RATE_LIMIT_TIERS.AUTH_SENSITIVE.maxAttempts).toBe(5)
    expect(RATE_LIMIT_TIERS.ADMIN.maxAttempts).toBe(300)
  })
})
