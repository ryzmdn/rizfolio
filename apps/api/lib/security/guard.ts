import type { NextRequest } from "next/server"
import { verifySessionToken, SESSION_COOKIE_NAME } from "@workspace/auth"
import { verifyApiKey } from "./api-key"
import { extractClientIp } from "./rate-limit"
import { UnauthorizedError, ForbiddenError } from "../api/errors"
import type {
  RequestSecurityContext,
  UserRole,
  RouteSecurityOptions,
} from "../api/types"

export async function extractSecurityContext(
  request: NextRequest | Request
): Promise<RequestSecurityContext> {
  const clientIp = extractClientIp(request)
  const userAgent = request.headers.get("user-agent") || "unknown"
  const traceId = request.headers.get("x-request-id") || crypto.randomUUID()

  // 1. Check API Key header
  const apiKeyHeader =
    request.headers.get("x-api-key") ||
    (() => {
      const auth = request.headers.get("authorization")
      if (auth?.startsWith("ApiKey ")) {
        return auth.substring(7).trim()
      }
      return null
    })()

  if (apiKeyHeader) {
    const keyVerification = verifyApiKey(apiKeyHeader)
    if (keyVerification.valid) {
      return {
        traceId,
        clientIp,
        userAgent,
        authMethod: "API_KEY",
        user: {
          id: "m2m-service-account",
          email: "m2m@api.internal",
          role: "OWNER",
          scopes: keyVerification.scopes,
        },
      }
    }
  }

  // 2. Check Session Token (Bearer header or Cookie)
  let sessionToken: string | null = null

  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    sessionToken = authHeader.substring(7).trim()
  }

  if (!sessionToken && "cookies" in request) {
    const nextReq = request as NextRequest
    sessionToken = nextReq.cookies.get(SESSION_COOKIE_NAME)?.value || null
  }

  if (sessionToken) {
    const session = await verifySessionToken(sessionToken)
    if (session && session.userId && session.email) {
      const role: UserRole = session.role === "OWNER" ? "OWNER" : "CUSTOMER"

      return {
        traceId,
        clientIp,
        userAgent,
        authMethod: "SESSION",
        user: {
          id: session.userId,
          email: session.email,
          role,
          scopes: ["*"],
        },
      }
    }
  }

  // 3. Anonymous / Public context
  return {
    traceId,
    clientIp,
    userAgent,
    authMethod: "ANONYMOUS",
  }
}

export async function assertSecurity(
  request: NextRequest | Request,
  options: RouteSecurityOptions = {}
): Promise<RequestSecurityContext> {
  const context = await extractSecurityContext(request)

  if (options.requireAuth) {
    if (!context.user) {
      throw new UnauthorizedError(
        "Authentication required. Please provide a valid Bearer token, session cookie, or X-API-Key."
      )
    }

    if (options.requiredRole && options.requiredRole !== "PUBLIC") {
      if (context.user.role !== options.requiredRole) {
        throw new ForbiddenError(
          `Insufficient privileges. Required role: ${options.requiredRole}, current role: ${context.user.role}.`
        )
      }
    }

    if (options.requiredScopes && options.requiredScopes.length > 0) {
      const userScopes = context.user.scopes || []
      const hasWildcard = userScopes.includes("*")
      const hasAllScopes =
        hasWildcard ||
        options.requiredScopes.every((scope) => userScopes.includes(scope))

      if (!hasAllScopes) {
        throw new ForbiddenError(
          `Missing required API scope(s): ${options.requiredScopes.join(", ")}`
        )
      }
    }
  }

  return context
}
