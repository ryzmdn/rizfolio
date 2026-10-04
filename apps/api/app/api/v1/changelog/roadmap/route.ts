import { db, asc, desc } from "@workspace/db"
import { roadmapItems } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createRoadmapItemSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db
      .select()
      .from(roadmapItems)
      .orderBy(asc(roadmapItems.displayOrder), desc(roadmapItems.createdAt))

    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createRoadmapItemSchema,
    auditConfig: (created) => ({
      domain: "CONTENT",
      actionType: "ROADMAP_ITEM_CREATED",
      entityType: "roadmap_items",
      entityId: (created as { id?: string })?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db
      .insert(roadmapItems)
      .values({
        ...body,
        updatedAt: new Date(),
      })
      .returning()

    return apiCreated(created)
  }
)
