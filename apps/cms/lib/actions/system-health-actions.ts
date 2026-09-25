"use server"

import { db, sql } from "@workspace/db"
import { listFiles } from "@workspace/storage"

export interface ServiceHealthStatus {
  name: string
  status: "healthy" | "degraded" | "down"
  latencyMs: number
  message?: string
  details?: Record<string, unknown>
}

export interface EnvHealthCheck {
  variable: string
  isSet: boolean
  maskedValue?: string
}

export interface SystemHealthReport {
  overallStatus: "healthy" | "degraded" | "down"
  timestamp: string
  database: ServiceHealthStatus
  storage: ServiceHealthStatus
  environment: {
    status: "healthy" | "degraded" | "down"
    totalChecks: number
    passedChecks: number
    variables: EnvHealthCheck[]
  }
  runtime: {
    nodeVersion: string
    platform: string
    uptimeSeconds: number
    memory: {
      heapUsedMb: number
      heapTotalMb: number
      rssMb: number
    }
  }
}

function maskString(val?: string): string {
  if (!val) return "NOT CONFIGURED"
  if (val.length <= 8) return "********"
  return `${val.substring(0, 4)}...${val.substring(val.length - 4)}`
}

export async function runSystemHealthDiagnostics(): Promise<SystemHealthReport> {
  const t0Db = Date.now()
  let dbStatus: ServiceHealthStatus = {
    name: "PostgreSQL Database (Neon / Supabase)",
    status: "down",
    latencyMs: 0,
  }

  try {
    await db.execute(sql`SELECT 1`)
    const latency = Date.now() - t0Db
    dbStatus = {
      name: "PostgreSQL Database",
      status: latency < 1000 ? "healthy" : "degraded",
      latencyMs: latency,
      message: "Koneksi pool aktif dan query SELECT 1 berhasil dieksekusi.",
      details: {
        pool: "Active",
      },
    }
  } catch (err: unknown) {
    dbStatus = {
      name: "PostgreSQL Database",
      status: "down",
      latencyMs: Date.now() - t0Db,
      message: err instanceof Error ? err.message : "Gagal terhubung ke database.",
    }
  }

  const t0Storage = Date.now()
  let storageStatus: ServiceHealthStatus = {
    name: "Supabase Object Storage",
    status: "down",
    latencyMs: 0,
  }

  try {
    await listFiles({ bucket: "media", path: "", limit: 1 })
    const latency = Date.now() - t0Storage
    storageStatus = {
      name: "Supabase Object Storage",
      status: latency < 2000 ? "healthy" : "degraded",
      latencyMs: latency,
      message: "Bucket media berhasil diakses via Supabase Storage API.",
      details: {
        bucket: "media",
      },
    }
  } catch (err: unknown) {
    storageStatus = {
      name: "Supabase Object Storage",
      status: "down",
      latencyMs: Date.now() - t0Storage,
      message: err instanceof Error ? err.message : "Gagal mengakses bucket storage.",
    }
  }

  const monitoredEnvKeys = [
    "DATABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SESSION_SECRET",
    "CMS_OWNER_EMAIL",
  ]

  const envChecks: EnvHealthCheck[] = monitoredEnvKeys.map((key) => {
    const val = process.env[key]
    const isSet = Boolean(val && val.trim() !== "")
    return {
      variable: key,
      isSet,
      maskedValue: isSet ? maskString(val) : "Belum Dikonfigurasi",
    }
  })

  const passedEnvCount = envChecks.filter((c) => c.isSet).length
  const envStatus =
    passedEnvCount === monitoredEnvKeys.length
      ? "healthy"
      : passedEnvCount >= monitoredEnvKeys.length - 2
        ? "degraded"
        : "down"

  const mem = process.memoryUsage()
  const toMb = (bytes: number) => Math.round(bytes / 1024 / 1024)

  const overallStatus =
    dbStatus.status === "healthy" &&
    storageStatus.status === "healthy" &&
    envStatus === "healthy"
      ? "healthy"
      : dbStatus.status === "down"
        ? "down"
        : "degraded"

  return {
    overallStatus,
    timestamp: new Date().toISOString(),
    database: dbStatus,
    storage: storageStatus,
    environment: {
      status: envStatus,
      totalChecks: monitoredEnvKeys.length,
      passedChecks: passedEnvCount,
      variables: envChecks,
    },
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        heapUsedMb: toMb(mem.heapUsed),
        heapTotalMb: toMb(mem.heapTotal),
        rssMb: toMb(mem.rss),
      },
    },
  }
}
