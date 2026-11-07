"use client"

import { useState } from "react"
import { Check, Copy, Share2 } from "lucide-react"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface ShareToolbarProps {
  title: string
  url?: string
}

export function ShareToolbar({ title, url }: ShareToolbarProps) {
  const [copied, setCopied] = useState(false)

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href
    }
    return url || ""
  }

  const handleCopyLink = async () => {
    const targetUrl = getShareUrl()
    try {
      await navigator.clipboard.writeText(targetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleNativeShare = async () => {
    const targetUrl = getShareUrl()
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: targetUrl,
        })
      } catch {
        // Ignored if cancelled
      }
    } else {
      handleCopyLink()
    }
  }

  const targetUrl = typeof window !== "undefined" ? getShareUrl() : url || ""
  const encodedUrl = encodeURIComponent(targetUrl)
  const encodedTitle = encodeURIComponent(title)

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
      <span className="mr-1 text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Share:
      </span>

      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/3 px-3 py-1.5 uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
      >
        {copied ? (
          <>
            <Check className="size-3 text-emerald-500" />
            <span className="text-foreground">Copied</span>
          </>
        ) : (
          <>
            <Copy className="size-3 text-muted-foreground/60" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-foreground/10 bg-foreground/3 px-3 py-1.5 uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
      >
        X / Twitter
      </a>

      <a
        href={linkedInShareUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-foreground/10 bg-foreground/3 px-3 py-1.5 uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
      >
        LinkedIn
      </a>

      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Share article via device dialog"
        className="flex size-7 items-center justify-center rounded-full border border-foreground/10 bg-foreground/3 text-muted-foreground hover:text-foreground sm:hidden"
      >
        <Share2 className="size-3.5" />
      </button>
    </div>
  )
}
