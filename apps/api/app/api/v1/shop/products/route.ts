import { db, desc, eq, count, ilike, and } from "@workspace/db"
import { products } from "@workspace/db/schema"
import { createApiHandler, apiCreated, apiPaginated } from "@/lib/api"
import { queryProductsSchema, createProductSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (request) => {
    const url = new URL(request.url)
    const query = queryProductsSchema.parse({
      page: url.searchParams.get("page") || 1,
      limit: url.searchParams.get("limit") || 10,
      search: url.searchParams.get("search") || undefined,
      isActive: url.searchParams.get("isActive") || undefined,
      productType: url.searchParams.get("productType") || undefined,
    })

    const conditions = []

    if (query.isActive !== undefined) {
      conditions.push(eq(products.isActive, query.isActive))
    }

    if (query.productType) {
      conditions.push(eq(products.productType, query.productType))
    }

    if (query.search) {
      conditions.push(ilike(products.title, `%${query.search}%`))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined
    const offset = (query.page - 1) * query.limit

    const [totalRecord] = await db
      .select({ value: count() })
      .from(products)
      .where(whereClause)

    const total = totalRecord?.value ?? 0
    const totalPages = Math.ceil(total / query.limit) || 1

    const productList = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(query.limit)
      .offset(offset)

    return apiPaginated(productList, {
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
    schema: createProductSchema,
    auditConfig: (created) => {
      const prod = created as { id?: string } | undefined
      return {
        domain: "COMMERCE",
        actionType: "PRODUCT_CREATED",
        entityType: "products",
        entityId: prod?.id || "new",
        productId: prod?.id,
        status: "COMPLETED",
      }
    },
  },
  async (_, { body }) => {
    const [created] = await db
      .insert(products)
      .values({
        ...body,
        updatedAt: new Date(),
      })
      .returning()

    return apiCreated(created)
  }
)
