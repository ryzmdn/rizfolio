import { db, desc, eq, count } from "@workspace/db"
import { newsletterSubscribers } from "@workspace/db/schema"
import {
  createApiHandler,
  apiSuccess,
  apiCreated,
  apiPaginated,
  NotFoundError,
} from "@/lib/api"
import {
  newsletterSubscribeSchema,
  newsletterUnsubscribeSchema,
  paginationQuerySchema,
} from "@/lib/validations"
import { sanitizeHoneypotFields } from "@/lib/security/honeypot"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_READ",
  },
  async (request) => {
    const url = new URL(request.url)
    const query = paginationQuerySchema.parse({
      page: url.searchParams.get("page") || 1,
      limit: url.searchParams.get("limit") || 10,
    })

    const offset = (query.page - 1) * query.limit

    const [totalRecord] = await db
      .select({ value: count() })
      .from(newsletterSubscribers)

    const total = totalRecord?.value ?? 0
    const totalPages = Math.ceil(total / query.limit) || 1

    const list = await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.subscribedAt))
      .limit(query.limit)
      .offset(offset)

    return apiPaginated(list, {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
    })
  }
)

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
    checkHoneypot: true,
    schema: newsletterSubscribeSchema,
    auditConfig: (created) => ({
      domain: "CONTENT",
      actionType: "NEWSLETTER_SUBSCRIBED",
      entityType: "newsletter_subscribers",
      entityId: (created as { email?: string })?.email || "email",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const clean = sanitizeHoneypotFields(body)
    const email = clean.email!.toLowerCase().trim()

    const [existing] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1)

    if (existing) {
      if (existing.status !== "ACTIVE") {
        await db
          .update(newsletterSubscribers)
          .set({ status: "ACTIVE", unsubscribedAt: null })
          .where(eq(newsletterSubscribers.id, existing.id))
      }
      return apiSuccess({
        subscribed: true,
        email,
        message: "You are already subscribed to the newsletter.",
      })
    }

    const [created] = await db
      .insert(newsletterSubscribers)
      .values({
        email,
        source: clean.source || "BLOG_FOOTER",
        status: "ACTIVE",
      })
      .returning()

    if (!created) {
      throw new Error("Failed to create newsletter subscription.")
    }

    return apiCreated({
      subscribed: true,
      email: created.email,
      message: "Thank you for subscribing to our newsletter!",
      subscribedAt: created.subscribedAt,
    })
  }
)

export const DELETE = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
    schema: newsletterUnsubscribeSchema,
  },
  async (_, { body }) => {
    const email = body.email.toLowerCase().trim()

    const [existing] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1)

    if (!existing) {
      throw new NotFoundError(`Subscriber '${email}' not found.`)
    }

    await db
      .update(newsletterSubscribers)
      .set({
        status: "UNSUBSCRIBED",
        unsubscribedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.id, existing.id))

    return apiSuccess({
      unsubscribed: true,
      email,
      message: "You have been unsubscribed from the newsletter.",
    })
  }
)
