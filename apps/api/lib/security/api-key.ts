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

  const rotationKeys = (process.env.API_ROTATION_KEYS || "")
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length >= 16)

  for (const rotKey of rotationKeys) {
    if (constantTimeEqual(cleanProvidedKey, rotKey)) {
      return {
        valid: true,
        name: "ROTATION_MASTER_KEY",
        scopes: ["*"],
      }
    }
  }

  const serviceEntries = (process.env.API_SERVICE_KEYS || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.includes(":"))

  for (const entry of serviceEntries) {
    const colonIdx = entry.indexOf(":")
    const service = entry.substring(0, colonIdx).trim().toLowerCase()
    const key = entry.substring(colonIdx + 1).trim()

    if (key.length >= 16 && constantTimeEqual(cleanProvidedKey, key)) {
      return {
        valid: true,
        name: `${service.toUpperCase()}_SERVICE_KEY`,
        scopes: [service, "read", "write"],
      }
    }
  }

  const revalidationToken = process.env.REVALIDATION_SECRET_TOKEN?.trim()
  if (
    revalidationToken &&
    revalidationToken.length >= 16 &&
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

export function hasApiKeyScope(
  verification: ApiKeyVerificationResult,
  requiredScope: string
): boolean {
  if (!verification.valid) return false
  if (verification.scopes.includes("*")) return true
  return verification.scopes.includes(requiredScope)
}
