import Link from "next/link"
import { Badge } from "@workspace/ui/components/badge"
import { FolderGit2, Star, Download, Eye, ExternalLink } from "lucide-react"

export interface RepoCardProps {
  slug: string
  name: string
  description?: string | null
  category: string
  courseName?: string | null
  semester?: string | null
  techStack?: string[] | null
  starsCount: number
  downloadsCount: number
  viewsCount: number
  demoUrl?: string | null
}

const CATEGORY_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  ASSIGNMENT: { label: "Tugas Kuliah", variant: "secondary" },
  EXPERIMENT: { label: "Eksperimen", variant: "outline" },
  OPEN_SOURCE: { label: "Open Source", variant: "default" },
}

export function RepoCard({
  slug,
  name,
  description,
  category,
  courseName,
  semester,
  techStack,
  starsCount,
  downloadsCount,
  viewsCount,
  demoUrl,
}: RepoCardProps) {
  const categoryInfo = CATEGORY_LABELS[category] || {
    label: category,
    variant: "outline" as const,
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5 transition-all hover:border-foreground/30 hover:shadow-sm">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FolderGit2 className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            <Link
              href={`/repo/${slug}`}
              className="text-base font-medium text-foreground hover:underline underline-offset-4"
            >
              {name}
            </Link>
          </div>
          <Badge variant={categoryInfo.variant} className="text-[11px] font-normal">
            {categoryInfo.label}
          </Badge>
        </div>

        {description && (
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}

        {courseName && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
            <span className="font-mono">{courseName}</span>
            {semester && <span>• {semester}</span>}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground/80"
              >
                {tech}
              </span>
            ))}
            {techStack.length > 3 && (
              <span className="text-[11px] text-muted-foreground">
                +{techStack.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <span className="inline-flex items-center gap-1">
            <Star className="size-3" />
            <span className="tabular-nums">{starsCount}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Download className="size-3" />
            <span className="tabular-nums">{downloadsCount}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3" />
            <span className="tabular-nums">{viewsCount}</span>
          </span>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Live Demo"
              className="inline-flex items-center text-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
