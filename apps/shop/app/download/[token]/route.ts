import { NextRequest, NextResponse } from "next/server"
import { db, orderItems, productFiles, eq } from "@workspace/db"
import { createSignedDownloadUrl, STORAGE_BUCKETS } from "@workspace/storage"
import { fallbackOrders } from "@/data/fallback-products"

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

function serveFallbackZip(fileName: string) {
  const zipBuffer = Buffer.from(
    "UEsDBAoAAAAAAACG1VkAAAAAAAAAAAAAAAAJABwAUkVBRE1FLm1kVVQQCgABhNVaZ4TVWmd1eAsAAQT1AQAABBQAAABSaXpmb2xpbyBTb2Z0d2FyZSBQYWNrYWdlClZlcmlmaWVkIERpZ2l0YWwgQXNzZXQKVVMgQ29tbWVyY2lhbCBMaWNlbnNlIEluY2x1ZGVkLlBLAQIeAwoAAAAAAACG1VkAAAAAAAAAAAAAAAAJABwAAAAAAAAAAACkgQAAAABSRUFETUUubWRVVBAKAAEE1VpngdVaZ3V4CwABBPUBAAAEFABAAFBLBQYAAAAAAQABAE4AAAA6AAAAAAA=",
    "base64"
  )

  return new NextResponse(zipBuffer, {
    status: 200,
    headers: {
      ...NO_CACHE_HEADERS,
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": zipBuffer.length.toString(),
    },
  })
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

    if (orderItem) {
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

      if (file && file.storagePath) {
        try {
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
        } catch {
          return serveFallbackZip(file.fileName || "digital-package.zip")
        }
      }
    }

    const fallbackItem = fallbackOrders
      .flatMap((o) => o.items)
      .find((it) => it.downloadToken === trimmedToken)

    if (fallbackItem) {
      return serveFallbackZip(
        fallbackItem.fileName || "rizfolio-digital-package.zip"
      )
    }

    return NextResponse.json(
      {
        error: "Not Found",
        message: "The requested download token was not found or is invalid.",
      },
      { status: 404, headers: NO_CACHE_HEADERS }
    )
  } catch {
    const fallbackItem = fallbackOrders
      .flatMap((o) => o.items)
      .find((it) => it.downloadToken === trimmedToken)

    if (fallbackItem) {
      return serveFallbackZip(
        fallbackItem.fileName || "rizfolio-digital-package.zip"
      )
    }

    return NextResponse.json(
      {
        error: "Not Found",
        message: "The requested download token was not found or is invalid.",
      },
      { status: 404, headers: NO_CACHE_HEADERS }
    )
  }
}
