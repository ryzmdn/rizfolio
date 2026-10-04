import { db, eq } from "@workspace/db"
import { bioLinks } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateBioLinkSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [item] = await db
      .select()
      .from(bioLinks)
      .where(eq(bioLinks.id, id))
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Bio link with ID '${id}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateBioLinkSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "SYSTEM",
      actionType: "BIO_LINK_UPDATED",
      entityType: "bio_links",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(bioLinks)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(bioLinks.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Bio link with ID '${id}' not found.`)
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
      domain: "SYSTEM",
      actionType: "BIO_LINK_DELETED",
      entityType: "bio_links",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(bioLinks)
      .where(eq(bioLinks.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Bio link with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
