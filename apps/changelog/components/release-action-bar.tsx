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
          title: `${title} (${version}) — Rizfolio Changelog`,
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
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <GitCommit className="size-3.5 text-primary" />
        <span>{commitSha}</span>
        {copiedSha ? (
          <Check className="size-3 text-emerald-500" />
        ) : (
          <Copy className="size-3 text-muted-foreground/70" />
        )}
      </button>

      <a
        href={`https://github.com/ryzmdn/rizfolio/commit/${commitSha}`}
        target="_blank"
        rel="noreferrer"
        title="View commit diff on GitHub"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <GitHub size={13} />
        <span>GitHub Diff</span>
        <ExternalLink className="size-2.5 text-muted-foreground/70" />
      </a>

      <button
        type="button"
        onClick={handleCopyLink}
        title="Copy permanent URL"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {copiedLink ? (
          <>
            <Check className="size-3.5 text-emerald-500" />
            <span className="text-emerald-500">Link Copied</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleShare}
        title="Share release notes"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Share2 className="size-3.5" />
        <span>Share</span>
      </button>
    </div>
  )
}
