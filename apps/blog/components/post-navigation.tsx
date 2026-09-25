import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { BlogPostItem } from "@/data"

interface PostNavigationProps {
  prev: BlogPostItem | null
  next: BlogPostItem | null
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Article navigation"
      className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 border-t border-border/40"
    >
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:border-border hover:bg-card"
        >
          <span className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
            <span>Previous Article</span>
          </span>
          <span className="mt-2 text-xs sm:text-sm font-medium text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-4 text-right transition-all hover:border-border hover:bg-card sm:text-right"
        >
          <span className="flex items-center justify-end gap-x-1.5 text-xs text-muted-foreground">
            <span>Next Article</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-2 text-xs sm:text-sm font-medium text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  )
}
