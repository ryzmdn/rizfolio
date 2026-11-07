"use client"

import { useState, useCallback } from "react"
import { Copy, Check } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface CopyPathButtonProps {
  path: string
  className?: string
}

export function CopyPathButton({ path, className }: CopyPathButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(path)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [path])

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "File path copied" : "Copy file path"}
      title="Copy file path to clipboard"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground transition-all hover:bg-foreground hover:text-background",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-emerald-500" />
          <span className="font-medium text-foreground">
            Copied
          </span>
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          <span>Copy path</span>
        </>
      )}
    </button>
  )
}
