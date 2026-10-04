import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isAllowedOrigin, getCorsHeaders } from "./lib/security/cors"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/logos") ||
    pathname.startsWith("/media")
  ) {
    return NextResponse.next()
  }

  const traceId = request.headers.get("x-request-id") || crypto.randomUUID()
  const corsHeaders = getCorsHeaders(request)

  if (request.method === "OPTIONS") {
    const origin = request.headers.get("origin")
    if (origin && !isAllowedOrigin(origin)) {
      return new NextResponse(null, {
        status: 403,
        statusText: "Forbidden: Origin not allowed",
      })
    }

    return new NextResponse(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        "X-Request-Id": traceId,
      },
    })
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-request-id", traceId)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set("X-Request-Id", traceId)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-DNS-Prefetch-Control", "on")

  if (pathname.startsWith("/api")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive")
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value)
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logos|media).*)"],
}
