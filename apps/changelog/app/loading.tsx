import { Container } from "@workspace/ui/components/layouts/container"

export default function ChangelogLoading() {
  return (
    <Container className="max-w-6xl py-10 sm:py-16">
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="h-6 w-56 animate-pulse rounded-full border border-border/60 bg-muted/60" />

          <div className="space-y-3">
            <div className="h-10 w-80 animate-pulse rounded-xl bg-muted/60 sm:h-12 sm:w-96" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded-lg bg-muted/60" />
            <div className="h-4 w-3/4 max-w-md animate-pulse rounded-lg bg-muted/60" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl border border-border/60 bg-card/50 p-4"
              >
                <div className="h-3 w-20 rounded-md bg-muted/60" />
                <div className="mt-3 h-6 w-12 rounded-md bg-muted/60" />
                <div className="mt-2 h-2.5 w-24 rounded-md bg-muted/60" />
              </div>
            ))}
          </div>
        </div>

        <div className="h-28 animate-pulse rounded-2xl border border-border/60 bg-card/50 p-5" />

        <div className="relative flex items-start gap-8">
          <div className="min-w-0 flex-1 space-y-8 pl-6 sm:pl-8">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="space-y-5 rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-6 w-16 animate-pulse rounded-md bg-muted/60" />
                    <div className="h-4 w-28 animate-pulse rounded-md bg-muted/60" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-20 animate-pulse rounded-md bg-muted/60" />
                    <div className="h-6 w-24 animate-pulse rounded-md bg-muted/60" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-7 w-3/4 animate-pulse rounded-lg bg-muted/60" />
                  <div className="h-4 w-full animate-pulse rounded-md bg-muted/60" />
                  <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted/60" />
                </div>

                <div className="space-y-2.5 pt-4 border-t border-border/50">
                  <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40" />
                </div>
              </div>
            ))}
          </div>

          <aside className="sticky top-24 hidden h-80 w-64 shrink-0 animate-pulse rounded-2xl border border-border/60 bg-card/50 p-4 lg:block" />
        </div>
      </div>
    </Container>
  )
}
