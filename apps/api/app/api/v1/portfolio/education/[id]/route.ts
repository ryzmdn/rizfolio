import { db, eq } from "@workspace/db"
import { education } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateEducationSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [item] = await db
      .select()
      .from(education)
      .where(eq(education.id, id))
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Education record with ID '${id}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateEducationSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "PORTFOLIO",
      actionType: "EDUCATION_UPDATED",
      entityType: "education",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(education)
      .set(body)
      .where(eq(education.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Education record with ID '${id}' not found.`)
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
      actionType: "EDUCATION_DELETED",
      entityType: "education",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(education)
      .where(eq(education.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Education record with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
