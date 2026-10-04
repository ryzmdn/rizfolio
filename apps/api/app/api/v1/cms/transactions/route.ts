import { db, desc, eq, count, and, gte, lte } from "@workspace/db"
import { masterTransactions } from "@workspace/db/schema"
import { createApiHandler, apiPaginated } from "@/lib/api"
import { queryTransactionsSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_READ",
  },
  async (request) => {
    const url = new URL(request.url)
    const query = queryTransactionsSchema.parse({
      page: url.searchParams.get("page") || 1,
      limit: url.searchParams.get("limit") || 10,
      domain: url.searchParams.get("domain") || undefined,
      status: url.searchParams.get("status") || undefined,
      actorType: url.searchParams.get("actorType") || undefined,
      entityType: url.searchParams.get("entityType") || undefined,
      startDate: url.searchParams.get("startDate") || undefined,
      endDate: url.searchParams.get("endDate") || undefined,
    })

    const conditions = []

    if (query.domain) {
      conditions.push(eq(masterTransactions.domain, query.domain))
    }

    if (query.status) {
      conditions.push(eq(masterTransactions.status, query.status))
    }

    if (query.actorType) {
      conditions.push(eq(masterTransactions.actorType, query.actorType))
    }

    if (query.entityType) {
      conditions.push(eq(masterTransactions.entityType, query.entityType))
    }

    if (query.startDate) {
      conditions.push(gte(masterTransactions.createdAt, new Date(query.startDate)))
    }

    if (query.endDate) {
      conditions.push(lte(masterTransactions.createdAt, new Date(query.endDate)))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined
    const offset = (query.page - 1) * query.limit

    const [totalRecord] = await db
      .select({ value: count() })
      .from(masterTransactions)
      .where(whereClause)

    const total = totalRecord?.value ?? 0
    const totalPages = Math.ceil(total / query.limit) || 1

    const list = await db
      .select()
      .from(masterTransactions)
      .where(whereClause)
      .orderBy(desc(masterTransactions.createdAt))
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
