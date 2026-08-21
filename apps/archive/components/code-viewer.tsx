"use client"

import { useState } from "react"
import { Copy, Check, FileCode, Download } from "lucide-react"

export interface CodeViewerProps {
  filename: string
  code: string
  highlightedHtml: string
  sizeBytes?: number
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function CodeViewer({
  filename,
  code,
  highlightedHtml,
  sizeBytes,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const lineCount = code ? code.split("\n").length : 0

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
      <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <FileCode className="size-4 text-foreground/80" />
          <span className="font-mono font-medium text-foreground">
            {filename}
          </span>
          <span>•</span>
          <span className="tabular-nums">{lineCount} lines</span>
          {sizeBytes ? (
            <>
              <span>•</span>
              <span className="tabular-nums">{formatBytes(sizeBytes)}</span>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="size-3 text-success" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download file"
            className="inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Download className="size-3" />
            <span>Raw</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-background/50 p-4 font-mono text-xs leading-relaxed">
        <div
          className="[&_code]:font-mono! [&>pre]:bg-transparent! [&>pre]:p-0!"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
    </div>
  )
}
