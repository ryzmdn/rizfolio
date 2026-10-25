import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { validateOwnerSession, SESSION_COOKIE_NAME } from "@workspace/auth"

function buildCmsCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: res.cloudinary.com images.unsplash.com *.supabase.co",
    "font-src 'self' data:",
    "connect-src 'self' *.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")
}

function applySecurityHeaders(
  response: NextResponse,
  nonce: string
): NextResponse {
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  )
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive")
  response.headers.set("x-nonce", nonce)
  response.headers.set("Content-Security-Policy", buildCmsCsp(nonce))

  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/manifest.webmanifest"
  ) {
    return NextResponse.next()
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")

  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const origin = request.headers.get("origin")
    if (origin) {
      try {
        const host = request.headers.get("host")
        const originHost = new URL(origin).host
        if (originHost !== host && process.env.NODE_ENV === "production") {
          const forbiddenResponse = NextResponse.json(
            {
              error: "Forbidden",
              message: "Cross-site request blocked by CMS origin security.",
            },
            { status: 403 }
          )
          return applySecurityHeaders(forbiddenResponse, nonce)
        }
      } catch {
        const badOriginResponse = NextResponse.json(
          {
            error: "Bad Request",
            message: "Malformed origin header.",
          },
          { status: 400 }
        )
        return applySecurityHeaders(badOriginResponse, nonce)
      }
    }
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const session = await validateOwnerSession(token)
  const isOwner = session && session.role === "OWNER"

  if (pathname === "/login") {
    if (isOwner) {
      const redirectResponse = NextResponse.redirect(new URL("/", request.url))
      return applySecurityHeaders(redirectResponse, nonce)
    }
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-nonce", nonce)
    requestHeaders.set("Content-Security-Policy", buildCmsCsp(nonce))

    const nextResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    return applySecurityHeaders(nextResponse, nonce)
  }

  if (!isOwner) {
    if (pathname.startsWith("/api")) {
      const unauthorizedResponse = NextResponse.json(
        {
          error: "Unauthorized",
          message:
            "Valid administrator session is required to access CMS APIs.",
        },
        { status: 401 }
      )
      return applySecurityHeaders(unauthorizedResponse, nonce)
    }

    const loginUrl = new URL("/login", request.url)
    const redirectResponse = NextResponse.redirect(loginUrl)
    return applySecurityHeaders(redirectResponse, nonce)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  requestHeaders.set("Content-Security-Policy", buildCmsCsp(nonce))

  const nextResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  return applySecurityHeaders(nextResponse, nonce)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.webmanifest).*)",
  ],
}
