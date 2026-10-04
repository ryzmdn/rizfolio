import { db, eq, or, desc } from "@workspace/db"
import { repositories, repoReleases } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated, NotFoundError } from "@/lib/api"
import { createRepoReleaseSchema } from "@/lib/validations"

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

    const [repo] = await db
      .select({ id: repositories.id })
      .from(repositories)
      .where(
        isUuid
          ? or(eq(repositories.id, slugOrId), eq(repositories.slug, slugOrId))
          : eq(repositories.slug, slugOrId)
      )
      .limit(1)

    if (!repo) {
      throw new NotFoundError(`Repository '${slugOrId}' not found.`)
    }

    const releases = await db
      .select()
      .from(repoReleases)
      .where(eq(repoReleases.repoId, repo.id))
      .orderBy(desc(repoReleases.createdAt))

    return apiSuccess(releases)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createRepoReleaseSchema,
    auditConfig: (created, { params }) => ({
      domain: "CODE_DOCS",
      actionType: "RELEASE_PUBLISHED",
      entityType: "repo_releases",
      entityId: (created as any)?.id || "release",
      repoId: String(params.slug),
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const slugOrId = String(params.slug)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      )

    const [repo] = await db
      .select({ id: repositories.id })
      .from(repositories)
      .where(
        isUuid
          ? or(eq(repositories.id, slugOrId), eq(repositories.slug, slugOrId))
          : eq(repositories.slug, slugOrId)
      )
      .limit(1)

    if (!repo) {
      throw new NotFoundError(`Repository '${slugOrId}' not found.`)
    }

    const [created] = await db
      .insert(repoReleases)
      .values({
        repoId: repo.id,
        ...body,
      })
      .returning()

    return apiCreated(created)
  }
)
