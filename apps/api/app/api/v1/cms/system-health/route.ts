import { sql, db } from "@workspace/db"
import { getStorageAdminClient, STORAGE_BUCKETS } from "@workspace/storage"
import { createApiHandler, apiSuccess } from "@/lib/api"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    // 1. Database Health & Latency
    let dbStatus: "OPERATIONAL" | "DEGRADED" | "DOWN" = "DOWN"
    let dbLatencyMs = 0
    let dbError: string | null = null

    const dbStart = Date.now()
    try {
      await db.execute(sql`SELECT 1`)
      dbStatus = "OPERATIONAL"
      dbLatencyMs = Date.now() - dbStart
    } catch (err: unknown) {
      dbStatus = "DOWN"
      dbLatencyMs = Date.now() - dbStart
      dbError = err instanceof Error ? err.message : String(err)
    }

    // 2. Storage Health
    let storageStatus: "OPERATIONAL" | "DEGRADED" | "DOWN" = "DOWN"
    let storageLatencyMs = 0
    let storageError: string | null = null
    const bucketList: string[] = []

    const storageStart = Date.now()
    try {
      const client = getStorageAdminClient()
      const { data, error } = await client.storage.listBuckets()
      storageLatencyMs = Date.now() - storageStart

      if (error) {
        storageStatus = "DEGRADED"
        storageError = error.message
      } else {
        storageStatus = "OPERATIONAL"
        if (data) {
          bucketList.push(...data.map((b) => b.name))
        }
      }
    } catch (err: unknown) {
      storageStatus = "DOWN"
      storageLatencyMs = Date.now() - storageStart
      storageError = err instanceof Error ? err.message : String(err)
    }

    // 3. Security & Env Audit
    const envAudit = {
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      supabaseConfigured: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.SUPABASE_SERVICE_ROLE_KEY
      ),
      authSecretConfigured: Boolean(
        process.env.CMS_SESSION_SECRET &&
        process.env.CMS_SESSION_SECRET.length >= 32
      ),
      revalidationSecretConfigured: Boolean(
        process.env.REVALIDATION_SECRET_TOKEN
      ),
      masterApiKeyConfigured: Boolean(process.env.API_MASTER_KEY),
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    }

    const overallStatus =
      dbStatus === "OPERATIONAL" && storageStatus === "OPERATIONAL"
        ? "HEALTHY"
        : "DEGRADED"

    return apiSuccess({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
          error: dbError,
        },
        storage: {
          status: storageStatus,
          latencyMs: storageLatencyMs,
          buckets: bucketList,
          expectedBuckets: Object.values(STORAGE_BUCKETS),
          error: storageError,
        },
      },
      environment: envAudit,
      process: {
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
      },
    })
  }
)
