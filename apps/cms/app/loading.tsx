import React from "react"

export default function CmsLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-3 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-muted/60" />
          <div className="h-4 w-72 rounded-md bg-muted/40" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-muted/50" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex h-32 flex-col justify-between rounded-xl border border-border/60 bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-muted/60" />
              <div className="size-4 rounded bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <div className="h-7 w-16 rounded bg-muted/70" />
              <div className="h-3 w-28 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
        <div className="h-5 w-36 rounded bg-muted/60" />
        <div className="space-y-3 pt-2">
          <div className="h-10 w-full rounded-lg bg-muted/40" />
          <div className="h-10 w-full rounded-lg bg-muted/40" />
          <div className="h-24 w-full rounded-lg bg-muted/30" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <div className="border-b border-border/60 bg-muted/30 p-4">
          <div className="h-4 w-32 rounded bg-muted/60" />
        </div>
        <div className="space-y-3 divide-y divide-border/40 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <div className="h-4 w-44 rounded bg-muted/60" />
                <div className="h-3 w-28 rounded bg-muted/40" />
              </div>
              <div className="h-7 w-16 rounded-md bg-muted/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
