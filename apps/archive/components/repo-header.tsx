"use client"

import Link from "next/link"
import { useState } from "react"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  Star,
  ExternalLink,
  Copy,
  Check,
  Terminal,
} from "lucide-react"
import { toggleRepoStar } from "../lib/actions"

export interface RepoHeaderProps {
  slug: string
  name: string
  description?: string | null
  category: string
  courseName?: string | null
  semester?: string | null
  techStack?: string[] | null
  starsCount: number
  downloadsCount: number
  githubUrl?: string | null
  demoUrl?: string | null
  license?: string | null
}

const CATEGORY_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  ASSIGNMENT: { label: "Tugas Kuliah", variant: "secondary" },
  EXPERIMENT: { label: "Eksperimen", variant: "outline" },
  OPEN_SOURCE: { label: "Open Source", variant: "default" },
}

export function RepoHeader({
  slug,
  name,
  description,
  category,
  courseName,
  semester,
  starsCount: initialStars,
  githubUrl,
  demoUrl,
  license,
}: RepoHeaderProps) {
  const [stars, setStars] = useState(initialStars)
  const [hasStarred, setHasStarred] = useState(false)
  const [copiedClone, setCopiedClone] = useState(false)
  const [showCloneModal, setShowCloneModal] = useState(false)

  const categoryInfo = CATEGORY_LABELS[category] || {
    label: category,
    variant: "outline" as const,
  }

  const cloneCommand = githubUrl
    ? `git clone ${githubUrl}.git`
    : `git clone https://github.com/ryzmdn/${slug}.git`

  async function handleStar() {
    const nextState = !hasStarred
    setHasStarred(nextState)
    setStars((prev) => (nextState ? prev + 1 : prev - 1))
    await toggleRepoStar(slug, nextState)
  }

  function handleCopyClone() {
    navigator.clipboard.writeText(cloneCommand)
    setCopiedClone(true)
    setTimeout(() => setCopiedClone(false), 2000)
  }

  return (
    <div className="space-y-4 pb-6 border-b border-border/70">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              archive
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">{slug}</span>
            <Badge variant={categoryInfo.variant} className="ml-2 text-[11px] font-normal">
              {categoryInfo.label}
            </Badge>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {name}
          </h1>

          {description && (
            <p className="text-muted-foreground text-sm max-w-3xl leading-relaxed">
              {description}
            </p>
          )}

          {courseName && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{courseName}</span>
              {semester && <span>• {semester}</span>}
              {license && <span>• {license} License</span>}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleStar}
            className={buttonVariants({
              variant: hasStarred ? "default" : "outline",
              size: "sm",
            })}
          >
            <Star className="size-3.5 mr-1" />
            <span>Star</span>
            <span className="ml-1.5 rounded bg-background/20 px-1 py-0.2 text-xs tabular-nums">
              {stars}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowCloneModal((p) => !p)}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Terminal className="size-3.5 mr-1" />
            <span>Clone</span>
          </button>

          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ExternalLink className="size-3.5 mr-1" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>

      {showCloneModal && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-2 font-mono text-xs text-foreground">
          <span className="truncate select-all">{cloneCommand}</span>
          <button
            type="button"
            onClick={handleCopyClone}
            className="ml-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {copiedClone ? (
              <>
                <Check className="size-3 text-success" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
