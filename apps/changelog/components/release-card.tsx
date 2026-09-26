"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Check,
  Copy,
  GitCommit,
  Sparkles,
  Zap,
  Wrench,
  AlertCircle,
  Tag,
  ArrowRight,
  Gauge,
  Layers,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { ChangelogReleaseData, ChangelogItemData } from "../data"

interface ReleaseCardProps {
  release: ChangelogReleaseData
  isLatest?: boolean
}

function getItemBadge(category: string) {
  switch (category.toUpperCase()) {
    case "FEATURE":
      return {
        label: "Feature",
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: <Sparkles className="size-3 shrink-0" />,
      }
    case "IMPROVEMENT":
      return {
        label: "Improvement",
        className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        icon: <Zap className="size-3 shrink-0" />,
      }
    case "FIX":
      return {
        label: "Fix",
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: <Wrench className="size-3 shrink-0" />,
      }
    case "BREAKING":
      return {
        label: "Breaking",
        className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        icon: <AlertCircle className="size-3 shrink-0" />,
      }
    default:
      return {
        label: category,
        className: "bg-muted text-muted-foreground border-border/50",
        icon: <Tag className="size-3 shrink-0" />,
      }
  }
}

export function ReleaseCard({ release, isLatest }: ReleaseCardProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedSha, setCopiedSha] = useState(false)

  async function handleCopyLink() {
    try {
      const url = `${window.location.origin}/#${release.version}`
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      setCopiedLink(false)
    }
  }

  async function handleCopySha() {
    try {
      await navigator.clipboard.writeText(release.commitSha)
      setCopiedSha(true)
      setTimeout(() => setCopiedSha(false), 2000)
    } catch {
      setCopiedSha(false)
    }
  }

  return (
    <article
      id={release.version}
      className={cn(
        "group relative scroll-mt-24 rounded-2xl border bg-card/60 p-6 shadow-xs backdrop-blur-xs transition-all hover:border-foreground/20 hover:shadow-md sm:p-8",
        isLatest ? "border-border/90 ring-1 ring-border/50" : "border-border/80"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/release/${release.version}`}
            className="rounded-lg bg-foreground px-3 py-1 font-mono text-xs font-bold text-background shadow-xs transition-opacity hover:opacity-90"
          >
            {release.version}
          </Link>

          {isLatest && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Latest Release
            </span>
          )}

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <time dateTime={release.createdAt}>{release.releaseDate}</time>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleCopySha}
            title="Copy Git commit SHA"
            aria-label={`Copy Git commit ${release.commitSha}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground"
          >
            <GitCommit className="size-3 text-muted-foreground" />
            <span>{release.commitSha}</span>
            {copiedSha ? (
              <Check className="size-3 text-emerald-500" />
            ) : (
              <Copy className="size-2.5 opacity-60" />
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy anchor link"
            aria-label={`Copy link to release ${release.version}`}
            className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground"
          >
            {copiedLink ? (
              <>
                <Check className="size-3 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3 opacity-60" />
                <span>Permalink</span>
              </>
            )}
          </button>

          <Link
            href={`/release/${release.version}`}
            className="group/link inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-muted"
          >
            <span>Release Notes</span>
            <ArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
          <Link href={`/release/${release.version}`}>
            {release.title}
          </Link>
        </h2>

        {release.summary && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {release.summary}
          </p>
        )}
      </div>

      {release.scope && release.scope.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Layers className="size-3" />
            Scope:
          </span>
          {release.scope.map((sc) => (
            <span
              key={sc}
              className="rounded-md border border-border/70 bg-muted/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {sc}
            </span>
          ))}
        </div>
      )}

      {release.metrics && release.metrics.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {release.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-border/60 bg-background/60 p-3 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Gauge className="size-3 text-muted-foreground" />
                <span>{metric.label}</span>
              </div>
              <div className="mt-1 font-mono text-sm font-bold text-foreground">
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {release.items && release.items.length > 0 && (
        <div className="mt-6 border-t border-border/60 pt-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Key Changes
          </h3>
          <ul className="space-y-2.5">
            {release.items.map((item: ChangelogItemData) => {
              const badge = getItemBadge(item.category)

              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg p-2 text-xs transition-colors hover:bg-muted/40 sm:text-sm"
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                      badge.className
                    )}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="leading-relaxed text-foreground">
                      {item.description}
                    </span>
                    {item.scope && (
                      <span className="ml-2 inline-block rounded border border-border/50 bg-muted/60 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground">
                        {item.scope}
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </article>
  )
}
