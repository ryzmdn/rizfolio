"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Copy,
  Check,
  FileCode,
  Download,
  WrapText,
  FileText,
  Link as LinkIcon,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

export interface CodeViewerProps {
  filename: string
  code: string
  highlightedHtml: string
  sizeBytes?: number
}

interface HighlightRange {
  start: number
  end: number
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getLanguageName(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || ""
  const map: Record<string, string> = {
    ts: "TypeScript",
    tsx: "TypeScript (React)",
    js: "JavaScript",
    jsx: "JavaScript (React)",
    go: "Go",
    c: "C",
    h: "C Header",
    cpp: "C++",
    hpp: "C++ Header",
    py: "Python",
    rs: "Rust",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    toml: "TOML",
    md: "Markdown",
    sh: "Shell Script",
    dockerfile: "Dockerfile",
    makefile: "Makefile",
    sql: "SQL",
    css: "CSS",
    html: "HTML",
  }
  return (
    map[ext] ||
    (filename.toLowerCase() === "makefile" ? "Makefile" : "Plain Text")
  )
}

export function CodeViewer({
  filename,
  code,
  highlightedHtml,
  sizeBytes,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [lineWrap, setLineWrap] = useState(false)
  const [rawMode, setRawMode] = useState(false)
  const [highlightRange, setHighlightRange] = useState<HighlightRange | null>(
    null
  )

  const lines = code ? code.split("\n") : []
  const lineCount = lines.length
  const language = getLanguageName(filename)

  useEffect(() => {
    function parseHash(): HighlightRange | null {
      const hash = window.location.hash
      if (!hash.startsWith("#L")) return null

      const match = hash.slice(2).match(/^(\d+)(?:-L?(\d+))?$/)
      if (!match || !match[1]) return null

      const first = parseInt(match[1], 10)
      const second = match[2] ? parseInt(match[2], 10) : first
      if (isNaN(first) || isNaN(second)) return null

      const start = Math.max(1, Math.min(first, second))
      const end = Math.min(lineCount, Math.max(first, second))

      if (start <= lineCount) {
        return { start, end }
      }
      return null
    }

    function syncFromHash() {
      const range = parseHash()
      setHighlightRange(range)

      if (range) {
        const el = document.getElementById(`L${range.start}`)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    }

    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [lineCount])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const handleCopyPermalink = useCallback(() => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }, [])

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code, filename])

  function handleLineClick(e: React.MouseEvent, lineNum: number) {
    e.preventDefault()

    if (e.shiftKey && highlightRange) {
      const anchor = highlightRange.start
      const start = Math.min(anchor, lineNum)
      const end = Math.max(anchor, lineNum)
      const hash = start === end ? `#L${start}` : `#L${start}-L${end}`
      setHighlightRange({ start, end })
      window.history.replaceState(null, "", hash)
    } else {
      if (
        highlightRange &&
        highlightRange.start === lineNum &&
        highlightRange.end === lineNum
      ) {
        setHighlightRange(null)
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        )
      } else {
        setHighlightRange({ start: lineNum, end: lineNum })
        window.history.replaceState(null, "", `#L${lineNum}`)
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-foreground/8 bg-card/40 backdrop-blur-xl shadow-xs">
      <div className="flex flex-col gap-3 border-b border-foreground/8 bg-foreground/[0.02] px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <FileCode className="size-4 text-foreground/80" />
          <span className="font-mono font-semibold text-foreground">
            {filename}
          </span>
          <span className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {language}
          </span>
          <span className="text-foreground/20">•</span>
          <span className="font-mono text-[11px] tabular-nums">{lineCount} lines</span>
          {sizeBytes ? (
            <>
              <span className="text-foreground/20">•</span>
              <span className="font-mono text-[11px] tabular-nums">
                {formatBytes(sizeBytes)}
              </span>
            </>
          ) : null}
          {highlightRange ? (
            <>
              <span className="text-foreground/20">•</span>
              <span className="font-mono text-[11px] font-medium text-foreground">
                {highlightRange.start === highlightRange.end
                  ? `Line ${highlightRange.start}`
                  : `Lines ${highlightRange.start}-${highlightRange.end}`}
              </span>
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLineWrap((p) => !p)}
            title={lineWrap ? "Disable line wrap" : "Enable line wrap"}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-xs transition-colors",
              lineWrap
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/10 bg-background/60 text-muted-foreground hover:text-foreground"
            )}
          >
            <WrapText className="size-3" />
            <span className="hidden sm:inline">Wrap</span>
          </button>

          <button
            type="button"
            onClick={() => setRawMode((p) => !p)}
            title={rawMode ? "Show highlighted code" : "Show raw plain text"}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-xs transition-colors",
              rawMode
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/10 bg-background/60 text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="size-3" />
            <span className="hidden sm:inline">Raw</span>
          </button>

          <button
            type="button"
            onClick={handleCopyPermalink}
            title="Copy permalink with line anchor"
            className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {copiedLink ? (
              <>
                <Check className="size-3 text-emerald-500" />
                <span className="hidden sm:inline">Linked</span>
              </>
            ) : (
              <>
                <LinkIcon className="size-3" />
                <span className="hidden sm:inline">Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy file contents"
            className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-500" />
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
            aria-label="Download raw file"
            className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Download className="size-3" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="flex bg-background/30 font-mono text-xs">
        <div
          aria-hidden="true"
          className="border-r border-foreground/8 bg-foreground/[0.015] py-4 text-right font-mono text-[11px] text-muted-foreground/40 select-none"
        >
          {lines.map((_, i) => {
            const lineNum = i + 1
            const isHighlighted =
              highlightRange &&
              lineNum >= highlightRange.start &&
              lineNum <= highlightRange.end

            return (
              <a
                key={lineNum}
                id={`L${lineNum}`}
                href={`#L${lineNum}`}
                onClick={(e) => handleLineClick(e, lineNum)}
                className={cn(
                  "block h-[22px] px-4 leading-[22px] transition-colors hover:text-foreground",
                  isHighlighted &&
                    "border-r-2 border-foreground bg-foreground/10 font-bold text-foreground"
                )}
              >
                {lineNum}
              </a>
            )
          })}
        </div>

        <div
          className={cn(
            "flex-1 overflow-x-auto p-4 font-mono text-xs",
            lineWrap ? "break-words whitespace-pre-wrap" : "whitespace-pre"
          )}
        >
          {rawMode ? (
            <pre className="font-mono text-xs leading-[22px] text-foreground">
              {code}
            </pre>
          ) : (
            <>
              {highlightRange ? (
                <style>{`
                  .code-viewer-shiki .line:nth-child(n+${highlightRange.start}):nth-child(-n+${highlightRange.end}) {
                    background-color: rgba(255, 255, 255, 0.08);
                    display: inline-block;
                    width: 100%;
                    border-radius: 4px;
                  }
                `}</style>
              ) : null}
              <div
                className="code-viewer-shiki [&_.line]:block [&_.line]:h-[22px] [&_.line]:leading-[22px] [&_code]:font-mono! [&>pre]:bg-transparent! [&>pre]:p-0!"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
