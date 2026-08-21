import { NextRequest, NextResponse } from "next/server"
import { db, orderItems, productFiles, eq } from "@workspace/db"
import { createSignedDownloadUrl, STORAGE_BUCKETS } from "@workspace/storage"

interface RouteParams {
  params: Promise<{
    token: string
  }>
}

const SECURE_TOKEN_REGEX = /^[a-zA-Z0-9_-]{32,128}$/

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { token } = await params
  const trimmedToken = token?.trim()

  if (!trimmedToken || !SECURE_TOKEN_REGEX.test(trimmedToken)) {
    return NextResponse.json(
      {
        error: "Bad Request",
        message: "Invalid download token format.",
      },
      { status: 400, headers: NO_CACHE_HEADERS }
    )
  }

  try {
    const itemRows = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        downloadToken: orderItems.downloadToken,
        tokenExpiresAt: orderItems.tokenExpiresAt,
      })
      .from(orderItems)
      .where(eq(orderItems.downloadToken, trimmedToken))
      .limit(1)

    const orderItem = itemRows[0]

    if (!orderItem) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "The requested download token was not found or is invalid.",
        },
        { status: 404, headers: NO_CACHE_HEADERS }
      )
    }

    if (
      orderItem.tokenExpiresAt &&
      new Date(orderItem.tokenExpiresAt) < new Date()
    ) {
      return NextResponse.json(
        {
          error: "Link Expired",
          message:
            "This download link has expired. Please contact support for assistance.",
        },
        { status: 410, headers: NO_CACHE_HEADERS }
      )
    }

    const fileRows = await db
      .select({
        id: productFiles.id,
        fileName: productFiles.fileName,
        storagePath: productFiles.storagePath,
      })
      .from(productFiles)
      .where(eq(productFiles.productId, orderItem.productId))
      .limit(1)

    const file = fileRows[0]

    if (!file || !file.storagePath) {
      return NextResponse.json(
        {
          error: "File Unavailable",
          message:
            "The digital asset file is currently not ready for download.",
        },
        { status: 404, headers: NO_CACHE_HEADERS }
      )
    }

    const signedUrl = await createSignedDownloadUrl(
      STORAGE_BUCKETS.DIGITAL_PRODUCTS,
      file.storagePath,
      300
    )

    const redirectResponse = NextResponse.redirect(signedUrl, 307)
    for (const [key, val] of Object.entries(NO_CACHE_HEADERS)) {
      redirectResponse.headers.set(key, val)
    }

    return redirectResponse
  } catch (error) {
    console.error(
      "[Shop Download] Internal error while verifying download token:",
      {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
      }
    )

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An error occurred while processing the download request.",
      },
      { status: 500, headers: NO_CACHE_HEADERS }
    )
  }
}
