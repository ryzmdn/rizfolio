import React from "react"
import { Info, AlertTriangle, AlertCircle, Lightbulb } from "lucide-react"

export type CalloutType = "info" | "tip" | "warning" | "danger" | "note"

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
}

const calloutConfig: Record<
  CalloutType,
  {
    icon: React.ComponentType<{ className?: string }>
    borderClass: string
    bgClass: string
    titleClass: string
    iconClass: string
    defaultTitle: string
  }
> = {
  info: {
    icon: Info,
    borderClass: "border-sky-500/30 dark:border-sky-500/20",
    bgClass: "bg-sky-500/5 dark:bg-sky-500/10",
    titleClass: "text-sky-600 dark:text-sky-400",
    iconClass: "text-sky-500",
    defaultTitle: "Information",
  },
  tip: {
    icon: Lightbulb,
    borderClass: "border-emerald-500/30 dark:border-emerald-500/20",
    bgClass: "bg-emerald-500/5 dark:bg-emerald-500/10",
    titleClass: "text-emerald-600 dark:text-emerald-400",
    iconClass: "text-emerald-500",
    defaultTitle: "Tip & Recommendation",
  },
  warning: {
    icon: AlertTriangle,
    borderClass: "border-amber-500/30 dark:border-amber-500/20",
    bgClass: "bg-amber-500/5 dark:bg-amber-500/10",
    titleClass: "text-amber-600 dark:text-amber-400",
    iconClass: "text-amber-500",
    defaultTitle: "Warning",
  },
  danger: {
    icon: AlertCircle,
    borderClass: "border-rose-500/30 dark:border-rose-500/20",
    bgClass: "bg-rose-500/5 dark:bg-rose-500/10",
    titleClass: "text-rose-600 dark:text-rose-400",
    iconClass: "text-rose-500",
    defaultTitle: "Important / Caution",
  },
  note: {
    icon: Info,
    borderClass: "border-border/80",
    bgClass: "bg-muted/30",
    titleClass: "text-foreground font-medium",
    iconClass: "text-muted-foreground",
    defaultTitle: "Note",
  },
}

export function Callout({
  type = "note",
  title,
  children,
  className = "",
}: CalloutProps) {
  const config = calloutConfig[type] || calloutConfig.note
  const Icon = config.icon
  const displayTitle = title ?? config.defaultTitle

  return (
    <div
      role="alert"
      className={`my-6 overflow-hidden rounded-xl border p-4.5 text-sm transition-all sm:p-5 ${config.borderClass} ${config.bgClass} backdrop-blur-xs ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 size-4.5 shrink-0 ${config.iconClass}`} />
        <div className="flex-1 space-y-1.5">
          {displayTitle && (
            <h4
              className={`text-xs font-semibold tracking-wide uppercase ${config.titleClass}`}
            >
              {displayTitle}
            </h4>
          )}
          <div className="leading-relaxed text-foreground/90 [&>p]:leading-relaxed [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
