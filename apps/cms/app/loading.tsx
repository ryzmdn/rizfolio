function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-muted/60 ${className ?? ""}`}
      aria-hidden="true"
    />
  )
}

export default function CmsLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="flex flex-col gap-3 border-b border-border/70 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-48 rounded-xl sm:w-64" />
          <SkeletonBlock className="h-4 w-72 rounded-md sm:w-96" />
        </div>
        <SkeletonBlock className="h-9 w-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex h-36 flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-6"
          >
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-3.5 w-24 rounded" />
              <SkeletonBlock className="size-7 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <SkeletonBlock className="h-8 w-16 rounded" />
              <SkeletonBlock className="h-3.5 w-28 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="h-80 rounded-2xl border border-border/60 bg-card/60 p-6 lg:col-span-7">
          <SkeletonBlock className="h-4 w-36 rounded" />
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBlock key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="h-80 rounded-2xl border border-border/60 bg-card/60 p-6 lg:col-span-5">
          <SkeletonBlock className="h-4 w-36 rounded" />
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBlock key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      <div className="h-64 rounded-2xl border border-border/60 bg-card/60 p-6">
        <SkeletonBlock className="h-5 w-44 rounded" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
