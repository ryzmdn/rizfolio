import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DEFAULT_ALLOWED_ORIGINS = [
  "https://ryzmdn.me",
  "https://portfolio.ryzmdn.me",
  "https://blog.ryzmdn.me",
  "https://shop.ryzmdn.me",
  "https://changelog.ryzmdn.me",
  "https://docs.ryzmdn.me",
  "https://archive.ryzmdn.me",
  "https://cms.ryzmdn.me",
  "https://linkbio.ryzmdn.me",
  "https://api.ryzmdn.me",
]

const DEV_ORIGIN_PATTERNS = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
]

export function getAllowedOrigins(): string[] {
  const envOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_PORTFOLIO_URL,
    process.env.NEXT_PUBLIC_BLOG_URL,
    process.env.NEXT_PUBLIC_SHOP_URL,
    process.env.NEXT_PUBLIC_CHANGELOG_URL,
    process.env.NEXT_PUBLIC_DOCS_URL,
    process.env.NEXT_PUBLIC_ARCHIVE_URL,
    process.env.NEXT_PUBLIC_CMS_URL,
    process.env.NEXT_PUBLIC_LINKBIO_URL,
    process.env.NEXT_PUBLIC_API_URL,
  ]
    .filter((url): url is string => Boolean(url && url.trim().length > 0))
    .map((url) => url.replace(/\/$/, "").trim())

  const configured = Array.from(
    new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins])
  )
  return configured
}

export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) {
    return true
  }

  const normalized = origin.replace(/\/$/, "").toLowerCase()

  if (process.env.NODE_ENV !== "production") {
    if (DEV_ORIGIN_PATTERNS.some((pattern) => pattern.test(normalized))) {
      return true
    }
  }

  const allowedOrigins = getAllowedOrigins().map((o) => o.toLowerCase())
  return allowedOrigins.includes(normalized)
}

export function getCorsHeaders(
  request: NextRequest | Request
): Record<string, string> {
  const origin = request.headers.get("origin")
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods":
      "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD",
    "Access-Control-Allow-Headers":
      "Authorization, X-API-Key, Content-Type, Accept, X-Requested-With, X-Request-Id, X-CSRF-Token, X-Api-Version",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  }

  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin
  } else if (!origin) {
    headers["Access-Control-Allow-Origin"] =
      DEFAULT_ALLOWED_ORIGINS[0] ?? "https://ryzmdn.me"
  }

  return headers
}

export function handleCorsPreflight(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin")

  if (origin && !isAllowedOrigin(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: "Forbidden: Origin not allowed by CORS policy",
    })
  }

  const corsHeaders = getCorsHeaders(request)

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}
