import { db, desc, eq, count } from "@workspace/db"
import { inquiries } from "@workspace/db/schema"
import { createApiHandler, apiCreated, apiPaginated } from "@/lib/api"
import { createInquirySchema, paginationQuerySchema } from "@/lib/validations"
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

    const statusFilter = url.searchParams.get("status")

    const offset = (query.page - 1) * query.limit

    const baseWhere = statusFilter
      ? eq(inquiries.status, statusFilter)
      : undefined

    const [totalRecord] = await db
      .select({ value: count() })
      .from(inquiries)
      .where(baseWhere)

    const total = totalRecord?.value ?? 0
    const totalPages = Math.ceil(total / query.limit) || 1

    const items = await db
      .select()
      .from(inquiries)
      .where(baseWhere)
      .orderBy(desc(inquiries.createdAt))
      .limit(query.limit)
      .offset(offset)

    return apiPaginated(items, {
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
    schema: createInquirySchema,
    auditConfig: (created) => ({
      domain: "PORTFOLIO",
      actionType: "INQUIRY_RECEIVED",
      entityType: "inquiries",
      entityId: (created as { id?: string })?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const cleanPayload = sanitizeHoneypotFields(body)

    const [created] = await db
      .insert(inquiries)
      .values({
        name: cleanPayload.name!,
        email: cleanPayload.email!,
        subject: cleanPayload.subject,
        message: cleanPayload.message!,
        projectScope: cleanPayload.projectScope,
        budgetRange: cleanPayload.budgetRange,
        status: "NEW",
      })
      .returning()

    if (!created) {
      throw new Error("Failed to persist inquiry to database.")
    }

    return apiCreated({
      id: created.id,
      name: created.name,
      message: "Thank you for reaching out! Your inquiry has been received.",
      createdAt: created.createdAt,
    })
  }
)
