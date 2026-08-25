import React from "react"
import { TrendingUp, ArrowUpRight, CheckCircle, Zap } from "lucide-react"

interface MetricCardProps {
  value: string
  label: string
  description?: string
  trend?: string
  icon?: "trending" | "zap" | "check"
  className?: string
}

export function MetricCard({
  value,
  label,
  description,
  trend,
  icon = "zap",
  className = "",
}: MetricCardProps) {
  const IconComponent =
    icon === "trending" ? TrendingUp : icon === "check" ? CheckCircle : Zap

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs transition-all hover:border-border hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <IconComponent className="size-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {value}
        </span>
        {trend && (
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-500">
            <ArrowUpRight className="size-3.5" />
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}

interface MetricGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function MetricGrid({
  children,
  columns = 3,
  className = "",
}: MetricGridProps) {
  const colClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 4
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <div className={`my-6 grid gap-4 ${colClass} ${className}`}>{children}</div>
  )
}
