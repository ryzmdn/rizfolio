"use client"

import Link from "next/link"
import { useState } from "react"
import { Badge } from "@workspace/ui/components/badge"
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
    <div className="space-y-6 border-b border-foreground/8 pb-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              docs
            </Link>
            <span className="text-foreground/20">/</span>
            <Link
              href={`/?category=${category}`}
              className="transition-colors hover:text-foreground"
            >
              {categoryInfo.label.toLowerCase()}
            </Link>
            <span className="text-foreground/20">/</span>
            <span className="font-semibold text-foreground">
              {slug}
            </span>
            <span className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              {categoryInfo.label}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground">
            {name}
          </h1>

          {description && (
            <p className="max-w-3xl text-base font-light leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-foreground/80">
              <GitBranch className="size-3 text-muted-foreground" />
              <span>main</span>
            </span>

            {license && (
              <>
                <span className="text-foreground/20">•</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                  <Shield className="size-3 text-muted-foreground" />
                  <span>{license}</span>
                </span>
              </>
            )}

            {courseName && (
              <>
                <span className="text-foreground/20">•</span>
                <span className="font-mono text-[11px] text-foreground/90">
                  {courseName}
                  {semester && ` (${semester})`}
                </span>
              </>
            )}

            <span className="text-foreground/20">•</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
              <Star className="size-3 text-muted-foreground" />
              <span className="tabular-nums">{stars}</span>
            </span>
            <span className="text-foreground/20">•</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
              <Download className="size-3 text-muted-foreground" />
              <span className="tabular-nums">{downloads}</span>
            </span>
            <span className="text-foreground/20">•</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
              <Eye className="size-3 text-muted-foreground" />
              <span className="tabular-nums">{viewsCount}</span>
            </span>
          </div>

          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleStar}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-xs transition-all",
              hasStarred
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/15 bg-background text-foreground hover:bg-muted"
            )}
          >
            <Star className={cn("size-3.5", hasStarred && "fill-current")} />
            <span>{hasStarred ? "Starred" : "Star"}</span>
            <span className="ml-1 rounded-full bg-foreground/10 px-1.5 py-0.2 text-[10px] tabular-nums">
              {stars}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowCloneModal((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-background px-4 py-2 font-mono text-xs text-foreground transition-all hover:bg-muted"
          >
            <Terminal className="size-3.5" />
            <span>Clone</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadZip}
            aria-label="Download repository archive"
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-background px-4 py-2 font-mono text-xs text-foreground transition-all hover:bg-muted"
          >
            <Download className="size-3.5" />
            <span>ZIP</span>
          </button>

          {baseRepoUrl && (
            <a
              href={baseRepoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="View on GitHub"
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-background px-4 py-2 font-mono text-xs text-foreground transition-all hover:bg-muted"
            >
              <GitHub className="size-3.5" />
              <span>GitHub</span>
            </a>
          )}

          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-background px-4 py-2 font-mono text-xs text-foreground transition-all hover:bg-muted"
            >
              <ExternalLink className="size-3.5" />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>

      {showCloneModal && (
        <div className="relative space-y-3 rounded-3xl border border-foreground/10 bg-card/90 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.03] p-1">
              <button
                type="button"
                onClick={() => setCloneProtocol("https")}
                className={cn(
                  "rounded-full px-3 py-1 font-mono text-xs transition-colors",
                  cloneProtocol === "https"
                    ? "bg-foreground font-medium text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                HTTPS
              </button>
              <button
                type="button"
                onClick={() => setCloneProtocol("ssh")}
                className={cn(
                  "rounded-full px-3 py-1 font-mono text-xs transition-colors",
                  cloneProtocol === "ssh"
                    ? "bg-foreground font-medium text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                SSH
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCloneModal(false)}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-4 py-2.5 font-mono text-xs text-foreground">
            <span className="truncate select-all">{currentCloneCommand}</span>
            <button
              type="button"
              onClick={handleCopyClone}
              className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {copiedClone ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-foreground">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-[11px] text-muted-foreground">
            Gunakan Git CLI untuk mengkloning repositori ini secara lokal ke
            perangkat Anda.
          </p>
        </div>
      )}
    </div>
  )
}
