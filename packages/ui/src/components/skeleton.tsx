import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean
}

export function Skeleton({
  shimmer = true,
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-2xl bg-foreground/[0.04]",
        shimmer ? "shimmer-effect" : "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export interface DotsLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function DotsLoader({
  size = "md",
  className,
  ...props
}: DotsLoaderProps) {
  const sizeClasses = {
    sm: "size-1.5",
    md: "size-2",
    lg: "size-2.5",
  }

  return (
    <div
      aria-label="Loading"
      role="status"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      <span
        className={cn(
          "rounded-full bg-foreground/60 animate-pulse",
          sizeClasses[size]
        )}
      />
      <span
        style={{ animationDelay: "150ms" }}
        className={cn(
          "rounded-full bg-foreground/60 animate-pulse",
          sizeClasses[size]
        )}
      />
      <span
        style={{ animationDelay: "300ms" }}
        className={cn(
          "rounded-full bg-foreground/60 animate-pulse",
          sizeClasses[size]
        )}
      />
    </div>
  )
}

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
}

export function ProgressBar({
  value,
  max = 100,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-foreground/10",
        className
      )}
      {...props}
    >
      <div
        style={{ width: `${percentage}%` }}
        className="h-full bg-foreground transition-all duration-500 ease-luxury"
      />
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-3xl border border-foreground/8 bg-card/40 p-6 space-y-4 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded-xl" />
      <Skeleton className="h-4 w-full rounded-lg" />
      <Skeleton className="h-4 w-5/6 rounded-lg" />
      <div className="pt-2 flex items-center gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  )
}

