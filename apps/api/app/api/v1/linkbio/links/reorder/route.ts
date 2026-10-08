import { db, eq } from "@workspace/db"
import { bioLinks } from "@workspace/db/schema"
import { createApiHandler, apiSuccess } from "@/lib/api"
import { reorderBioLinksSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: reorderBioLinksSchema,
    auditConfig: (_, { body }) => ({
      domain: "SYSTEM",
      actionType: "BIO_LINKS_REORDERED",
      entityType: "bio_links",
      entityId: "batch",
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    for (const item of body.items) {
      await db
        .update(bioLinks)
        .set({
          displayOrder: item.displayOrder,
          updatedAt: new Date(),
        })
        .where(eq(bioLinks.id, item.id))
    }

    return apiSuccess({
      reordered: true,
      count: body.items.length,
    })
  }
)
