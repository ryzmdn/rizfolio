import { db, desc, eq, count, inArray } from "@workspace/db"
import { orders, orderItems, products, coupons } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated, apiPaginated, ValidationError } from "@/lib/api"
import { createOrderSchema, paginationQuerySchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_READ",
  },
  async (request) => {
    const url = new URL(request.url)
    const query = paginationQuerySchema.parse({
      page: url.searchParams.get("page") || 1,
      limit: url.searchParams.get("limit") || 10,
    })

    const offset = (query.page - 1) * query.limit

    const [totalRecord] = await db.select({ value: count() }).from(orders)
    const total = totalRecord?.value ?? 0
    const totalPages = Math.ceil(total / query.limit) || 1

    const orderList = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(query.limit)
      .offset(offset)

    return apiPaginated(orderList, {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
    })
  }
)

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createOrderSchema,
    auditConfig: (created) => ({
      domain: "COMMERCE",
      actionType: "ORDER_CREATED",
      entityType: "orders",
      entityId: (created as any)?.orderNumber || "order",
      orderId: (created as any)?.id,
      amount: (created as any)?.totalAmount,
      currency: (created as any)?.currency,
      status: "PENDING",
    }),
  },
  async (_, { body }) => {
    const productIds = body.items.map((i) => i.productId)
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds))

    if (dbProducts.length !== productIds.length) {
      throw new ValidationError("One or more selected products are invalid or no longer available.")
    }

    let subtotal = 0
    const itemMap = new Map<string, typeof products.$inferSelect>()
    for (const p of dbProducts) {
      itemMap.set(p.id, p)
    }

    for (const item of body.items) {
      const prod = itemMap.get(item.productId)
      if (prod) {
        subtotal += prod.price * (item.quantity ?? 1)
      }
    }

    let discountAmount = 0
    if (body.couponCode) {
      const [coupon] = await db
        .select()
        .from(coupons)
        .where(eq(coupons.code, body.couponCode.toUpperCase().trim()))
        .limit(1)

      if (coupon && coupon.isActive) {
        if (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date()) {
          if (!coupon.minSpend || subtotal >= coupon.minSpend) {
            discountAmount = Math.round((subtotal * coupon.discountPercent) / 100)
          }
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount)
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().substring(0, 4).toUpperCase()}`

    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail.toLowerCase().trim(),
        totalAmount,
        currency: "IDR",
        status: "PENDING",
        paymentProvider: body.paymentProvider || "STRIPE",
        updatedAt: new Date(),
      })
      .returning()

    if (!newOrder) {
      throw new Error("Failed to create order record.")
    }

    // Insert order items
    for (const item of body.items) {
      const prod = itemMap.get(item.productId)!
      const downloadToken = crypto.randomUUID()

      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: prod.id,
        pricePaid: prod.price,
        downloadToken,
        tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days download validity
      })
    }

    return apiCreated({
      id: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerEmail: newOrder.customerEmail,
      subtotal,
      discountAmount,
      totalAmount,
      currency: newOrder.currency,
      status: newOrder.status,
    })
  }
)
