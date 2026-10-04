import { db, eq } from "@workspace/db"
import { coupons } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateCouponSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [item] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Coupon with ID '${id}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateCouponSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "COMMERCE",
      actionType: "COUPON_UPDATED",
      entityType: "coupons",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(coupons)
      .set({
        ...body,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(coupons.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Coupon with ID '${id}' not found.`)
    }

    return apiSuccess(updated)
  }
)

export const DELETE = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    auditConfig: (_, { params }) => ({
      domain: "COMMERCE",
      actionType: "COUPON_DELETED",
      entityType: "coupons",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(coupons)
      .where(eq(coupons.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Coupon with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
