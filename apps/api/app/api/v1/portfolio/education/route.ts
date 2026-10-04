import { db, desc, asc } from "@workspace/db"
import { education } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createEducationSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db
      .select()
      .from(education)
      .orderBy(asc(education.displayOrder), desc(education.startYear))

    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createEducationSchema,
    auditConfig: (created) => ({
      domain: "PORTFOLIO",
      actionType: "EDUCATION_CREATED",
      entityType: "education",
      entityId: (created as { id?: string })?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db.insert(education).values(body).returning()
    return apiCreated(created)
  }
)
