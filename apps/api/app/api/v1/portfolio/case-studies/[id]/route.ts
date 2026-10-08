import { db, eq, or } from "@workspace/db"
import { caseStudies } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateCaseStudySchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const idOrSlug = String(params.id)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug
      )

    const [item] = await db
      .select()
      .from(caseStudies)
      .where(
        isUuid
          ? or(eq(caseStudies.id, idOrSlug), eq(caseStudies.slug, idOrSlug))
          : eq(caseStudies.slug, idOrSlug)
      )
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Case study '${idOrSlug}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateCaseStudySchema,
    auditConfig: (_, { params, body }) => ({
      domain: "PORTFOLIO",
      actionType: "CASE_STUDY_UPDATED",
      entityType: "case_studies",
      entityId: String(params.id),
      caseStudyId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(caseStudies)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(caseStudies.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Case study with ID '${id}' not found.`)
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
      domain: "PORTFOLIO",
      actionType: "CASE_STUDY_DELETED",
      entityType: "case_studies",
      entityId: String(params.id),
      caseStudyId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(caseStudies)
      .where(eq(caseStudies.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Case study with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
