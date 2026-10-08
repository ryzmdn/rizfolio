import { db, eq } from "@workspace/db"
import { inquiries } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateInquiryStatusSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [item] = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, id))
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Inquiry with ID '${id}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PATCH = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateInquiryStatusSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "PORTFOLIO",
      actionType: "INQUIRY_STATUS_UPDATED",
      entityType: "inquiries",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(inquiries)
      .set({
        status: body.status,
        replyNotes: body.replyNotes,
        respondedAt: body.status === "RESPONDED" ? new Date() : undefined,
      })
      .where(eq(inquiries.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Inquiry with ID '${id}' not found.`)
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
      actionType: "INQUIRY_DELETED",
      entityType: "inquiries",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(inquiries)
      .where(eq(inquiries.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Inquiry with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
