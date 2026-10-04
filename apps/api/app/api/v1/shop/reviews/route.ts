import { db, desc, eq, and } from "@workspace/db"
import { productReviews, products } from "@workspace/db/schema"
import {
  createApiHandler,
  apiSuccess,
  apiCreated,
  NotFoundError,
} from "@/lib/api"
import { createReviewSchema } from "@/lib/validations"
import { sanitizeHoneypotFields } from "@/lib/security/honeypot"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (request) => {
    const url = new URL(request.url)
    const productSlug = url.searchParams.get("productSlug")

    if (!productSlug) {
      const list = await db
        .select()
        .from(productReviews)
        .orderBy(desc(productReviews.createdAt))
        .limit(50)
      return apiSuccess(list)
    }

    const list = await db
      .select()
      .from(productReviews)
      .where(
        and(
          eq(productReviews.productSlug, productSlug),
          eq(productReviews.status, "APPROVED")
        )
      )
      .orderBy(desc(productReviews.createdAt))

    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
    checkHoneypot: true,
    schema: createReviewSchema,
    auditConfig: (created) => ({
      domain: "COMMERCE",
      actionType: "REVIEW_SUBMITTED",
      entityType: "product_reviews",
      entityId: (created as { id?: string })?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const clean = sanitizeHoneypotFields(body)

    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, clean.productSlug!))
      .limit(1)

    if (!product) {
      throw new NotFoundError(`Product '${clean.productSlug}' not found.`)
    }

    const [created] = await db
      .insert(productReviews)
      .values({
        productId: product.id,
        productSlug: clean.productSlug!,
        authorName: clean.authorName!,
        authorRole: clean.authorRole || "Verified Developer",
        rating: clean.rating || 5,
        content: clean.content!,
        status: "PENDING",
      })
      .returning()

    if (!created) {
      throw new Error("Failed to submit review.")
    }

    return apiCreated({
      id: created.id,
      message: "Thank you! Your review has been submitted for moderation.",
      createdAt: created.createdAt,
    })
  }
)
