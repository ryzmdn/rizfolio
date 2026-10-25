import crypto from "crypto"

export interface DownloadTokenInfo {
  token: string
  expiresAt: Date
}

export function generateDownloadToken(validityDays = 7): DownloadTokenInfo {
  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000)
  return { token, expiresAt }
}

export function constantTimeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  return crypto.timingSafeEqual(bufA, bufB)
}

export function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  toleranceSeconds = 300
): boolean {
  if (!signatureHeader || !secret) return false

  const parts = signatureHeader.split(",")
  let timestamp = ""
  let signature = ""

  for (const part of parts) {
    const [key, val] = part.split("=")
    if (key === "t" && val) timestamp = val
    if (key === "v1" && val) signature = val
  }

  if (!timestamp || !signature) return false

  const timestampSec = Number(timestamp)
  if (isNaN(timestampSec)) return false

  const currentSec = Math.floor(Date.now() / 1000)
  if (Math.abs(currentSec - timestampSec) > toleranceSeconds) {
    return false
  }

  const payload = `${timestamp}.${rawBody}`
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex")

  try {
    const expectedBuf = Buffer.from(expectedSignature)
    const actualBuf = Buffer.from(signature)
    if (expectedBuf.length !== actualBuf.length) return false
    return crypto.timingSafeEqual(expectedBuf, actualBuf)
  } catch {
    return false
  }
}
