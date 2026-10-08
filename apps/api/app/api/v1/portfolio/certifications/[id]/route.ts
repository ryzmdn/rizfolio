import { db, eq } from "@workspace/db"
import { certifications } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateCertificationSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [item] = await db
      .select()
      .from(certifications)
      .where(eq(certifications.id, id))
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Certification with ID '${id}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateCertificationSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "PORTFOLIO",
      actionType: "CERTIFICATION_UPDATED",
      entityType: "certifications",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(certifications)
      .set(body)
      .where(eq(certifications.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Certification with ID '${id}' not found.`)
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
      actionType: "CERTIFICATION_DELETED",
      entityType: "certifications",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(certifications)
      .where(eq(certifications.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Certification with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
