import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { ZodSchema } from "zod"
import {
  getCorsHeaders,
  isAllowedOrigin,
  handleCorsPreflight,
} from "../security/cors"
import { checkRateLimit } from "../security/rate-limit"
import { assertSecurity } from "../security/guard"
import { evaluateHoneypot } from "../security/honeypot"
import { sanitizeObject } from "../security/sanitize"
import {
  createErrorResponse,
  RateLimitError,
  ValidationError,
  ForbiddenError,
} from "./errors"
import { logMasterTransaction, MasterAuditParams } from "./audit"
import type {
  RequestSecurityContext,
  RouteSecurityOptions,
  RouteHandlerContext,
} from "./types"

export interface ApiHandlerConfig<
  TBody = unknown,
> extends RouteSecurityOptions {
  schema?: ZodSchema<TBody>
  checkHoneypot?: boolean
  auditConfig?: (
    result: unknown,
    context: {
      security: RequestSecurityContext
      params: Record<string, string | string[] | undefined>
      body: TBody
    }
  ) => MasterAuditParams | null | Promise<MasterAuditParams | null>
}

export type ApiHandlerFunction<TBody = unknown, TResponse = unknown> = (
  request: NextRequest,
  context: {
    security: RequestSecurityContext
    params: Record<string, string | string[] | undefined>
    body: TBody
  }
) => Promise<NextResponse<TResponse> | NextResponse>

export function createApiHandler<TBody = unknown, TResponse = unknown>(
  config: ApiHandlerConfig<TBody>,
  handler: ApiHandlerFunction<TBody, TResponse>
) {
  return async (
    request: NextRequest,
    routeContext?: RouteHandlerContext
  ): Promise<NextResponse> => {
    const startTime = Date.now()
    const traceId = request.headers.get("x-request-id") || crypto.randomUUID()
    const corsHeaders = getCorsHeaders(request)

    if (request.method === "OPTIONS") {
      return handleCorsPreflight(request)
    }

    const origin = request.headers.get("origin")
    if (origin && !isAllowedOrigin(origin)) {
      return createErrorResponse(
        new ForbiddenError(
          "Cross-origin request blocked by CORS security policy."
        ),
        traceId,
        corsHeaders
      )
    }

    try {
      const rateLimitTier = config.rateLimitTier || "PUBLIC_READ"
      const rateLimitResult = checkRateLimit(request, rateLimitTier)

      const mergedHeaders = {
        ...corsHeaders,
        ...rateLimitResult.headers,
        "X-Request-Id": traceId,
      }

      if (!rateLimitResult.allowed) {
        throw new RateLimitError(
          `Rate limit exceeded. Try again in ${rateLimitResult.retryAfterSeconds} seconds.`,
          rateLimitResult.retryAfterSeconds
        )
      }

      const securityContext = await assertSecurity(request, config)
      securityContext.traceId = traceId

      const resolvedParams: Record<string, string | string[] | undefined> =
        routeContext?.params ? await routeContext.params : {}

      let parsedBody: TBody = undefined as unknown as TBody

      if (["POST", "PUT", "PATCH"].includes(request.method)) {
        const contentType = request.headers.get("content-type") || ""

        if (contentType.includes("application/json")) {
          try {
            const rawJson = await request.json()

            if (config.checkHoneypot) {
              const honeypot = evaluateHoneypot(rawJson)
              if (honeypot.isSpam) {
                throw new ValidationError(
                  "Spam verification triggered. Submission rejected."
                )
              }
            }

            const sanitized = sanitizeObject(rawJson)

            if (config.schema) {
              parsedBody = config.schema.parse(sanitized)
            } else {
              parsedBody = sanitized as TBody
            }
          } catch (error: unknown) {
            if (error instanceof SyntaxError) {
              throw new ValidationError(
                "Malformed JSON payload in request body."
              )
            }
            throw error
          }
        }
      }

      const response = await handler(request, {
        security: securityContext,
        params: resolvedParams,
        body: parsedBody,
      })

      for (const [key, value] of Object.entries(mergedHeaders)) {
        if (!response.headers.has(key)) {
          response.headers.set(key, value)
        }
      }

      response.headers.set("X-Response-Time-Ms", String(Date.now() - startTime))

      if (config.auditConfig && response.status < 400) {
        try {
          const auditParams = await config.auditConfig(null, {
            security: securityContext,
            params: resolvedParams,
            body: parsedBody,
          })

          if (auditParams) {
            await logMasterTransaction(auditParams, securityContext)
          }
        } catch (auditErr: unknown) {
          console.error(
            `[Audit Handler Error - Trace: ${traceId}]:`,
            auditErr instanceof Error ? auditErr.message : String(auditErr)
          )
        }
      }

      return response
    } catch (error: unknown) {
      return createErrorResponse(error, traceId, corsHeaders)
    }
  }
}
