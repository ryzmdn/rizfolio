import { db, desc } from "@workspace/db"
import { coupons } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createCouponSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db
      .select()
      .from(coupons)
      .orderBy(desc(coupons.createdAt))
    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createCouponSchema,
    auditConfig: (created) => ({
      domain: "COMMERCE",
      actionType: "COUPON_CREATED",
      entityType: "coupons",
      entityId: (created as { code?: string })?.code || "code",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db
      .insert(coupons)
      .values({
        ...body,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
        updatedAt: new Date(),
      })
      .returning()

    return apiCreated(created)
  }
)
