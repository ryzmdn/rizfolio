"use client"

import React, { useState } from "react"
import { Check, Copy, Terminal, FileCode } from "lucide-react"

interface CodeBlockProps {
  children?: React.ReactNode
  className?: string
  raw?: string
  filename?: string
  language?: string
  showLineNumbers?: boolean
}

export function CodeBlock({
  children,
  className = "",
  raw,
  filename,
  language,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node
    if (typeof node === "number") return String(node)
    if (Array.isArray(node)) return node.map(extractText).join("")
    if (React.isValidElement(node) && node.props) {
      const childProps = node.props as { children?: React.ReactNode }
      return extractText(childProps.children)
    }
    return ""
  }

  const textToCopy = raw || extractText(children)

  const handleCopy = async () => {
    if (!textToCopy) return
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const derivedLanguage =
    language ||
    (className
      ? className
          .replace(/language-/, "")
          .replace(/hljs/, "")
          .trim()
      : undefined)

  return (
    <div className="group/code relative my-6 overflow-hidden rounded-xl border border-border/80 bg-zinc-950 text-zinc-100 shadow-lg dark:border-border/60">
      <div className="flex h-10 items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-4 text-xs">
        <div className="flex items-center gap-2 font-mono text-zinc-400">
          {filename ? (
            <>
              <FileCode className="size-3.5 text-primary" />
              <span className="font-medium text-zinc-200">{filename}</span>
            </>
          ) : (
            <>
              <Terminal className="size-3.5 text-zinc-400" />
              <span>{derivedLanguage || "code"}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {derivedLanguage && filename && (
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
              {derivedLanguage}
            </span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy code to clipboard"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-zinc-700/60 bg-zinc-800/60 px-2 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className={`overflow-x-auto p-4 font-mono text-xs leading-relaxed ${
          showLineNumbers ? "[&>pre]:pl-6" : ""
        }`}
      >
        {children}
      </div>
    </div>
  )
}
