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
    // 1. Posts count
    const [postsRec] = await db.select({ val: count() }).from(posts)
    const [publishedPostsRec] = await db
      .select({ val: count() })
      .from(posts)
      .where(eq(posts.status, "PUBLISHED"))

    // 2. Inquiries count
    const [inquiriesRec] = await db.select({ val: count() }).from(inquiries)
    const [newInquiriesRec] = await db
      .select({ val: count() })
      .from(inquiries)
      .where(eq(inquiries.status, "NEW"))

    // 3. Products & Orders
    const [productsRec] = await db.select({ val: count() }).from(products)
    const [ordersRec] = await db.select({ val: count() }).from(orders)
    const [revenueRec] = await db
      .select({ val: sum(orders.totalAmount) })
      .from(orders)
      .where(eq(orders.status, "PAID"))

    // 4. Repositories & Releases
    const [reposRec] = await db.select({ val: count() }).from(repositories)
    const [changelogsRec] = await db.select({ val: count() }).from(changelogs)

    // 5. Subscribers & Bio links
    const [subscribersRec] = await db
      .select({ val: count() })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, "ACTIVE"))
    const [bioLinksRec] = await db.select({ val: count() }).from(bioLinks)

    // 6. Recent activity
    const recentActivity = await db
      .select()
      .from(masterTransactions)
      .orderBy(desc(masterTransactions.createdAt))
      .limit(8)

    return apiSuccess({
      metrics: {
        posts: {
          total: postsRec?.val ?? 0,
          published: publishedPostsRec?.val ?? 0,
        },
        inquiries: {
          total: inquiriesRec?.val ?? 0,
          new: newInquiriesRec?.val ?? 0,
        },
        commerce: {
          products: productsRec?.val ?? 0,
          orders: ordersRec?.val ?? 0,
          revenueIdr: Number(revenueRec?.val ?? 0),
        },
        archive: {
          repositories: reposRec?.val ?? 0,
          changelogs: changelogsRec?.val ?? 0,
        },
        audience: {
          subscribers: subscribersRec?.val ?? 0,
          bioLinks: bioLinksRec?.val ?? 0,
        },
      },
      recentActivity,
    })
  }
)
