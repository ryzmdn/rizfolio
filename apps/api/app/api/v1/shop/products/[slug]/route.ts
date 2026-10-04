import { db, eq, or, and, desc } from "@workspace/db"
import { products, productFiles, productReviews } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateProductSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const slugOrId = String(params.slug)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      )

    const [product] = await db
      .select()
      .from(products)
      .where(
        isUuid
          ? or(eq(products.id, slugOrId), eq(products.slug, slugOrId))
          : eq(products.slug, slugOrId)
      )
      .limit(1)

    if (!product) {
      throw new NotFoundError(`Product '${slugOrId}' not found.`)
    }

    const files = await db
      .select({
        id: productFiles.id,
        fileName: productFiles.fileName,
        fileSizeBytes: productFiles.fileSizeBytes,
      })
      .from(productFiles)
      .where(eq(productFiles.productId, product.id))

    const reviews = await db
      .select()
      .from(productReviews)
      .where(
        and(
          eq(productReviews.productId, product.id),
          eq(productReviews.status, "APPROVED")
        )
      )
      .orderBy(desc(productReviews.createdAt))

    return apiSuccess({
      ...product,
      files,
      reviews,
    })
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateProductSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "COMMERCE",
      actionType: "PRODUCT_UPDATED",
      entityType: "products",
      entityId: String(params.slug),
      productId: String(params.slug),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const slugOrId = String(params.slug)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      )

    const [existing] = await db
      .select()
      .from(products)
      .where(
        isUuid
          ? or(eq(products.id, slugOrId), eq(products.slug, slugOrId))
          : eq(products.slug, slugOrId)
      )
      .limit(1)

    if (!existing) {
      throw new NotFoundError(`Product '${slugOrId}' not found.`)
    }

    const [updated] = await db
      .update(products)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(products.id, existing.id))
      .returning()

    return apiSuccess(updated)
  }
)

export const DELETE = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    auditConfig: (_, { params }) => ({
      domain: "COMMERCE",
      actionType: "PRODUCT_DELETED",
      entityType: "products",
      entityId: String(params.slug),
      productId: String(params.slug),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const slugOrId = String(params.slug)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      )

    const [deleted] = await db
      .delete(products)
      .where(
        isUuid
          ? or(eq(products.id, slugOrId), eq(products.slug, slugOrId))
          : eq(products.slug, slugOrId)
      )
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Product '${slugOrId}' not found.`)
    }

    return apiSuccess({ deleted: true, id: deleted.id, slug: deleted.slug })
  }
)
