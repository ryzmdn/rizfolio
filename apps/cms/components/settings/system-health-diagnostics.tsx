"use client"

import { useState, useEffect } from "react"
import {
  Database,
  HardDrive,
  ShieldCheck,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Server,
  Key,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  runSystemHealthDiagnostics,
  type SystemHealthReport,
} from "@/lib/actions/system-health-actions"

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h} jam ${m} mnt`
  if (m > 0) return `${m} mnt ${s} dtk`
  return `${s} detik`
}

export function SystemHealthDiagnostics() {
  const [report, setReport] = useState<SystemHealthReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function handleRefresh() {
    setIsLoading(true)
    try {
      const data = await runSystemHealthDiagnostics()
      setReport(data)
    } catch (err) {
      console.error("[System Health Diagnostics]", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    runSystemHealthDiagnostics()
      .then((data) => {
        if (isMounted) {
          setReport(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.error("[System Health Diagnostics]", err)
        if (isMounted) {
          setIsLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-5 rounded-xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Diagnostik Infrastruktur & Kesehatan Sistem
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pemantauan langsung status basis data PostgreSQL, Supabase CDN, variabel lingkungan, dan konsumsi memori runtime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {report?.timestamp && (
            <span className="text-[11px] text-muted-foreground hidden sm:inline-block">
              Diperiksa: {new Date(report.timestamp).toLocaleTimeString("id-ID")}
            </span>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Diagnostik Ulang</span>
          </button>
        </div>
      </div>

      {report && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 ${
            report.overallStatus === "healthy"
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
              : report.overallStatus === "degraded"
                ? "border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400"
                : "border-destructive/20 bg-destructive/5 text-destructive"
          }`}
        >
          <div className="flex items-center gap-3">
            {report.overallStatus === "healthy" && (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            )}
            {report.overallStatus === "degraded" && (
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            )}
            {report.overallStatus === "down" && (
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
            )}
            <div>
              <p className="text-xs font-semibold">
                {report.overallStatus === "healthy"
                  ? "Semua Layanan Beroperasi Normal"
                  : report.overallStatus === "degraded"
                    ? "Kinerja Layanan Mengalami Degradasi Latensi"
                    : "Gangguan Kritis Terdeteksi pada Infrastruktur"}
              </p>
              <p className="text-[11px] opacity-80">
                Pemeriksaan koneksi basis data, objek penyimpanan, dan verifikasi kredensial produksi.
              </p>
            </div>
          </div>

          <Badge
            variant={
              report.overallStatus === "healthy"
                ? "default"
                : report.overallStatus === "degraded"
                  ? "secondary"
                  : "destructive"
            }
            className="text-[10px] font-bold uppercase tracking-wider"
          >
            {report.overallStatus}
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              PostgreSQL DB
            </span>
            <Database className="h-4 w-4 text-primary" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  report?.database.status === "healthy"
                    ? "default"
                    : report?.database.status === "degraded"
                      ? "secondary"
                      : "destructive"
                }
                className="text-[10px]"
              >
                {report?.database.status === "healthy"
                  ? "Terhubung"
                  : report?.database.status === "degraded"
                    ? "Latensi Tinggi"
                    : "Terputus"}
              </Badge>
              <span className="font-mono text-xs font-semibold text-foreground">
                {report?.database.latencyMs ?? 0} ms
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2 pt-1">
              {report?.database.message || "Menunggu hasil diagnostik..."}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Supabase Storage
            </span>
            <HardDrive className="h-4 w-4 text-blue-500" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  report?.storage.status === "healthy"
                    ? "default"
                    : report?.storage.status === "degraded"
                      ? "secondary"
                      : "destructive"
                }
                className="text-[10px]"
              >
                {report?.storage.status === "healthy"
                  ? "Dapat Diakses"
                  : report?.storage.status === "degraded"
                    ? "Lambat"
                    : "Tidak Aktif"}
              </Badge>
              <span className="font-mono text-xs font-semibold text-foreground">
                {report?.storage.latencyMs ?? 0} ms
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2 pt-1">
              {report?.storage.message || "Menunggu hasil diagnostik..."}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Konfigurasi ENV
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  report?.environment.status === "healthy"
                    ? "default"
                    : "destructive"
                }
                className="text-[10px]"
              >
                {report?.environment.passedChecks ?? 0}/
                {report?.environment.totalChecks ?? 0} Terpasang
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">
                Audit Trail
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Kunci database, token Supabase, dan rahasia enkripsi sesi.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Node Runtime & RAM
            </span>
            <Cpu className="h-4 w-4 text-amber-500" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-foreground">
                Heap: {report?.runtime.memory.heapUsedMb ?? 0} MB
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                RSS: {report?.runtime.memory.rssMb ?? 0} MB
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                Uptime: {formatUptime(report?.runtime.uptimeSeconds ?? 0)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {report?.environment.variables && (
        <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5" />
            <span>Audit Variabel Lingkungan Produksi</span>
          </h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {report.environment.variables.map((env) => (
              <div
                key={env.variable}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {env.isSet ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                  )}
                  <span className="font-mono text-[11px] font-medium text-foreground truncate">
                    {env.variable}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                  {env.maskedValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
