import { db, desc, asc } from "@workspace/db"
import { certifications } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createCertificationSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db
      .select()
      .from(certifications)
      .orderBy(asc(certifications.displayOrder), desc(certifications.issueDate))

    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createCertificationSchema,
    auditConfig: (created) => ({
      domain: "PORTFOLIO",
      actionType: "CERTIFICATION_CREATED",
      entityType: "certifications",
      entityId: (created as { id?: string })?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db.insert(certifications).values(body).returning()
    return apiCreated(created)
  }
)
