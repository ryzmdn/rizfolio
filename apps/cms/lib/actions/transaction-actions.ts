"use server"

import {
  db,
  masterTransactions,
  desc,
  eq,
  and,
  or,
  ilike,
  sql,
  type MasterTransaction,
  type InsertMasterTransactionInput,
  insertMasterTransactionSchema,
} from "@workspace/db"

function generateTrxNumber(domain: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase()
  const domainPrefix = domain.substring(0, 3).toUpperCase()
  return `TRX-${domainPrefix}-${year}${month}-${randomHex}`
}

export async function recordTransaction(
  input: InsertMasterTransactionInput
): Promise<{ success: boolean; trxNumber?: string; id?: string }> {
  try {
    const validated = insertMasterTransactionSchema.parse(input)
    const trxNumber = validated.trxNumber || generateTrxNumber(validated.domain)

    const [inserted] = await db
      .insert(masterTransactions)
      .values({
        trxNumber,
        domain: validated.domain,
        actionType: validated.actionType,
        status: validated.status || "COMPLETED",
        actorId: validated.actorId || null,
        actorType: validated.actorType || "SYSTEM",
        entityType: validated.entityType,
        entityId: validated.entityId,
        orderId: validated.orderId || null,
        productId: validated.productId || null,
        postId: validated.postId || null,
        repoId: validated.repoId || null,
        caseStudyId: validated.caseStudyId || null,
        changelogId: validated.changelogId || null,
        amount: validated.amount ?? 0,
        currency: validated.currency || "IDR",
        payloadBefore: validated.payloadBefore || null,
        payloadAfter: validated.payloadAfter || null,
        clientIp: validated.clientIp || null,
        userAgent: validated.userAgent || null,
        traceId: validated.traceId || null,
        metadata: validated.metadata || {},
      })
      .returning({
        id: masterTransactions.id,
        trxNumber: masterTransactions.trxNumber,
      })

    return { success: true, id: inserted?.id, trxNumber: inserted?.trxNumber }
  } catch (error) {
    console.warn(
      "[Master Transactions] Failed to record transaction:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return { success: false }
  }
}

export async function logTransaction(input: InsertMasterTransactionInput) {
  void recordTransaction(input).catch((err) => {
    console.warn("[Master Transactions] Background log failed:", err)
  })
}

export interface GetTransactionsParams {
  domain?: string
  status?: string
  search?: string
  limit?: number
  offset?: number
}

export async function getMasterTransactions(
  params: GetTransactionsParams = {}
): Promise<{
  items: MasterTransaction[]
  total: number
}> {
  try {
    const limit = params.limit || 50
    const offset = params.offset || 0

    const conditions = []

    if (params.domain && params.domain !== "ALL") {
      conditions.push(eq(masterTransactions.domain, params.domain))
    }

    if (params.status && params.status !== "ALL") {
      conditions.push(eq(masterTransactions.status, params.status))
    }

    if (params.search && params.search.trim()) {
      const term = `%${params.search.trim()}%`
      conditions.push(
        or(
          ilike(masterTransactions.trxNumber, term),
          ilike(masterTransactions.actionType, term),
          ilike(masterTransactions.entityType, term),
          ilike(masterTransactions.entityId, term)
        )
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [items, countResult] = await Promise.all([
      db
        .select({
          id: masterTransactions.id,
          trxNumber: masterTransactions.trxNumber,
          domain: masterTransactions.domain,
          actionType: masterTransactions.actionType,
          entityType: masterTransactions.entityType,
          entityId: masterTransactions.entityId,
          actorType: masterTransactions.actorType,
          amount: masterTransactions.amount,
          currency: masterTransactions.currency,
          status: masterTransactions.status,
          createdAt: masterTransactions.createdAt,
        })
        .from(masterTransactions)
        .where(whereClause)
        .orderBy(desc(masterTransactions.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(masterTransactions)
        .where(whereClause),
    ])

    return {
      items: items as unknown as MasterTransaction[],
      total: countResult[0]?.count || 0,
    }
  } catch (error) {
    console.error(
      "[CMS Transactions] Error fetching master transactions:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return { items: [], total: 0 }
  }
}

export async function getMasterTransactionStats() {
  try {
    const [statsRow, recentItems] = await Promise.all([
      db.execute(
        sql<{
          total: number
          completed: number
          commerce_volume: number
        }>`
          SELECT
            COUNT(*)::int                                                       AS total,
            COUNT(*) FILTER (WHERE status = 'COMPLETED')::int                  AS completed,
            COALESCE(SUM(amount) FILTER (
              WHERE domain = 'COMMERCE' AND status = 'COMPLETED'
            ), 0)::int                                                          AS commerce_volume
          FROM ${masterTransactions}
        `
      ),
      db
        .select()
        .from(masterTransactions)
        .orderBy(desc(masterTransactions.createdAt))
        .limit(6),
    ])

    const row = (statsRow as unknown[])[0] as
      | {
          total: number
          completed: number
          commerce_volume: number
        }
      | undefined

    const total = row?.total ?? 0
    const completed = row?.completed ?? 0
    const commerceVolume = row?.commerce_volume ?? 0

    return {
      total,
      completed,
      successRate: total > 0 ? Math.round((completed / total) * 100) : 100,
      commerceVolume,
      recentItems,
    }
  } catch (error) {
    console.error(
      "[CMS Transactions] Error fetching stats:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return {
      total: 0,
      completed: 0,
      successRate: 100,
      commerceVolume: 0,
      recentItems: [],
    }
  }
}
