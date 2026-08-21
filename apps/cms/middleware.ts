import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { validateOwnerSession, SESSION_COOKIE_NAME } from "@workspace/auth"

const CMS_CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: res.cloudinary.com images.unsplash.com *.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' *.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ")

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  )
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive")
  response.headers.set("Content-Security-Policy", CMS_CSP_POLICY)

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

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const session = await validateOwnerSession(token)
  const isOwner = session && session.role === "OWNER"

  if (pathname === "/login") {
    if (isOwner) {
      const redirectResponse = NextResponse.redirect(new URL("/", request.url))
      return applySecurityHeaders(redirectResponse)
    }
    const nextResponse = NextResponse.next()
    return applySecurityHeaders(nextResponse)
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
      return applySecurityHeaders(unauthorizedResponse)
    }

    const loginUrl = new URL("/login", request.url)
    const redirectResponse = NextResponse.redirect(loginUrl)
    return applySecurityHeaders(redirectResponse)
  }

  const nextResponse = NextResponse.next()
  return applySecurityHeaders(nextResponse)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.webmanifest).*)",
  ],
}
