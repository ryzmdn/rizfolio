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
        className: "border-foreground/10 bg-foreground/[0.04] text-foreground",
        icon: <Sparkles className="size-3 shrink-0" />,
      }
    case "IMPROVEMENT":
      return {
        label: "Improvement",
        className: "border-foreground/10 bg-foreground/[0.03] text-foreground",
        icon: <Zap className="size-3 shrink-0" />,
      }
    case "FIX":
      return {
        label: "Fix",
        className: "border-foreground/10 bg-foreground/[0.03] text-muted-foreground",
        icon: <Wrench className="size-3 shrink-0" />,
      }
    case "BREAKING":
      return {
        label: "Breaking",
        className: "border-destructive/20 bg-destructive/10 text-destructive",
        icon: <AlertCircle className="size-3 shrink-0" />,
      }
    default:
      return {
        label: category,
        className: "border-foreground/10 bg-foreground/[0.02] text-muted-foreground",
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
        "group relative scroll-mt-24 rounded-3xl border bg-card/40 p-7 sm:p-8 backdrop-blur-xl transition-hover-lift hover:border-foreground/30 hover:shadow-2xl",
        isLatest ? "border-foreground/20 shadow-xs" : "border-foreground/8 shadow-xs"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/release/${release.version}`}
            className="rounded-full bg-foreground px-3.5 py-1 font-mono text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90"
          >
            {release.version}
          </Link>

          {isLatest && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-0.5 font-mono text-[10px] text-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Latest Release
            </span>
          )}

          <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 font-mono text-[11px] text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
          >
            <GitCommit className="size-3" />
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
            className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 font-mono text-[11px] text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
          >
            {copiedLink ? (
              <>
                <Check className="size-3 text-emerald-500" />
                <span>Copied</span>
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
            className="group/link inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground px-3.5 py-1 font-mono text-[11px] font-medium text-background transition-all hover:bg-foreground/90"
          >
            <span>Release Notes</span>
            <ArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-foreground transition-colors group-hover:text-foreground">
          <Link href={`/release/${release.version}`}>{release.title}</Link>
        </h2>

        {release.summary && (
          <p className="font-sans text-sm font-light leading-relaxed text-muted-foreground">
            {release.summary}
          </p>
        )}
      </div>

      {release.scope && release.scope.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase">
            <Layers className="size-3" />
            Scope:
          </span>
          {release.scope.map((sc) => (
            <span
              key={sc}
              className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
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
              className="rounded-2xl border border-foreground/8 bg-foreground/[0.015] p-4 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                <Gauge className="size-3 text-muted-foreground" />
                <span>{metric.label}</span>
              </div>
              <div className="mt-1 font-serif text-lg font-light text-foreground tabular-nums">
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {release.items && release.items.length > 0 && (
        <div className="mt-6 border-t border-foreground/8 pt-5">
          <h3 className="mb-3 font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            Key Changes
          </h3>
          <ul className="space-y-2">
            {release.items.map((item: ChangelogItemData) => {
              const badge = getItemBadge(item.category)

              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl p-2.5 text-xs transition-colors hover:bg-foreground/[0.02] sm:text-sm"
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px]",
                      badge.className
                    )}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-sans font-light leading-relaxed text-foreground">
                      {item.description}
                    </span>
                    {item.scope && (
                      <span className="ml-2 inline-block rounded-full border border-foreground/10 bg-foreground/[0.03] px-2 py-0.2 font-mono text-[10px] text-muted-foreground">
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
