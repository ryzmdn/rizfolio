import { NextRequest, NextResponse } from "next/server"
import { db, orderItems, productFiles, eq } from "@workspace/db"
import { createSignedDownloadUrl, STORAGE_BUCKETS } from "@workspace/storage"

interface RouteParams {
  params: Promise<{
    token: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { token } = await params

  if (!token || token.trim() === "") {
    return new NextResponse(
      JSON.stringify({
        error: "Bad Request",
        message: "Download token is required.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
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
      .where(eq(orderItems.downloadToken, token))
      .limit(1)

    const orderItem = itemRows[0]

    if (!orderItem) {
      return new NextResponse(
        JSON.stringify({
          error: "Not Found",
          message: "The provided download token is invalid or does not exist.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    }

    if (orderItem.tokenExpiresAt && new Date(orderItem.tokenExpiresAt) < new Date()) {
      return new NextResponse(
        JSON.stringify({
          error: "Link Expired",
          message: "This download link has expired. Please contact support for a new token.",
        }),
        { status: 410, headers: { "Content-Type": "application/json" } }
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
      return new NextResponse(
        JSON.stringify({
          error: "File Not Ready",
          message: "The requested digital asset file is currently not configured.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    }

    const signedUrl = await createSignedDownloadUrl(
      STORAGE_BUCKETS.DIGITAL_PRODUCTS,
      file.storagePath,
      300
    )

    return NextResponse.redirect(signedUrl, 307)
  } catch (error) {
    console.error(
      "[Shop Download Route] Error processing download token:",
      error instanceof Error ? error.message : "Unknown error"
    )

    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An error occurred while verifying the digital download token.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
