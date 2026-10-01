import { Container } from "@workspace/ui/components/layouts/container"

export default function ShopLoading() {
  return (
    <div className="space-y-16 pt-10 pb-20 sm:space-y-20">
      <section className="space-y-10">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <div className="mx-auto h-10 w-full max-w-xl animate-pulse rounded-lg bg-muted/80 sm:h-12" />
            <div className="mx-auto space-y-2">
              <div className="mx-auto h-4 w-full max-w-lg animate-pulse rounded-md bg-muted/50" />
              <div className="mx-auto h-4 w-3/4 max-w-md animate-pulse rounded-md bg-muted/40" />
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <div className="h-9 w-36 animate-pulse rounded-md bg-muted/70" />
              <div className="h-9 w-36 animate-pulse rounded-md bg-muted/50" />
            </div>
          </div>
        </Container>

        <Container>
          <div className="grid grid-cols-2 divide-y divide-border/60 rounded-lg border border-border/60 bg-muted/20 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5 p-4 sm:p-5">
                <div className="h-7 w-16 animate-pulse rounded-md bg-muted/70 sm:h-8" />
                <div className="h-3.5 w-24 animate-pulse rounded-sm bg-muted/50" />
                <div className="h-3 w-32 animate-pulse rounded-sm bg-muted/40" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-5"
              >
                <div className="size-8 animate-pulse rounded-md bg-muted/70" />
                <div className="h-4 w-36 animate-pulse rounded-md bg-muted/60" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full animate-pulse rounded-sm bg-muted/40" />
                  <div className="h-3 w-4/5 animate-pulse rounded-sm bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="space-y-8">
        <Container className="space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded-md bg-muted/70" />
            <div className="h-4 w-72 animate-pulse rounded-sm bg-muted/40" />
          </div>

          <div className="space-y-4">
            <div className="h-12 w-full animate-pulse rounded-lg border border-border/60 bg-muted/20" />
            <div className="flex gap-2 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-7 w-20 shrink-0 animate-pulse rounded-md bg-muted/50"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="space-y-4 rounded-lg border border-border/70 bg-card p-5"
              >
                <div className="aspect-video w-full animate-pulse rounded-md bg-muted/60" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 animate-pulse rounded-sm bg-muted/50" />
                  <div className="h-4 w-24 animate-pulse rounded-sm bg-muted/70" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 w-4/5 animate-pulse rounded-sm bg-muted/60" />
                  <div className="h-3 w-full animate-pulse rounded-sm bg-muted/40" />
                  <div className="h-3 w-3/4 animate-pulse rounded-sm bg-muted/40" />
                </div>
                <div className="flex gap-1.5 pt-1">
                  <div className="h-4 w-14 animate-pulse rounded-sm bg-muted/40" />
                  <div className="h-4 w-14 animate-pulse rounded-sm bg-muted/40" />
                  <div className="h-4 w-14 animate-pulse rounded-sm bg-muted/40" />
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                  <div className="h-8 w-24 animate-pulse rounded-md bg-muted/60" />
                  <div className="h-4 w-20 animate-pulse rounded-sm bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
