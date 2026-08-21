import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATION_SECRET_TOKEN

  if (!expectedSecret || expectedSecret.trim().length < 16) {
    console.error(
      "[ISR Revalidation - Archive] REVALIDATION_SECRET_TOKEN environment variable is not properly configured."
    )
    return NextResponse.json(
      {
        error: "Server Misconfiguration",
        message: "Revalidation service is currently unconfigured.",
      },
      { status: 500 }
    )
  }

  // Extract secret solely from request headers (Never from URL query parameters)
  const authHeader = request.headers.get("authorization")
  const secret =
    request.headers.get("x-revalidate-secret") ||
    (authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7).trim()
      : undefined)

  if (!secret || secret !== expectedSecret) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Invalid or missing revalidation credentials.",
      },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path") || "/"
  const slug = searchParams.get("slug")
  const tag = searchParams.get("tag")

  try {
    if (slug) {
      revalidatePath(`/repo/${slug}`)
    } else if (path) {
      revalidatePath(path)
    }

    if (tag) {
      // @ts-expect-error - Next.js 16 cache tag signature
      revalidateTag(tag)
    }

    return NextResponse.json({
      revalidated: true,
      app: "archive",
      path: slug ? `/repo/${slug}` : path,
      tag: tag || null,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error(
      "[ISR Revalidation - Archive] Error executing revalidation:",
      {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
      }
    )

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to revalidate specified target.",
      },
      { status: 500 }
    )
  }
}
