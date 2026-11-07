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
    <div className="group relative flex flex-col justify-between rounded-3xl border border-foreground/8 bg-foreground/[0.015] p-6 transition-all duration-300 hover:border-foreground/25 hover:bg-foreground/[0.03] hover:shadow-xl">
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
              [ ARCHIVE // {slug} ]
            </span>
            <div className="flex items-center gap-2">
              <FolderGit2 className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              <Link
                href={`/repo/${slug}`}
                className="font-serif text-lg font-light tracking-tight text-foreground transition-colors group-hover:text-muted-foreground"
              >
                {name}
              </Link>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {categoryInfo.label}
          </span>
        </div>

        {description && (
          <p className="line-clamp-2 text-xs font-light leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {courseName && (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/70">
            <span>{courseName}</span>
            {semester && <span>• {semester}</span>}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3.5 border-t border-foreground/8 pt-4">
        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-3 text-[11px]">
            <span
              className="inline-flex items-center gap-1"
              title={`${starsCount} stars`}
            >
              <Star className="size-3 text-muted-foreground/60" />
              <span className="tabular-nums">{starsCount}</span>
            </span>
            <span
              className="inline-flex items-center gap-1"
              title={`${downloadsCount} downloads`}
            >
              <Download className="size-3 text-muted-foreground/60" />
              <span className="tabular-nums">{downloadsCount}</span>
            </span>
            <span
              className="inline-flex items-center gap-1"
              title={`${viewsCount} views`}
            >
              <Eye className="size-3 text-muted-foreground/60" />
              <span className="tabular-nums">{viewsCount}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/repo/${slug}`}
              aria-label={`Browse code in ${name}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/3 px-3 py-1 text-[11px] uppercase tracking-wider text-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
            >
              <Code2 className="size-3" />
              <span>Blueprint</span>
            </Link>

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`GitHub repository for ${name}`}
                className="flex size-7 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
              >
                <GitHub className="size-3" />
              </a>
            )}

            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Live demo for ${name}`}
                className="flex size-7 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
              >
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
