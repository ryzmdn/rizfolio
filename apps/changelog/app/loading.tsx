import { Container } from "@workspace/ui/components/layouts/container"

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-muted/60 ${className ?? ""}`}
      aria-hidden="true"
    />
  )
}

export default function ChangelogLoading() {
  return (
    <Container className="max-w-6xl py-10 sm:py-16">
      <div className="space-y-10 sm:space-y-12">
        <div className="space-y-6">
          <SkeletonBlock className="h-6 w-56 rounded-full" />

          <div className="space-y-3">
            <SkeletonBlock className="h-10 w-80 rounded-xl sm:h-12 sm:w-96" />
            <SkeletonBlock className="h-4 w-full max-w-xl rounded-md" />
            <SkeletonBlock className="h-4 w-3/4 max-w-md rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl border border-border/60 bg-card/50 p-4"
              >
                <SkeletonBlock className="h-3 w-20 rounded" />
                <SkeletonBlock className="mt-3 h-6 w-12 rounded" />
                <SkeletonBlock className="mt-2 h-2.5 w-24 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="h-28 rounded-2xl border border-border/60 bg-card/50 p-5">
          <SkeletonBlock className="h-9 w-full rounded-xl" />
        </div>

        <div className="relative flex items-start gap-8">
          <div className="min-w-0 flex-1 space-y-8 pl-6 sm:pl-8">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="space-y-5 rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <SkeletonBlock className="h-6 w-16 rounded-md" />
                    <SkeletonBlock className="h-4 w-28 rounded-md" />
                  </div>
                  <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-6 w-20 rounded-md" />
                    <SkeletonBlock className="h-6 w-24 rounded-md" />
                  </div>
                </div>

                <div className="space-y-2">
                  <SkeletonBlock className="h-7 w-3/4 rounded-lg" />
                  <SkeletonBlock className="h-4 w-full rounded-md" />
                  <SkeletonBlock className="h-4 w-5/6 rounded-md" />
                </div>

                <div className="space-y-2.5 border-t border-border/50 pt-4">
                  <SkeletonBlock className="h-10 w-full rounded-xl" />
                  <SkeletonBlock className="h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>

          <aside className="sticky top-24 hidden h-80 w-64 shrink-0 rounded-2xl border border-border/60 bg-card/50 p-4 lg:block">
            <SkeletonBlock className="h-5 w-24 rounded" />
            <div className="mt-4 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBlock key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </Container>
  )
}
