import crypto from "crypto"

export interface ApiKeyVerificationResult {
  valid: boolean
  name?: string
  scopes: string[]
}

function constantTimeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)

  if (bufferA.length !== bufferB.length) {
    // Constant time dummy comparison to avoid length leak timing differences
    crypto.timingSafeEqual(bufferA, bufferA)
    return false
  }

  return crypto.timingSafeEqual(bufferA, bufferB)
}

export function verifyApiKey(
  providedKey: string | null | undefined
): ApiKeyVerificationResult {
  if (
    !providedKey ||
    typeof providedKey !== "string" ||
    providedKey.trim() === ""
  ) {
    return { valid: false, scopes: [] }
  }

  const cleanProvidedKey = providedKey.trim()
  const masterKey = process.env.API_MASTER_KEY?.trim()

  if (masterKey && masterKey.length >= 16) {
    if (constantTimeEqual(cleanProvidedKey, masterKey)) {
      return {
        valid: true,
        name: "MASTER_SERVICE_KEY",
        scopes: ["*"],
      }
    }
  }

  // Also check if provided key matches REVALIDATION_SECRET_TOKEN for ISR revalidation
  const revalidationToken = process.env.REVALIDATION_SECRET_TOKEN?.trim()
  if (
    revalidationToken &&
    constantTimeEqual(cleanProvidedKey, revalidationToken)
  ) {
    return {
      valid: true,
      name: "REVALIDATION_KEY",
      scopes: ["revalidate"],
    }
  }

  return { valid: false, scopes: [] }
}
