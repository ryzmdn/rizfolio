export default function LinkBioLoading() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="h-44 w-full animate-pulse rounded-2xl border border-border/60 bg-muted/40 sm:h-52" />

        <div className="relative -mt-16 px-2 sm:-mt-20 sm:px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="size-24 animate-pulse rounded-full bg-muted/70 ring-4 ring-background sm:size-28" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-6 w-44 animate-pulse rounded-md bg-muted/70" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-muted/50" />
            <div className="h-3.5 w-full max-w-md animate-pulse rounded-md bg-muted/40" />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="flex h-16 w-full animate-pulse items-center gap-4 rounded-xl border border-border/50 bg-muted/20 px-4"
            >
              <div className="size-8 rounded-lg bg-muted/50" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded-md bg-muted/60" />
                <div className="h-3 w-48 rounded-md bg-muted/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
