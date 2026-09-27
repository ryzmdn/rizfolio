import { Container } from "@workspace/ui/components/layouts/container"

export default function BlogPostLoading() {
  return (
    <article className="min-h-screen py-10">
      <Container className="max-w-4xl space-y-8">
        <div className="h-4 w-28 animate-pulse rounded-md bg-muted/60" />

        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted/50" />
          <div className="h-10 w-full max-w-2xl animate-pulse rounded-lg bg-muted/80" />
          <div className="flex items-center gap-4 pt-1">
            <div className="size-9 animate-pulse rounded-full bg-muted/60" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 animate-pulse rounded-md bg-muted/70" />
              <div className="h-3 w-24 animate-pulse rounded-md bg-muted/40" />
            </div>
          </div>
        </div>

        <div className="aspect-16/9 w-full animate-pulse rounded-xl border border-border/40 bg-muted/30" />

        <div className="space-y-4 pt-4">
          <div className="h-4 w-full animate-pulse rounded-md bg-muted/50" />
          <div className="h-4 w-11/12 animate-pulse rounded-md bg-muted/50" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted/40" />
          <div className="h-4 w-full animate-pulse rounded-md bg-muted/50" />
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted/40" />
        </div>
      </Container>
    </article>
  )
}
