import { db, desc, asc } from "@workspace/db"
import { testimonials } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createTestimonialSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.displayOrder), desc(testimonials.createdAt))

    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createTestimonialSchema,
    auditConfig: (created) => ({
      domain: "PORTFOLIO",
      actionType: "TESTIMONIAL_CREATED",
      entityType: "testimonials",
      entityId: (created as any)?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db.insert(testimonials).values(body).returning()
    return apiCreated(created)
  }
)
