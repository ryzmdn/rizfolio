import { NextResponse } from "next/server"
import { ZodError } from "zod"
import type { ApiErrorDetail, ApiErrorResponse } from "./types"

export class ApiError extends Error {
  public readonly status: number
  public readonly code: string
  public readonly details?: ApiErrorDetail[]

  constructor(
    message: string,
    status = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: ApiErrorDetail[]
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.details = details
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Validation failed", details?: ApiErrorDetail[]) {
    super(message, 400, "VALIDATION_ERROR", details)
    this.name = "ValidationError"
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Authentication required or invalid credentials") {
    super(message, 401, "UNAUTHORIZED")
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "You do not have permission to access this resource") {
    super(message, 403, "FORBIDDEN")
    this.name = "ForbiddenError"
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict with existing resource") {
    super(message, 409, "CONFLICT")
    this.name = "ConflictError"
  }
}

export class RateLimitError extends ApiError {
  public readonly retryAfterSeconds: number

  constructor(
    message = "Too many requests. Please try again later.",
    retryAfterSeconds = 60
  ) {
    super(message, 429, "RATE_LIMIT_EXCEEDED")
    this.name = "RateLimitError"
    this.retryAfterSeconds = retryAfterSeconds
  }
}

export function formatZodError(error: ZodError): ApiErrorDetail[] {
  return error.errors.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }))
}

export function createErrorResponse(
  error: unknown,
  traceId = crypto.randomUUID(),
  customHeaders: Record<string, string> = {}
): NextResponse<ApiErrorResponse> {
  const timestamp = new Date().toISOString()

  let status = 500
  let code = "INTERNAL_SERVER_ERROR"
  let message = "An internal server error occurred"
  let details: ApiErrorDetail[] | undefined = undefined

  if (error instanceof ApiError) {
    status = error.status
    code = error.code
    message = error.message
    details = error.details
  } else if (error instanceof ZodError) {
    status = 400
    code = "VALIDATION_ERROR"
    message = "Request validation failed"
    details = formatZodError(error)
  } else if (error instanceof Error) {
    if (process.env.NODE_ENV !== "production") {
      message = error.message
    } else {
      console.error(`[ApiError Unhandled - Trace: ${traceId}]:`, error)
      message = "An unexpected error occurred. Please try again later."
    }
  }

  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      status,
      ...(details && details.length > 0 ? { details } : {}),
    },
    meta: {
      timestamp,
      traceId,
    },
  }

  return NextResponse.json(payload, {
    status,
    headers: {
      "X-Request-Id": traceId,
      ...customHeaders,
    },
  })
}
