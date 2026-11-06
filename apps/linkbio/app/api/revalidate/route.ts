import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import crypto from "crypto"

function safeCompareTokens(provided: string, expected: string): boolean {
  try {
    const bufProvided = Buffer.from(provided, "utf8")
    const bufExpected = Buffer.from(expected, "utf8")
    if (bufProvided.length !== bufExpected.length) {
      return false
    }
    return crypto.timingSafeEqual(bufProvided, bufExpected)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const headerSecret =
      request.headers.get("x-revalidate-secret") ||
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")

    const expectedSecret = process.env.REVALIDATION_SECRET_TOKEN

    if (
      !expectedSecret ||
      expectedSecret.trim().length < 16 ||
      !headerSecret ||
      !safeCompareTokens(headerSecret, expectedSecret)
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized revalidation request" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")
    const tag = searchParams.get("tag")

    if (path) {
      revalidatePath(path)
    }

    if (tag) {
      ;(revalidateTag as (t: string, ...args: unknown[]) => void)(tag)
    }

    if (!path && !tag) {
      revalidatePath("/", "layout")
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      target: path || tag || "all",
    })
  } catch (error: unknown) {
    console.error(
      "[Linkbio Revalidate Route] Revalidation error:",
      error instanceof Error ? error.message : String(error)
    )
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error processing revalidation",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
