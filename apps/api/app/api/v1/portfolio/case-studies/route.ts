import { db, desc, asc } from "@workspace/db"
import { caseStudies } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createCaseStudySchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db
      .select()
      .from(caseStudies)
      .orderBy(asc(caseStudies.displayOrder), desc(caseStudies.createdAt))

    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createCaseStudySchema,
    auditConfig: (created) => {
      const cs = created as { id?: string } | undefined
      return {
        domain: "PORTFOLIO",
        actionType: "CASE_STUDY_CREATED",
        entityType: "case_studies",
        entityId: cs?.id || "new",
        caseStudyId: cs?.id,
        status: "COMPLETED",
      }
    },
  },
  async (_, { body }) => {
    const [created] = await db
      .insert(caseStudies)
      .values({
        ...body,
        updatedAt: new Date(),
      })
      .returning()

    return apiCreated(created)
  }
)
