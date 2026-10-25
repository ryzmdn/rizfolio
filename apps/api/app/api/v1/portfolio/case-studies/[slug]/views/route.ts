import { db, eq, sql } from "@workspace/db"
import { caseStudies, caseStudyViews } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { createHash } from "crypto"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
  },
  async (req, { params }) => {
    const slug = String(params.slug)

    const [study] = await db
      .select({ id: caseStudies.id, viewsCount: caseStudies.viewsCount })
      .from(caseStudies)
      .where(eq(caseStudies.slug, slug))
      .limit(1)

    if (!study) {
      throw new NotFoundError(`Case study with slug '${slug}' not found.`)
    }

    const userAgent = req.headers.get("user-agent") || null
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

    const [updated] = await Promise.all([
      db
        .update(caseStudies)
        .set({
          viewsCount: sql`${caseStudies.viewsCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(caseStudies.id, study.id))
        .returning({ viewsCount: caseStudies.viewsCount }),
      db.insert(caseStudyViews).values({
        caseStudyId: study.id,
        ipHash,
        userAgent,
      }),
    ])

    return apiSuccess({
      slug,
      viewsCount: updated[0]?.viewsCount ?? study.viewsCount + 1,
    })
  }
)
