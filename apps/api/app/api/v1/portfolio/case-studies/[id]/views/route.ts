import { db, eq, sql, or } from "@workspace/db"
import { caseStudies, caseStudyViews } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { createHash } from "crypto"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
  },
  async (req, { params }) => {
    const idOrSlug = String(params.id)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug
      )

    const [study] = await db
      .select({
        id: caseStudies.id,
        slug: caseStudies.slug,
        viewsCount: caseStudies.viewsCount,
      })
      .from(caseStudies)
      .where(
        isUuid
          ? or(eq(caseStudies.id, idOrSlug), eq(caseStudies.slug, idOrSlug))
          : eq(caseStudies.slug, idOrSlug)
      )
      .limit(1)

    if (!study) {
      throw new NotFoundError(`Case study '${idOrSlug}' not found.`)
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
      slug: study.slug,
      viewsCount: updated[0]?.viewsCount ?? study.viewsCount + 1,
    })
  }
)

