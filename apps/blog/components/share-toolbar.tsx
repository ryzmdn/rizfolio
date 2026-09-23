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
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-muted-foreground mr-1 text-[11px] font-medium uppercase tracking-wider">
        Share:
      </span>

      <button
        type="button"
        onClick={handleCopyLink}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-x-1.5 text-xs h-8 px-2.5"
        )}
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-500" />
            <span className="text-emerald-500">Copied</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5 text-muted-foreground" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "text-xs h-8 px-2.5"
        )}
      >
        X (Twitter)
      </a>

      <a
        href={linkedInShareUrl}
        target="_blank"
        rel="noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "text-xs h-8 px-2.5"
        )}
      >
        LinkedIn
      </a>

      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Share article via device dialog"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "h-8 w-8 text-muted-foreground hover:text-foreground sm:hidden"
        )}
      >
        <Share2 className="size-3.5" />
      </button>
    </div>
  )
}
