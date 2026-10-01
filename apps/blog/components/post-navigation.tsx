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
      className="grid grid-cols-1 gap-8 border-t border-border/40 pt-8 sm:grid-cols-2 sm:gap-0"
    >
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex flex-col gap-2 sm:border-r sm:border-border/30 sm:pr-6"
        >
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
            <span>Previous</span>
          </span>
          <span className="line-clamp-2 text-sm leading-snug font-medium text-foreground">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col gap-2 text-right sm:pl-6"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            <span>Next</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="line-clamp-2 text-sm leading-snug font-medium text-foreground">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  )
}
