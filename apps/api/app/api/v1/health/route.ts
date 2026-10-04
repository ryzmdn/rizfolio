import { sql } from "@workspace/db"
import { db } from "@workspace/db"
import { createApiHandler, apiSuccess } from "@/lib/api"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    let dbStatus: "healthy" | "unhealthy" = "unhealthy"
    let dbLatencyMs = 0

    const dbStart = Date.now()
    try {
      await db.execute(sql`SELECT 1`)
      dbStatus = "healthy"
      dbLatencyMs = Date.now() - dbStart
    } catch (err: unknown) {
      dbStatus = "unhealthy"
      dbLatencyMs = Date.now() - dbStart
      console.error("[Healthcheck] Database check error:", err)
    }

    const memory = process.memoryUsage()

    return apiSuccess({
      status: dbStatus === "healthy" ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      services: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
      },
      system: {
        nodeVersion: process.version,
        memoryUsageMb: {
          rss: Math.round(memory.rss / 1024 / 1024),
          heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
        },
      },
    })
  }
)
