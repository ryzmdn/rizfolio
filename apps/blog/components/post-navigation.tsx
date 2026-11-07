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
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-6 transition-all duration-300 hover:border-foreground/25 hover:bg-foreground/[0.03]"
        >
          <span className="flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-foreground">
            <ArrowLeft className="size-3 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Previous Monograph</span>
          </span>
          <span className="mt-3 line-clamp-2 font-serif text-base leading-snug font-light text-foreground transition-colors group-hover:text-muted-foreground">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-6 text-right transition-all duration-300 hover:border-foreground/25 hover:bg-foreground/[0.03]"
        >
          <span className="flex items-center justify-end gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-foreground">
            <span>Next Monograph</span>
            <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
          <span className="mt-3 line-clamp-2 font-serif text-base leading-snug font-light text-foreground transition-colors group-hover:text-muted-foreground">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  )
}
