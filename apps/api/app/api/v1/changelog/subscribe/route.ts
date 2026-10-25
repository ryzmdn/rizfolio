import { db, eq } from "@workspace/db"
import { changelogSubscribers } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { subscribeChangelogSchema } from "@/lib/validations"
import { randomUUID } from "crypto"
import { sendNewsletterWelcomeEmail } from "@workspace/email"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
    schema: subscribeChangelogSchema,
  },
  async (_, { body }) => {
    const email = body.email.toLowerCase().trim()

    const [existing] = await db
      .select()
      .from(changelogSubscribers)
      .where(eq(changelogSubscribers.email, email))
      .limit(1)

    if (existing) {
      if (!existing.isActive) {
        await db
          .update(changelogSubscribers)
          .set({ isActive: true })
          .where(eq(changelogSubscribers.id, existing.id))
      }
      return apiSuccess({ subscribed: true, email })
    }

    const unsubscribeToken = randomUUID()
    await db.insert(changelogSubscribers).values({
      email,
      unsubscribeToken,
      isActive: true,
    })

    try {
      await sendNewsletterWelcomeEmail({
        email,
        blogUrl:
          process.env.NEXT_PUBLIC_CHANGELOG_URL || "http://localhost:3003",
      })
    } catch {
    }

    return apiCreated({ subscribed: true, email })
  }
)
