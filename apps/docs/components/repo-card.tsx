import Link from "next/link"
import { Badge } from "@workspace/ui/components/badge"
import {
  FolderGit2,
  Star,
  Download,
  Eye,
  ExternalLink,
  Code2,
} from "lucide-react"
import { GitHub } from "@workspace/ui/constants/icons"

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
  githubUrl?: string | null
  demoUrl?: string | null
}

const CATEGORY_LABELS: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
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
  githubUrl,
  demoUrl,
}: RepoCardProps) {
  const categoryInfo = CATEGORY_LABELS[category] || {
    label: category,
    variant: "outline" as const,
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-sm">
      <div className="space-y-3">
        {/* Header: Title, Icon, and Category Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FolderGit2 className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            <Link
              href={`/repo/${slug}`}
              className="text-base font-semibold tracking-tight text-foreground underline-offset-4 hover:underline"
            >
              {name}
            </Link>
          </div>
          <Badge
            variant={categoryInfo.variant}
            className="text-[10px] font-normal shrink-0"
          >
            {categoryInfo.label}
          </Badge>
        </div>

        {/* Description */}
        {description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {/* Academic Course and Semester */}
        {courseName && (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <span>{courseName}</span>
            {semester && <span>• {semester}</span>}
          </div>
        )}
      </div>

      {/* Footer Info: Tech Stack and Actions/Stats */}
      <div className="mt-5 space-y-3 border-t border-border/40 pt-3">
        {/* Tech Stack Pills */}
        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Stats and Quick Links */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1"
              title={`${starsCount} stars`}
            >
              <Star className="size-3 text-muted-foreground" />
              <span className="font-mono text-[11px] tabular-nums">
                {starsCount}
              </span>
            </span>
            <span
              className="inline-flex items-center gap-1"
              title={`${downloadsCount} downloads`}
            >
              <Download className="size-3 text-muted-foreground" />
              <span className="font-mono text-[11px] tabular-nums">
                {downloadsCount}
              </span>
            </span>
            <span
              className="inline-flex items-center gap-1"
              title={`${viewsCount} views`}
            >
              <Eye className="size-3 text-muted-foreground" />
              <span className="font-mono text-[11px] tabular-nums">
                {viewsCount}
              </span>
            </span>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2">
            <Link
              href={`/repo/${slug}`}
              aria-label={`Browse code in ${name}`}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Code2 className="size-3" />
              <span>Browse</span>
            </Link>

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`GitHub repository for ${name}`}
                className="inline-flex items-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <GitHub className="size-3.5" />
              </a>
            )}

            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Live demo for ${name}`}
                className="inline-flex items-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
