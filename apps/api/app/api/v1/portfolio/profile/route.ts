import { db, eq } from "@workspace/db"
import { profile } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { updateProfileSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const [data] = await db.select().from(profile).limit(1)
    return apiSuccess(data || null)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateProfileSchema,
    auditConfig: (_, { body }) => ({
      domain: "PORTFOLIO",
      actionType: "PROFILE_UPDATED",
      entityType: "profile",
      entityId: "main-profile",
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [existing] = await db.select().from(profile).limit(1)

    if (existing) {
      const [updated] = await db
        .update(profile)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(profile.id, existing.id))
        .returning()

      return apiSuccess(updated)
    }

    const [created] = await db
      .insert(profile)
      .values({
        ...body,
        updatedAt: new Date(),
      })
      .returning()

    return apiCreated(created)
  }
)
