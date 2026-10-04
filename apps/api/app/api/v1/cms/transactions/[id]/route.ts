import { db, eq, or } from "@workspace/db"
import { masterTransactions } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const idOrTrx = String(params.id)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrTrx
      )

    const [trx] = await db
      .select()
      .from(masterTransactions)
      .where(
        isUuid
          ? or(
              eq(masterTransactions.id, idOrTrx),
              eq(masterTransactions.trxNumber, idOrTrx)
            )
          : eq(masterTransactions.trxNumber, idOrTrx)
      )
      .limit(1)

    if (!trx) {
      throw new NotFoundError(`Transaction '${idOrTrx}' not found.`)
    }

    return apiSuccess(trx)
  }
)
