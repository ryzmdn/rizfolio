export interface ErrorDiagnosticPayload {
  message: string
  name: string
  stack?: string
  digest?: string
  timestamp: string
  url?: string
  userAgent?: string
}

export function reportClientError(
  error: Error & { digest?: string },
  context?: string
): ErrorDiagnosticPayload {
  const payload: ErrorDiagnosticPayload = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    digest: error.digest,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  }

  const prefix = context ? `[${context}]` : "[Client Error Boundary]"
  console.error(prefix, payload)
  return payload
}
