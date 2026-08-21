import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

const REVALIDATION_SECRET =
  process.env.REVALIDATION_SECRET_TOKEN || "rizfolio-dev-revalidation-secret"

export async function POST(request: NextRequest) {
  return handleRevalidation(request)
}

export async function GET(request: NextRequest) {
  return handleRevalidation(request)
}

async function handleRevalidation(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret =
    searchParams.get("secret") ||
    request.headers.get("x-revalidate-secret") ||
    request.headers.get("authorization")?.replace("Bearer ", "")

  if (!secret || secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Invalid or missing revalidation secret token.",
      },
      { status: 401 }
    )
  }

  const path = searchParams.get("path") || "/"
  const slug = searchParams.get("slug")
  const tag = searchParams.get("tag")

  try {
    if (slug) {
      revalidatePath(`/product/${slug}`)
    } else if (path) {
      revalidatePath(path)
    }

    if (tag) {
      // @ts-expect-error - Next.js 16 cache tag signature
      revalidateTag(tag)
    }

    return NextResponse.json({
      revalidated: true,
      app: "shop",
      path: slug ? `/product/${slug}` : path,
      tag: tag || null,
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          error instanceof Error ? error.message : "Failed to revalidate.",
      },
      { status: 500 }
    )
  }
}
