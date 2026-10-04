import { db, eq, or } from "@workspace/db"
import { repositories, repoFiles } from "@workspace/db/schema"
import {
  createApiHandler,
  apiSuccess,
  apiCreated,
  NotFoundError,
} from "@/lib/api"
import { createRepoFileSchema } from "@/lib/validations"

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

    const files = await db
      .select()
      .from(repoFiles)
      .where(eq(repoFiles.repoId, repo.id))

    return apiSuccess(files)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createRepoFileSchema,
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
      .insert(repoFiles)
      .values({
        repoId: repo.id,
        ...body,
      })
      .returning()

    return apiCreated(created)
  }
)
