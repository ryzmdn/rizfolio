import { db, count, sum, eq, desc } from "@workspace/db"
import {
  posts,
  inquiries,
  products,
  orders,
  repositories,
  changelogs,
  newsletterSubscribers,
  bioLinks,
  masterTransactions,
} from "@workspace/db/schema"
import { createApiHandler, apiSuccess } from "@/lib/api"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const safeCount = async (
      fn: () => Promise<Array<{ val: number | string | null }>>
    ): Promise<number> => {
      try {
        const res = await fn()
        return Number(res?.[0]?.val ?? 0)
      } catch {
        return 0
      }
    }

    const totalPosts = await safeCount(() =>
      db.select({ val: count() }).from(posts)
    )
    const publishedPosts = await safeCount(() =>
      db
        .select({ val: count() })
        .from(posts)
        .where(eq(posts.status, "PUBLISHED"))
    )

    const totalInquiries = await safeCount(() =>
      db.select({ val: count() }).from(inquiries)
    )
    const newInquiries = await safeCount(() =>
      db
        .select({ val: count() })
        .from(inquiries)
        .where(eq(inquiries.status, "NEW"))
    )

    const totalProducts = await safeCount(() =>
      db.select({ val: count() }).from(products)
    )
    const totalOrders = await safeCount(() =>
      db.select({ val: count() }).from(orders)
    )
    const totalRevenue = await safeCount(() =>
      db
        .select({ val: sum(orders.totalAmount) })
        .from(orders)
        .where(eq(orders.status, "PAID"))
    )

    const totalRepos = await safeCount(() =>
      db.select({ val: count() }).from(repositories)
    )
    const totalChangelogs = await safeCount(() =>
      db.select({ val: count() }).from(changelogs)
    )

    const totalSubscribers = await safeCount(() =>
      db
        .select({ val: count() })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.status, "ACTIVE"))
    )
    const totalBioLinks = await safeCount(() =>
      db.select({ val: count() }).from(bioLinks)
    )

    const recentActivity = await db
      .select()
      .from(masterTransactions)
      .orderBy(desc(masterTransactions.createdAt))
      .limit(8)
      .catch(() => [])

    return apiSuccess({
      metrics: {
        posts: {
          total: totalPosts,
          published: publishedPosts,
        },
        inquiries: {
          total: totalInquiries,
          new: newInquiries,
        },
        commerce: {
          products: totalProducts,
          orders: totalOrders,
          revenueIdr: totalRevenue,
        },
        archive: {
          repositories: totalRepos,
          changelogs: totalChangelogs,
        },
        audience: {
          subscribers: totalSubscribers,
          bioLinks: totalBioLinks,
        },
      },
      recentActivity,
    })
  }
)
