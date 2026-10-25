import { db, eq, sql } from "@workspace/db"
import { bioLinks, bioLinkClicks } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { createHash } from "crypto"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
  },
  async (req, { params }) => {
    const id = String(params.id)

    const [updated] = await db
      .update(bioLinks)
      .set({
        clickCount: sql`${bioLinks.clickCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(bioLinks.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Bio link with ID '${id}' not found.`)
    }

    const userAgent = req.headers.get("user-agent") || null
    const referrer = req.headers.get("referer") || null
    const forwardedFor = req.headers.get("x-forwarded-for")
    const realIp = req.headers.get("x-real-ip")
    const cfIp = req.headers.get("cf-connecting-ip")
    const rawIp = forwardedFor
      ? forwardedFor.split(",")[0]?.trim() || null
      : realIp
        ? realIp.trim()
        : cfIp
          ? cfIp.trim()
          : null
    const ipHash = rawIp
      ? createHash("sha256").update(rawIp).digest("hex")
      : null

    await db.insert(bioLinkClicks).values({
      linkId: id,
      referrer,
      userAgent,
      ipHash,
    })

    return apiSuccess({
      id: updated.id,
      clickCount: updated.clickCount,
    })
  }
)
