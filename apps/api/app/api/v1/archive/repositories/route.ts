import { db, desc, eq, count, ilike, and } from "@workspace/db"
import { repositories } from "@workspace/db/schema"
import {
  createApiHandler,
  apiSuccess,
  apiCreated,
  apiPaginated,
} from "@/lib/api"
import {
  queryRepositoriesSchema,
  createRepositorySchema,
} from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (request) => {
    const url = new URL(request.url)
    const query = queryRepositoriesSchema.parse({
      page: url.searchParams.get("page") || 1,
      limit: url.searchParams.get("limit") || 10,
      search: url.searchParams.get("search") || undefined,
      category: url.searchParams.get("category") || undefined,
      isPublic: url.searchParams.get("isPublic") || undefined,
    })

    const conditions = []

    if (query.category) {
      conditions.push(eq(repositories.category, query.category))
    }

    if (query.isPublic !== undefined) {
      conditions.push(eq(repositories.isPublic, query.isPublic))
    }

    if (query.search) {
      conditions.push(ilike(repositories.name, `%${query.search}%`))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined
    const offset = (query.page - 1) * query.limit

    const [totalRecord] = await db
      .select({ value: count() })
      .from(repositories)
      .where(whereClause)

    const total = totalRecord?.value ?? 0
    const totalPages = Math.ceil(total / query.limit) || 1

    const list = await db
      .select()
      .from(repositories)
      .where(whereClause)
      .orderBy(desc(repositories.starsCount), desc(repositories.createdAt))
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
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createRepositorySchema,
    auditConfig: (created) => ({
      domain: "CODE_DOCS",
      actionType: "REPOSITORY_CREATED",
      entityType: "repositories",
      entityId: (created as any)?.id || "new",
      repoId: (created as any)?.id,
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const [created] = await db
      .insert(repositories)
      .values({
        ...body,
        updatedAt: new Date(),
      })
      .returning()

    return apiCreated(created)
  }
)
