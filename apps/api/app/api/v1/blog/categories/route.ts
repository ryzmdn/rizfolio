import { db, asc } from "@workspace/db"
import { categories } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createCategorySchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db.select().from(categories).orderBy(asc(categories.name))
    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createCategorySchema,
    auditConfig: (created) => ({
      domain: "CONTENT",
      actionType: "CATEGORY_CREATED",
      entityType: "categories",
      entityId: (created as any)?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db.insert(categories).values(body).returning()
    return apiCreated(created)
  }
)
