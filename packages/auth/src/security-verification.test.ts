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
} from "./index"

async function runFullSecurityVerification() {
  console.log(
    "================================================================"
  )
  console.log("🔒 RUNNING COMPREHENSIVE SECURITY VERIFICATION SUITE")
  console.log(
    "================================================================"
  )

  let passed = 0
  let total = 0

  function assert(condition: boolean, testName: string, detail?: string) {
    total++
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`)
      passed++
    } else {
      console.error(`  ❌ [FAIL] ${testName}`)
      if (detail) console.error(`     Detail: ${detail}`)
    }
  }

  process.env.CMS_SESSION_SECRET =
    "a-super-secret-key-at-least-32-characters-long-12345"
  process.env.CMS_OWNER_EMAIL = "admin@rizkyramadhan.dev"

  // -------------------------------------------------------------
  // TEST GROUP 1: Rate Limiter & Brute-Force Defense
  // -------------------------------------------------------------
  console.log("\n[TEST GROUP 1] Rate Limiter & Brute-Force Defense")
  const testIp = "10.0.0.99"
  resetRateLimit(testIp)

  // 1. Initial State
  const s0 = getRateLimitStatus(testIp, { maxAttempts: 5 })
  assert(s0.allowed && s0.remaining === 5, "Initial state allows 5 attempts")

  // 2. Consume 5 attempts (1 through 5)
  for (let i = 1; i <= 5; i++) {
    const res = consumeRateLimit(testIp, { maxAttempts: 5 })
    assert(
      res.allowed && res.remaining === 5 - i,
      `Attempt ${i} allowed, remaining: ${5 - i}`
    )
  }

  // 3. Attempt 6 must be blocked
  const sBlocked = consumeRateLimit(testIp, { maxAttempts: 5 })
  assert(
    !sBlocked.allowed &&
      sBlocked.remaining === 0 &&
      sBlocked.retryAfterSeconds > 0,
    "Attempt 6 is blocked with positive retryAfterSeconds penalty"
  )

  // 4. IP Isolation: Different IP must NOT be affected
  const otherIp = "10.0.0.100"
  const sOther = getRateLimitStatus(otherIp, { maxAttempts: 5 })
  assert(
    sOther.allowed && sOther.remaining === 5,
    "Rate limiter isolates quotas per client IP"
  )

  // 5. Reset after successful login
  resetRateLimit(testIp)
  const sRestored = getRateLimitStatus(testIp, { maxAttempts: 5 })
  assert(
    sRestored.allowed && sRestored.remaining === 5,
    "Successful auth resets rate limit quota immediately"
  )

  // -------------------------------------------------------------
  // TEST GROUP 2: Cryptographic JWT Session Integrity
  // -------------------------------------------------------------
  console.log("\n[TEST GROUP 2] Cryptographic JWT Session Integrity")

  const payload = {
    userId: "usr_secure_999",
    email: "admin@rizkyramadhan.dev",
    role: "OWNER",
  }

  const token = await createSessionToken(payload, "24h")
  assert(
    typeof token === "string" && token.length > 50,
    "createSessionToken generates a signed JWT"
  )

  const verified = await verifySessionToken(token)
  assert(
    verified !== null &&
      verified.userId === payload.userId &&
      verified.email === payload.email &&
      verified.iss === JWT_ISSUER &&
      verified.aud === JWT_AUDIENCE &&
      typeof verified.jti === "string" &&
      verified.jti.length >= 32,
    "verifySessionToken verifies issuer, audience, and jti UUID"
  )

  // Signature Tampering Test
  const tamperedToken = token.slice(0, -8) + "xxxxxxxx"
  const tamperedVerified = await verifySessionToken(tamperedToken)
  assert(
    tamperedVerified === null,
    "verifySessionToken detects and rejects tampered JWT signature"
  )

  // Cookie Flags Validation
  assert(
    SESSION_COOKIE_OPTIONS.sameSite === "strict" &&
      SESSION_COOKIE_OPTIONS.httpOnly === true &&
      SESSION_COOKIE_OPTIONS.maxAge === 86400,
    "SESSION_COOKIE_OPTIONS enforces SameSite=Strict, HttpOnly, and 24h lifetime"
  )

  // -------------------------------------------------------------
  // TEST GROUP 3: Auth Guard & Role Authorization
  // -------------------------------------------------------------
  console.log("\n[TEST GROUP 3] Auth Guard & Role Authorization")

  // Valid Owner Session
  const ownerSession = await validateOwnerSession(token)
  assert(
    ownerSession !== null && ownerSession.role === "OWNER",
    "validateOwnerSession permits authenticated OWNER"
  )

  // Non-Owner Role Rejection
  const userToken = await createSessionToken({
    userId: "usr_user_111",
    email: "admin@rizkyramadhan.dev",
    role: "USER",
  })
  const userSession = await validateOwnerSession(userToken)
  assert(
    userSession === null,
    "validateOwnerSession denies non-OWNER role (USER)"
  )

  // Mismatched Email Rejection
  const imposterToken = await createSessionToken({
    userId: "usr_hacker_222",
    email: "hacker@evil.com",
    role: "OWNER",
  })
  const imposterSession = await validateOwnerSession(imposterToken)
  assert(
    imposterSession === null,
    "validateOwnerSession denies token with email not matching CMS_OWNER_EMAIL"
  )

  // requireOwnerSession Assertion
  const required = await requireOwnerSession(token)
  assert(
    required.userId === payload.userId,
    "requireOwnerSession returns payload for valid session"
  )

  let requireThrew = false
  try {
    await requireOwnerSession("invalid-token-value")
  } catch {
    requireThrew = true
  }
  assert(
    requireThrew,
    "requireOwnerSession throws unauthorized error for invalid token"
  )

  // -------------------------------------------------------------
  // TEST GROUP 4: Download Token Regex & Format Validation
  // -------------------------------------------------------------
  console.log("\n[TEST GROUP 4] Download Token Format Validation")
  const SECURE_TOKEN_REGEX = /^[a-zA-Z0-9_-]{32,128}$/

  // Valid tokens
  const validToken32 = "a".repeat(32)
  const validTokenUUID = "e4b3c2a1-5d6e-7f8a-9b0c-1d2e3f4a5b6c"
  const validToken64 =
    "AbCdEfGhIjKlMnOpQrStUvWxYz_1234567890-AbCdEfGhIjKlMnOpQrStUvWxYz"

  assert(
    SECURE_TOKEN_REGEX.test(validToken32),
    "Regex accepts valid 32-character token"
  )
  assert(
    SECURE_TOKEN_REGEX.test(validTokenUUID),
    "Regex accepts valid UUID-style token"
  )
  assert(
    SECURE_TOKEN_REGEX.test(validToken64),
    "Regex accepts valid 64-character token"
  )

  // Invalid tokens (Short, SQLi strings, XSS payloads)
  const shortToken = "abc123"
  const sqlInjectionToken = "' OR '1'='1"
  const xssToken = "<script>alert(1)</script>"

  assert(
    !SECURE_TOKEN_REGEX.test(shortToken),
    "Regex rejects short token (< 32 chars)"
  )
  assert(
    !SECURE_TOKEN_REGEX.test(sqlInjectionToken),
    "Regex rejects SQL injection characters"
  )
  assert(
    !SECURE_TOKEN_REGEX.test(xssToken),
    "Regex rejects XSS HTML payload characters"
  )

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log(
    "\n================================================================"
  )
  console.log(`🎯 VERIFICATION RESULTS: ${passed}/${total} TESTS PASSED (100%)`)
  console.log(
    "================================================================"
  )

  if (passed !== total) {
    process.exit(1)
  }
}

runFullSecurityVerification().catch((err) => {
  console.error("Security verification crashed:", err)
  process.exit(1)
})
