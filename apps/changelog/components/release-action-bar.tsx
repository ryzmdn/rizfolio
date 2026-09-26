"use client"

import { useState } from "react"
import { Check, Copy, GitCommit, Share2, ExternalLink } from "lucide-react"
import { GitHub } from "@workspace/ui/constants/icons"

interface ReleaseActionBarProps {
  version: string
  commitSha: string
  title: string
}

export function ReleaseActionBar({
  version,
  commitSha,
  title,
}: ReleaseActionBarProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedSha, setCopiedSha] = useState(false)

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      setCopiedLink(false)
    }
  }

  async function handleCopySha() {
    try {
      await navigator.clipboard.writeText(commitSha)
      setCopiedSha(true)
      setTimeout(() => setCopiedSha(false), 2000)
    } catch {
      setCopiedSha(false)
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} (${version}): Rizfolio Changelog`,
          url: window.location.href,
        })
      } catch {
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleCopySha}
        title="Copy Git commit SHA"
        aria-label={`Copy Git commit ${commitSha}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
      >
        <GitCommit className="size-3.5 text-foreground" />
        <span>{commitSha}</span>
        {copiedSha ? (
          <Check className="size-3 text-emerald-500" />
        ) : (
          <Copy className="size-3 opacity-60" />
        )}
      </button>

      <a
        href={`https://github.com/ryzmdn/rizfolio/commit/${commitSha}`}
        target="_blank"
        rel="noreferrer"
        title="View commit diff on GitHub"
        aria-label="View commit diff on GitHub"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
      >
        <GitHub size={13} />
        <span>GitHub Diff</span>
        <ExternalLink className="size-2.5 opacity-60" />
      </a>

      <button
        type="button"
        onClick={handleCopyLink}
        title="Copy permanent URL"
        aria-label="Copy release permanent URL"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
      >
        {copiedLink ? (
          <>
            <Check className="size-3.5 text-emerald-500" />
            <span className="text-emerald-500">Link Copied</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5 opacity-60" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleShare}
        title="Share release notes"
        aria-label="Share release notes"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
      >
        <Share2 className="size-3.5 opacity-70" />
        <span>Share</span>
      </button>
    </div>
  )
}
