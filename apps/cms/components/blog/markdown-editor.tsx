"use client"

import { useState, useRef, useMemo } from "react"
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Code,
  FileCode,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Eye,
  Edit3,
  Columns,
} from "lucide-react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  name?: string
  placeholder?: string
  rows?: number
}

function renderSimpleMarkdown(markdown: string) {
  if (!markdown.trim()) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground">
        Belum ada konten untuk dipratinjau. Mulai menulis di tab Tulis.
      </div>
    )
  }

  const lines = markdown.split("\n")
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeBlockContent: string[] = []
  let codeBlockLang = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ""

    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div
            key={`code-${i}`}
            className="my-3 overflow-x-auto rounded-lg border border-border/80 bg-muted/40 p-3 font-mono text-xs text-foreground"
          >
            {codeBlockLang && (
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {codeBlockLang}
              </div>
            )}
            <pre>
              <code>{codeBlockContent.join("\n")}</code>
            </pre>
          </div>
        )
        inCodeBlock = false
        codeBlockContent = []
        codeBlockLang = ""
      } else {
        inCodeBlock = true
        codeBlockLang = line.trim().slice(3).trim()
        codeBlockContent = []
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockContent.push(line)
      continue
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={`h1-${i}`}
          className="mt-5 mb-2 border-b border-border/60 pb-1 text-xl font-bold tracking-tight text-foreground"
        >
          {line.slice(2)}
        </h1>
      )
      continue
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="mt-4 mb-2 text-lg font-semibold tracking-tight text-foreground"
        >
          {line.slice(3)}
        </h2>
      )
      continue
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="mt-3 mb-1 text-sm font-semibold text-foreground"
        >
          {line.slice(4)}
        </h3>
      )
      continue
    }

    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-2 border-l-2 border-primary pl-3 italic text-muted-foreground"
        >
          {line.slice(2)}
        </blockquote>
      )
      continue
    }

    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(
        <hr key={`hr-${i}`} className="my-4 border-border/70" />
      )
      continue
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={`li-${i}`} className="ml-4 list-disc text-xs text-foreground">
          {formatInline(line.slice(2))}
        </li>
      )
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, "")
      elements.push(
        <li
          key={`oli-${i}`}
          className="ml-4 list-decimal text-xs text-foreground"
        >
          {formatInline(content)}
        </li>
      )
      continue
    }

    if (line.trim() === "") {
      elements.push(<div key={`empty-${i}`} className="h-2" />)
      continue
    }

    elements.push(
      <p key={`p-${i}`} className="text-xs leading-relaxed text-foreground">
        {formatInline(line)}
      </p>
    )
  }

  return <div className="space-y-1.5">{elements}</div>
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g)

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={index} className="italic text-foreground">
          {part.slice(1, -1)}
        </em>
      )
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch && linkMatch[1] && linkMatch[2]) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80"
        >
          {linkMatch[1]}
        </a>
      )
    }

    return part
  })
}

export function MarkdownEditor({
  value,
  onChange,
  name,
  placeholder = "Tulis konten artikel dalam format Markdown...",
  rows = 14,
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<"write" | "preview" | "split">(
    "write"
  )
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const stats = useMemo(() => {
    const clean = value.trim()
    const words = clean ? clean.split(/\s+/).length : 0
    const chars = value.length
    const readingTime = Math.max(1, Math.ceil(words / 200))
    return { words, chars, readingTime }
  }, [value])

  function insertFormatting(prefix: string, suffix: string = "", placeholderText: string = "") {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end) || placeholderText
    const replacement = `${prefix}${selected}${suffix}`

    const updated =
      value.substring(0, start) + replacement + value.substring(end)
    onChange(updated)

    setTimeout(() => {
      textarea.focus()
      const newCursor = start + prefix.length + selected.length
      textarea.setSelectionRange(newCursor, newCursor)
    }, 10)
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-background">
      <div className="flex flex-wrap items-center justify-between border-b border-border/80 bg-muted/30 p-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormatting("# ", "", "Judul Utama")}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Heading 1"
          >
            <Heading1 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("## ", "", "Subjudul")}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Heading 2"
          >
            <Heading2 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("### ", "", "Topik")}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Heading 3"
          >
            <Heading3 className="size-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-border/80" />

          <button
            type="button"
            onClick={() => insertFormatting("**", "**", "teks tebal")}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Tebal"
          >
            <Bold className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("*", "*", "teks miring")}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Miring"
          >
            <Italic className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("`", "`", "kode")}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Kode Inline"
          >
            <Code className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertFormatting("```ts\n", "\n```", "console.log('hello world')")
            }
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Blok Kode"
          >
            <FileCode className="size-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-border/80" />

          <button
            type="button"
            onClick={() => insertFormatting("> ", "", "Kutipan penting")}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Kutipan"
          >
            <Quote className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("- ", "", "Butir daftar")}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Daftar Poin"
          >
            <List className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("1. ", "", "Butir berurutan")}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Daftar Nomor"
          >
            <ListOrdered className="size-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-border/80" />

          <button
            type="button"
            onClick={() =>
              insertFormatting("[", "](https://example.com)", "Tautan")
            }
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Sisipkan Tautan"
          >
            <LinkIcon className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertFormatting("![", "](https://images.unsplash.com/...)", "Gambar")
            }
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Sisipkan Gambar"
          >
            <ImageIcon className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertFormatting(
                "| Kolom 1 | Kolom 2 |\n| --- | --- |\n| Data A | Data B |\n",
                "",
                ""
              )
            }
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Sisipkan Tabel"
          >
            <TableIcon className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n---\n", "", "")}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Garis Pemisah"
          >
            <Minus className="size-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-background p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("write")}
            className={`flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium transition-colors ${
              viewMode === "write"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="size-3" />
            <span>Tulis</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium transition-colors ${
              viewMode === "preview"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="size-3" />
            <span>Pratinjau</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`hidden items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium transition-colors md:flex ${
              viewMode === "split"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="size-3" />
            <span>Split</span>
          </button>
        </div>
      </div>

      <div className="relative">
        {viewMode === "write" && (
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="w-full resize-y bg-transparent p-4 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        )}

        {viewMode === "preview" && (
          <div className="min-h-72 max-h-[500px] overflow-y-auto p-4 text-xs">
            {renderSimpleMarkdown(value)}
          </div>
        )}

        {viewMode === "split" && (
          <div className="grid grid-cols-2 divide-x divide-border/80">
            <textarea
              ref={textareaRef}
              name={name}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={rows}
              placeholder={placeholder}
              className="w-full resize-y bg-transparent p-4 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="max-h-[500px] overflow-y-auto p-4 text-xs">
              {renderSimpleMarkdown(value)}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border/80 bg-muted/20 px-4 py-2 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{stats.words.toLocaleString("id-ID")} kata</span>
          <span>&bull;</span>
          <span>{stats.chars.toLocaleString("id-ID")} karakter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Estimasi baca:</span>
          <span className="font-semibold text-foreground">
            {stats.readingTime} menit
          </span>
        </div>
      </div>
    </div>
  )
}
