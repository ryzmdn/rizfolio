import { db, desc, asc } from "@workspace/db"
import { experiences } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createExperienceSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.displayOrder), desc(experiences.startDate))

    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createExperienceSchema,
    auditConfig: (created) => ({
      domain: "PORTFOLIO",
      actionType: "EXPERIENCE_CREATED",
      entityType: "experiences",
      entityId: (created as any)?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db.insert(experiences).values(body).returning()
    return apiCreated(created)
  }
)
