import { db, asc, eq } from "@workspace/db"
import { bioLinks } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createBioLinkSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (request, { security }) => {
    const isOwner = security.user?.role === "OWNER"

    const list = await db
      .select()
      .from(bioLinks)
      .where(isOwner ? undefined : eq(bioLinks.isActive, true))
      .orderBy(asc(bioLinks.displayOrder), asc(bioLinks.createdAt))

    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createBioLinkSchema,
    auditConfig: (created) => ({
      domain: "SYSTEM",
      actionType: "BIO_LINK_CREATED",
      entityType: "bio_links",
      entityId: (created as any)?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db
      .insert(bioLinks)
      .values({
        ...body,
        updatedAt: new Date(),
      })
      .returning()

    return apiCreated(created)
  }
)
