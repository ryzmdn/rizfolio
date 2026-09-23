"use client"

import { useState } from "react"
import { BookOpen, Copy, Check } from "lucide-react"
import { MDXRemoteRenderer } from "@workspace/ui/components/mdx"
import { TableOfContents } from "./table-of-contents"

export function ReadmeViewer({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  if (!content) return null

  function handleCopy() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate approximate reading time
  const words = content.trim().split(/\s+/).length
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200))

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
      {/* Top File Header */}
      <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-foreground/80" />
          <span className="font-mono font-medium text-foreground">
            README.md
          </span>
          <span>•</span>
          <span className="font-mono text-[11px] tabular-nums">
            {readingTimeMinutes} min read
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* Main Body: Markdown Content + Sticky Table of Contents */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Markdown Content Column */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            <MDXRemoteRenderer source={content} />
          </div>

          {/* Sticky Table of Contents Column */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-24">
              <TableOfContents content={content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
