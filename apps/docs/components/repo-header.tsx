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
  Download,
  GitBranch,
  Eye,
  Shield,
  X,
} from "lucide-react"
import { GitHub } from "@workspace/ui/constants/icons"
import { cn } from "@workspace/ui/lib/utils"
import { toggleRepoStar, incrementRepoDownload } from "../lib/actions"

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
  viewsCount?: number
  githubUrl?: string | null
  demoUrl?: string | null
  license?: string | null
}

const CATEGORY_LABELS: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
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
  techStack,
  starsCount: initialStars,
  downloadsCount: initialDownloads,
  viewsCount = 0,
  githubUrl,
  demoUrl,
  license = "MIT",
}: RepoHeaderProps) {
  const [stars, setStars] = useState(initialStars)
  const [downloads, setDownloads] = useState(initialDownloads)
  const [hasStarred, setHasStarred] = useState(false)
  const [copiedClone, setCopiedClone] = useState(false)
  const [showCloneModal, setShowCloneModal] = useState(false)
  const [cloneProtocol, setCloneProtocol] = useState<"https" | "ssh">("https")

  const categoryInfo = CATEGORY_LABELS[category] || {
    label: category,
    variant: "outline" as const,
  }

  const baseRepoUrl = githubUrl
    ? githubUrl.replace(/\.git$/, "")
    : `https://github.com/ryzmdn/${slug}`

  const httpsCommand = `git clone ${baseRepoUrl}.git`
  const sshCommand = `git clone git@github.com:ryzmdn/${slug}.git`
  const currentCloneCommand =
    cloneProtocol === "https" ? httpsCommand : sshCommand

  async function handleStar() {
    const nextState = !hasStarred
    setHasStarred(nextState)
    setStars((prev) => (nextState ? prev + 1 : prev - 1))
    await toggleRepoStar(slug, nextState)
  }

  function handleCopyClone() {
    navigator.clipboard.writeText(currentCloneCommand)
    setCopiedClone(true)
    setTimeout(() => setCopiedClone(false), 2000)
  }

  async function handleDownloadZip() {
    setDownloads((prev) => prev + 1)
    await incrementRepoDownload(slug)

    // Trigger download
    const zipUrl = `${baseRepoUrl}/archive/refs/heads/main.zip`
    const a = document.createElement("a")
    a.href = zipUrl
    a.target = "_blank"
    a.download = `${slug}-main.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-5 border-b border-border/70 pb-8">
      {/* Top Breadcrumbs & Actions Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          {/* Breadcrumb Path */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              docs
            </Link>
            <span>/</span>
            <Link
              href={`/?category=${category}`}
              className="transition-colors hover:text-foreground"
            >
              {categoryInfo.label.toLowerCase()}
            </Link>
            <span>/</span>
            <span className="font-mono font-medium text-foreground">
              {slug}
            </span>
            <Badge
              variant={categoryInfo.variant}
              className="ml-1 text-[10px] font-normal"
            >
              {categoryInfo.label}
            </Badge>
          </div>

          {/* Repository Title */}
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {name}
          </h1>

          {/* Description */}
          {description && (
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          {/* Metadata Badges Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-mono text-[11px]">
              <GitBranch className="size-3 text-muted-foreground" />
              <span>main</span>
            </span>

            {license && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                  <Shield className="size-3 text-muted-foreground" />
                  <span>{license}</span>
                </span>
              </>
            )}

            {courseName && (
              <>
                <span>•</span>
                <span className="font-mono text-[11px] text-foreground/80">
                  {courseName}
                  {semester && ` (${semester})`}
                </span>
              </>
            )}

            {/* Counters */}
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Star className="size-3" />
              <span className="font-mono tabular-nums">{stars}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Download className="size-3" />
              <span className="font-mono tabular-nums">{downloads}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3" />
              <span className="font-mono tabular-nums">{viewsCount}</span>
            </span>
          </div>

          {/* Tech Stack Pills */}
          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-foreground/90"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Star Button */}
          <button
            type="button"
            onClick={handleStar}
            className={buttonVariants({
              variant: hasStarred ? "default" : "outline",
              size: "sm",
            })}
          >
            <Star className="mr-1.5 size-3.5" />
            <span>{hasStarred ? "Starred" : "Star"}</span>
            <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0.2 font-mono text-[10px] tabular-nums">
              {stars}
            </span>
          </button>

          {/* Clone Popover Trigger */}
          <button
            type="button"
            onClick={() => setShowCloneModal((p) => !p)}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Terminal className="mr-1.5 size-3.5" />
            <span>Clone</span>
          </button>

          {/* Download ZIP */}
          <button
            type="button"
            onClick={handleDownloadZip}
            aria-label="Download repository archive"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Download className="mr-1.5 size-3.5" />
            <span>ZIP</span>
          </button>

          {/* GitHub External */}
          {baseRepoUrl && (
            <a
              href={baseRepoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="View on GitHub"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <GitHub className="mr-1.5 size-3.5" />
              <span>GitHub</span>
            </a>
          )}

          {/* Live Demo External */}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ExternalLink className="mr-1.5 size-3.5" />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Clone Command Modal Popover */}
      {showCloneModal && (
        <div className="relative rounded-2xl border border-border bg-card p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 border-b border-transparent">
              <button
                type="button"
                onClick={() => setCloneProtocol("https")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                  cloneProtocol === "https"
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                HTTPS
              </button>
              <button
                type="button"
                onClick={() => setCloneProtocol("ssh")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                  cloneProtocol === "ssh"
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                SSH
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCloneModal(false)}
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-3 py-2 font-mono text-xs text-foreground">
            <span className="truncate select-all">{currentCloneCommand}</span>
            <button
              type="button"
              onClick={handleCopyClone}
              className="ml-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {copiedClone ? (
                <>
                  <Check className="size-3 text-emerald-500" />
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
          <p className="text-[11px] text-muted-foreground">
            Gunakan Git CLI untuk mengkloning repositori ini secara lokal ke
            perangkat Anda.
          </p>
        </div>
      )}
    </div>
  )
}
