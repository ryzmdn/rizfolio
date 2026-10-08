import { db, eq, or } from "@workspace/db"
import { orders, orderItems, products } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateOrderStatusSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const orderRef = String(params.orderNumber)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        orderRef
      )

    const [order] = await db
      .select()
      .from(orders)
      .where(
        isUuid
          ? or(eq(orders.id, orderRef), eq(orders.orderNumber, orderRef))
          : eq(orders.orderNumber, orderRef)
      )
      .limit(1)

    if (!order) {
      throw new NotFoundError(`Order '${orderRef}' not found.`)
    }

    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        productTitle: products.title,
        pricePaid: orderItems.pricePaid,
        downloadToken: orderItems.downloadToken,
        tokenExpiresAt: orderItems.tokenExpiresAt,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id))

    return apiSuccess({
      ...order,
      items,
    })
  }
)

export const PATCH = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateOrderStatusSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "COMMERCE",
      actionType: "ORDER_STATUS_UPDATED",
      entityType: "orders",
      entityId: String(params.orderNumber),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const orderRef = String(params.orderNumber)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        orderRef
      )

    const [order] = await db
      .select()
      .from(orders)
      .where(
        isUuid
          ? or(eq(orders.id, orderRef), eq(orders.orderNumber, orderRef))
          : eq(orders.orderNumber, orderRef)
      )
      .limit(1)

    if (!order) {
      throw new NotFoundError(`Order '${orderRef}' not found.`)
    }

    const [updated] = await db
      .update(orders)
      .set({
        status: body.status,
        paymentRef: body.paymentRef || order.paymentRef,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))
      .returning()

    return apiSuccess(updated)
  }
)
