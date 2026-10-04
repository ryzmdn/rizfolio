import { db, desc, asc } from "@workspace/db"
import { services } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createServiceSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db
      .select()
      .from(services)
      .orderBy(asc(services.displayOrder), desc(services.createdAt))

    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createServiceSchema,
    auditConfig: (created) => ({
      domain: "PORTFOLIO",
      actionType: "SERVICE_CREATED",
      entityType: "services",
      entityId: (created as any)?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db.insert(services).values(body).returning()
    return apiCreated(created)
  }
)
