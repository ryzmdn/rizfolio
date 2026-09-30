import { Container } from "@workspace/ui/components/layouts/container"

export default function WorkLoading() {
  return (
    <div className="space-y-12 py-10 sm:py-16 animate-in fade-in duration-150">
      <Container>
        <div className="h-4 w-32 animate-pulse rounded-md bg-muted/60" />
      </Container>

      <Container className="space-y-4">
        <div className="h-6 w-56 animate-pulse rounded-full bg-muted/50" />
        <div className="h-10 w-80 animate-pulse rounded-lg bg-muted/70 sm:h-12" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-muted/40" />
        <div className="h-4 w-3/4 max-w-lg animate-pulse rounded-md bg-muted/40" />

        <div className="flex gap-2 pt-4">
          <div className="h-7 w-24 animate-pulse rounded-lg bg-muted/50" />
          <div className="h-7 w-28 animate-pulse rounded-lg bg-muted/50" />
          <div className="h-7 w-20 animate-pulse rounded-lg bg-muted/50" />
        </div>
      </Container>

      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-4 space-y-4"
            >
              <div className="aspect-3/2 w-full animate-pulse rounded-xl bg-muted/60" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-28 animate-pulse rounded bg-muted/50" />
                  <div className="h-3 w-12 animate-pulse rounded bg-muted/40" />
                </div>
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted/70" />
                <div className="h-3.5 w-full animate-pulse rounded bg-muted/40" />
                <div className="h-3.5 w-4/5 animate-pulse rounded bg-muted/40" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
