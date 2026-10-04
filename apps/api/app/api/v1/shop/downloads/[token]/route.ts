import { db, eq } from "@workspace/db"
import {
  orderItems,
  orders,
  products,
  productFiles,
} from "@workspace/db/schema"
import {
  createApiHandler,
  apiSuccess,
  NotFoundError,
  ForbiddenError,
} from "@/lib/api"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const token = String(params.token)

    const [item] = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        downloadToken: orderItems.downloadToken,
        tokenExpiresAt: orderItems.tokenExpiresAt,
        orderStatus: orders.status,
        productTitle: products.title,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.downloadToken, token))
      .limit(1)

    if (!item) {
      throw new NotFoundError(
        "Digital download link is invalid or does not exist."
      )
    }

    if (item.tokenExpiresAt && new Date(item.tokenExpiresAt) < new Date()) {
      throw new ForbiddenError(
        "This digital download link has expired. Please contact support to renew your link."
      )
    }

    if (item.orderStatus !== "PAID" && item.orderStatus !== "COMPLETED") {
      throw new ForbiddenError(
        `Digital download unavailable. Order is currently in '${item.orderStatus}' status.`
      )
    }

    const files = await db
      .select()
      .from(productFiles)
      .where(eq(productFiles.productId, item.productId))

    return apiSuccess({
      valid: true,
      productTitle: item.productTitle,
      expiresAt: item.tokenExpiresAt,
      files: files.map((f) => ({
        id: f.id,
        fileName: f.fileName,
        fileSizeBytes: f.fileSizeBytes,
        storagePath: f.storagePath,
      })),
    })
  }
)
