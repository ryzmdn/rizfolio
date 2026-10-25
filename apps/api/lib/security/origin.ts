import type { NextRequest } from "next/server"
import { isAllowedOrigin } from "./cors"

export interface MutationOriginVerificationResult {
  allowed: boolean
  reason?: string
}

export function verifyMutationOrigin(
  request: NextRequest | Request
): MutationOriginVerificationResult {
  const method = request.method?.toUpperCase()
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return { allowed: true }
  }

  const apiKey =
    request.headers.get("x-api-key") ||
    (() => {
      const auth = request.headers.get("authorization")
      if (auth?.startsWith("ApiKey ")) {
        return auth.substring(7).trim()
      }
      return null
    })()

  if (apiKey) {
    return { allowed: true }
  }

  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return { allowed: true }
  }

  const origin = request.headers.get("origin")
  if (origin) {
    if (isAllowedOrigin(origin)) {
      return { allowed: true }
    }
    return {
      allowed: false,
      reason: "Forbidden: Origin not permitted for mutating requests.",
    }
  }

  const referer = request.headers.get("referer")
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin
      if (isAllowedOrigin(refererOrigin)) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: "Forbidden: Referer origin not permitted for mutating requests.",
      }
    } catch {
      return {
        allowed: false,
        reason: "Forbidden: Malformed Referer header.",
      }
    }
  }

  const customHeader =
    request.headers.get("x-requested-with") ||
    request.headers.get("x-csrf-token") ||
    request.headers.get("x-api-version")

  if (customHeader) {
    return { allowed: true }
  }

  if (process.env.NODE_ENV !== "production") {
    return { allowed: true }
  }

  return {
    allowed: false,
    reason:
      "Forbidden: Mutating requests must provide a verified Origin, Referer, or Authorization header.",
  }
}
