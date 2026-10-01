import { Container } from "@workspace/ui/components/layouts/container"

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-muted/60 ${className ?? ""}`}
      aria-hidden="true"
    />
  )
}

export default function RoadmapLoading() {
  return (
    <Container className="max-w-6xl py-10 sm:py-16">
      <div className="space-y-10 sm:space-y-12">
        <div className="space-y-6">
          <SkeletonBlock className="h-6 w-64 rounded-full" />

          <div className="space-y-3">
            <SkeletonBlock className="h-10 w-80 rounded-xl sm:h-12 sm:w-96" />
            <SkeletonBlock className="h-4 w-full max-w-xl rounded-md" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl border border-border/60 bg-card/50 p-4"
              >
                <SkeletonBlock className="h-3 w-28 rounded" />
                <SkeletonBlock className="mt-3 h-6 w-10 rounded" />
                <SkeletonBlock className="mt-2 h-2.5 w-32 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="h-24 rounded-2xl border border-border/60 bg-card/50 p-5">
          <SkeletonBlock className="h-8 w-64 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((col) => (
            <div
              key={col}
              className="space-y-4 rounded-2xl border border-border/80 bg-card/40 p-5"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <SkeletonBlock className="size-7 rounded-lg" />
                  <SkeletonBlock className="h-5 w-24 rounded" />
                </div>
                <SkeletonBlock className="h-4 w-8 rounded" />
              </div>

              <div className="space-y-3.5">
                {[1, 2, 3].map((card) => (
                  <div
                    key={card}
                    className="h-36 rounded-2xl border border-border/60 bg-card/60 p-5"
                  >
                    <SkeletonBlock className="h-4 w-28 rounded" />
                    <SkeletonBlock className="mt-3 h-5 w-48 rounded" />
                    <SkeletonBlock className="mt-2 h-3.5 w-full rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-64 rounded-2xl border border-border/80 bg-card/50 p-8" />
      </div>
    </Container>
  )
}
