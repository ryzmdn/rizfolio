import { db, eq } from "@workspace/db"
import { productReviews } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateReviewStatusSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const PATCH = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateReviewStatusSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "COMMERCE",
      actionType: "REVIEW_STATUS_UPDATED",
      entityType: "product_reviews",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(productReviews)
      .set({ status: body.status })
      .where(eq(productReviews.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Review with ID '${id}' not found.`)
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
      actionType: "REVIEW_DELETED",
      entityType: "product_reviews",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(productReviews)
      .where(eq(productReviews.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Review with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
