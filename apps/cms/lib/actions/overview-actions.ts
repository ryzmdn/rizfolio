"use server"

import {
  db,
  posts,
  products,
  orders,
  repositories,
  changelogs,
  masterTransactions,
  desc,
  sql,
} from "@workspace/db"
import { unstable_cache } from "next/cache"

export interface DashboardSummaryData {
  stats: {
    trxTotal: number
    trxSuccessRate: number
    postsTotal: number
    postsPublished: number
    productsTotal: number
    productsActive: number
    ordersTotal: number
    ordersPaid: number
    reposTotal: number
    reposPublic: number
    changelogsTotal: number
    changelogsPublished: number
  }
  recentTransactions: Array<{
    id: string
    trxNumber: string
    actionType: string
    domain: string
    entityType: string
    amount: number | null
    status: string
    createdAt: Date
  }>
}

async function fetchCmsDashboardSummary(): Promise<DashboardSummaryData> {
  try {
    // Single consolidated SQL aggregation + recent transaction fetch
    const [countsResult, recentTrxResult] = await Promise.all([
      db.execute(sql<{
        posts_total: number
        posts_published: number
        products_total: number
        products_active: number
        orders_total: number
        orders_paid: number
        repos_total: number
        repos_public: number
        changelogs_total: number
        changelogs_published: number
        trx_total: number
        trx_completed: number
      }>`
        SELECT
          (SELECT COUNT(*)::int FROM ${posts})                                              AS posts_total,
          (SELECT COUNT(*)::int FROM ${posts} WHERE status = 'PUBLISHED')                    AS posts_published,
          (SELECT COUNT(*)::int FROM ${products})                                           AS products_total,
          (SELECT COUNT(*)::int FROM ${products} WHERE is_active = true)                    AS products_active,
          (SELECT COUNT(*)::int FROM ${orders})                                             AS orders_total,
          (SELECT COUNT(*)::int FROM ${orders} WHERE status = 'PAID')                       AS orders_paid,
          (SELECT COUNT(*)::int FROM ${repositories})                                       AS repos_total,
          (SELECT COUNT(*)::int FROM ${repositories} WHERE is_public = true)                AS repos_public,
          (SELECT COUNT(*)::int FROM ${changelogs})                                         AS changelogs_total,
          (SELECT COUNT(*)::int FROM ${changelogs} WHERE is_published = true)               AS changelogs_published,
          (SELECT COUNT(*)::int FROM ${masterTransactions})                                 AS trx_total,
          (SELECT COUNT(*)::int FROM ${masterTransactions} WHERE status = 'COMPLETED')      AS trx_completed
      `),
      db
        .select({
          id: masterTransactions.id,
          trxNumber: masterTransactions.trxNumber,
          actionType: masterTransactions.actionType,
          domain: masterTransactions.domain,
          entityType: masterTransactions.entityType,
          amount: masterTransactions.amount,
          status: masterTransactions.status,
          createdAt: masterTransactions.createdAt,
        })
        .from(masterTransactions)
        .orderBy(desc(masterTransactions.createdAt))
        .limit(6),
    ])

    const row = (countsResult as unknown[])[0] as
      | {
          posts_total: number
          posts_published: number
          products_total: number
          products_active: number
          orders_total: number
          orders_paid: number
          repos_total: number
          repos_public: number
          changelogs_total: number
          changelogs_published: number
          trx_total: number
          trx_completed: number
        }
      | undefined

    const trxTotal = row?.trx_total ?? 0
    const trxCompleted = row?.trx_completed ?? 0

    return {
      stats: {
        trxTotal,
        trxSuccessRate:
          trxTotal > 0 ? Math.round((trxCompleted / trxTotal) * 100) : 100,
        postsTotal: row?.posts_total ?? 0,
        postsPublished: row?.posts_published ?? 0,
        productsTotal: row?.products_total ?? 0,
        productsActive: row?.products_active ?? 0,
        ordersTotal: row?.orders_total ?? 0,
        ordersPaid: row?.orders_paid ?? 0,
        reposTotal: row?.repos_total ?? 0,
        reposPublic: row?.repos_public ?? 0,
        changelogsTotal: row?.changelogs_total ?? 0,
        changelogsPublished: row?.changelogs_published ?? 0,
      },
      recentTransactions: recentTrxResult,
    }
  } catch (error) {
    console.error(
      "[CMS Overview] Error fetching consolidated dashboard summary:",
      error instanceof Error ? error.message : error
    )
    return {
      stats: {
        trxTotal: 0,
        trxSuccessRate: 100,
        postsTotal: 0,
        postsPublished: 0,
        productsTotal: 0,
        productsActive: 0,
        ordersTotal: 0,
        ordersPaid: 0,
        reposTotal: 0,
        reposPublic: 0,
        changelogsTotal: 0,
        changelogsPublished: 0,
      },
      recentTransactions: [],
    }
  }
}

export const getCachedCmsDashboardSummary = unstable_cache(
  fetchCmsDashboardSummary,
  ["cms-dashboard-summary"],
  {
    revalidate: 15,
    tags: ["cms-overview-stats"],
  }
)
