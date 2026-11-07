"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Folder,
  FileCode,
  FileText,
  File,
  CornerLeftUp,
  Search,
  X,
  FileJson,
} from "lucide-react"

export interface RepoFileItem {
  id: string
  path: string
  filename: string
  isDirectory: boolean
  parentPath: string
  sizeBytes: number
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getFileIcon(filename: string, isDirectory: boolean) {
  if (isDirectory) {
    return (
      <Folder className="size-4 text-foreground/80 group-hover:text-foreground" />
    )
  }

  const lower = filename.toLowerCase()

  if (
    lower.endsWith(".ts") ||
    lower.endsWith(".tsx") ||
    lower.endsWith(".js") ||
    lower.endsWith(".jsx") ||
    lower.endsWith(".go") ||
    lower.endsWith(".c") ||
    lower.endsWith(".cpp") ||
    lower.endsWith(".h") ||
    lower.endsWith(".py") ||
    lower.endsWith(".rs") ||
    lower.endsWith(".sh") ||
    lower === "makefile" ||
    lower === "dockerfile"
  ) {
    return (
      <FileCode className="size-4 text-muted-foreground group-hover:text-foreground" />
    )
  }

  if (
    lower.endsWith(".json") ||
    lower.endsWith(".yaml") ||
    lower.endsWith(".yml") ||
    lower.endsWith(".toml")
  ) {
    return (
      <FileJson className="size-4 text-muted-foreground group-hover:text-foreground" />
    )
  }

  if (lower.endsWith(".md") || lower.endsWith(".txt")) {
    return (
      <FileText className="size-4 text-muted-foreground group-hover:text-foreground" />
    )
  }

  return (
    <File className="size-4 text-muted-foreground group-hover:text-foreground" />
  )
}

export function FileTreeBrowser({
  slug,
  files = [],
  currentPath = "",
}: {
  slug: string
  files: RepoFileItem[]
  currentPath?: string
}) {
  const [filterQuery, setFilterQuery] = useState("")

  const parentPathParts = currentPath
    ? currentPath.split("/").filter(Boolean)
    : []
  const hasParent = parentPathParts.length > 0
  const backPath = parentPathParts.slice(0, -1).join("/")

  const displayedFiles = filterQuery.trim()
    ? files.filter((f) =>
        f.filename.toLowerCase().includes(filterQuery.toLowerCase().trim())
      )
    : files

  return (
    <div className="overflow-hidden rounded-3xl border border-foreground/8 bg-card/40 backdrop-blur-xl shadow-xs">
      <div className="flex flex-col gap-3 border-b border-foreground/8 bg-foreground/[0.02] px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <Link
            href={`/repo/${slug}`}
            className="text-foreground transition-colors hover:underline"
          >
            {slug}
          </Link>

          {parentPathParts.map((segment, idx) => {
            const segmentPath = parentPathParts.slice(0, idx + 1).join("/")
            const isLast = idx === parentPathParts.length - 1
            return (
              <span key={segmentPath} className="flex items-center gap-2">
                <span className="text-foreground/20">/</span>
                {isLast ? (
                  <span className="font-semibold text-foreground">{segment}</span>
                ) : (
                  <Link
                    href={`/repo/${slug}?path=${encodeURIComponent(segmentPath)}`}
                    className="text-muted-foreground transition-colors hover:text-foreground hover:underline"
                  >
                    {segment}
                  </Link>
                )}
              </span>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Cari file..."
              className="w-36 rounded-full border border-foreground/10 bg-background/60 py-1 pr-7 pl-8 font-mono text-[11px] text-foreground transition-all placeholder:text-muted-foreground focus:w-48 focus:border-foreground/30 focus:outline-hidden"
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => setFilterQuery("")}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
            {displayedFiles.length} item{displayedFiles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="divide-y divide-foreground/5 text-xs">
        {hasParent && (
          <Link
            href={
              backPath
                ? `/repo/${slug}?path=${encodeURIComponent(backPath)}`
                : `/repo/${slug}`
            }
            className="flex items-center gap-3 px-5 py-3 text-muted-foreground transition-colors hover:bg-foreground/[0.02] hover:text-foreground"
          >
            <CornerLeftUp className="size-3.5" />
            <span className="font-mono text-[11px]">.. (direktori induk)</span>
          </Link>
        )}

        {displayedFiles.length === 0 && (
          <div className="px-5 py-12 text-center font-mono text-xs text-muted-foreground">
            {filterQuery
              ? `Tidak ada file yang cocok dengan "${filterQuery}".`
              : "Direktori kosong atau belum ada berkas."}
          </div>
        )}

        {displayedFiles.map((file) => {
          const fileHref = file.isDirectory
            ? `/repo/${slug}?path=${encodeURIComponent(file.path)}`
            : `/repo/${slug}/blob/${file.path}`

          return (
            <Link
              key={file.id}
              href={fileHref}
              className="group flex items-center justify-between px-5 py-3 transition-colors hover:bg-foreground/[0.02]"
            >
              <div className="flex min-w-0 items-center gap-3">
                {getFileIcon(file.filename, file.isDirectory)}
                <span className="truncate font-mono text-[11px] text-foreground/90 underline-offset-4 group-hover:text-foreground group-hover:underline">
                  {file.filename}
                </span>
              </div>

              {!file.isDirectory && (
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                  {formatBytes(file.sizeBytes)}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
