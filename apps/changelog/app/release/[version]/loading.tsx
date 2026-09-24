import { Container } from "@workspace/ui/components/layouts/container"

export default function ReleaseDetailLoading() {
  return (
    <Container className="max-w-4xl py-10 sm:py-16">
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-20 animate-pulse rounded-md bg-muted/60" />
        <div className="h-3 w-3 animate-pulse rounded-full bg-muted/40" />
        <div className="h-4 w-16 animate-pulse rounded-md bg-muted/60" />
        <div className="h-3 w-3 animate-pulse rounded-full bg-muted/40" />
        <div className="h-4 w-12 animate-pulse rounded-md bg-muted/60" />
      </div>

      <div className="space-y-6 rounded-2xl border border-border/80 bg-card/50 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-16 animate-pulse rounded-lg bg-muted/60" />
            <div className="h-4 w-24 animate-pulse rounded-md bg-muted/60" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-24 animate-pulse rounded-lg bg-muted/60" />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-muted/60" />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-muted/60" />
          </div>
        </div>

        <div className="space-y-3 border-t border-border/60 pt-6">
          <div className="h-9 w-4/5 animate-pulse rounded-xl bg-muted/60 sm:h-11" />
          <div className="h-4 w-full animate-pulse rounded-md bg-muted/60" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted/60" />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="h-5 w-24 animate-pulse rounded-md bg-muted/60" />
          <div className="h-5 w-20 animate-pulse rounded-md bg-muted/60" />
          <div className="h-5 w-20 animate-pulse rounded-md bg-muted/60" />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-border/60 bg-background/50 p-3.5"
            >
              <div className="h-3 w-20 rounded-md bg-muted/60" />
              <div className="mt-2 h-5 w-16 rounded-md bg-muted/60" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {[1, 2].map((sec) => (
          <div
            key={sec}
            className="space-y-4 rounded-2xl border border-border/80 bg-card/40 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-7 animate-pulse rounded-lg bg-muted/60" />
                <div className="h-5 w-40 animate-pulse rounded-md bg-muted/60" />
              </div>
              <div className="h-4 w-16 animate-pulse rounded-md bg-muted/60" />
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl p-2"
                >
                  <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted/60" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted/50" />
                    <div className="h-3.5 w-4/5 animate-pulse rounded-md bg-muted/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-border/80 pt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-20 animate-pulse rounded-2xl border border-border/80 bg-card/40 p-4" />
          <div className="h-20 animate-pulse rounded-2xl border border-border/80 bg-card/40 p-4" />
        </div>
      </div>
    </Container>
  )
}
