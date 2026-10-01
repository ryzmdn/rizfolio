"use client"

import { useState, useCallback } from "react"
import { Copy, Check } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export function CopyMarkdownButton({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [content])

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Markdown copied" : "Copy markdown"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="size-3 text-emerald-500" />
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            Copied
          </span>
        </>
      ) : (
        <>
          <Copy className="size-3" />
          <span>Copy Markdown</span>
        </>
      )}
    </button>
  )
}
