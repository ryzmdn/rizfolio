import { db, eq } from "@workspace/db"
import { testimonials } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateTestimonialSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [item] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Testimonial with ID '${id}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateTestimonialSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "PORTFOLIO",
      actionType: "TESTIMONIAL_UPDATED",
      entityType: "testimonials",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(testimonials)
      .set(body)
      .where(eq(testimonials.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Testimonial with ID '${id}' not found.`)
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
      actionType: "TESTIMONIAL_DELETED",
      entityType: "testimonials",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Testimonial with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
