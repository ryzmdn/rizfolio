import { db, asc } from "@workspace/db"
import { tags } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createTagSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db.select().from(tags).orderBy(asc(tags.name))
    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createTagSchema,
    auditConfig: (created) => ({
      domain: "CONTENT",
      actionType: "TAG_CREATED",
      entityType: "tags",
      entityId: (created as { id?: string })?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db.insert(tags).values(body).returning()
    return apiCreated(created)
  }
)
