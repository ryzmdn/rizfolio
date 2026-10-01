import React from "react"
import {
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileJson,
  FileText,
} from "lucide-react"

interface FileTreeItem {
  name: string
  type: "file" | "folder"
  children?: FileTreeItem[]
  highlight?: boolean
  comment?: string
}

interface FileTreeProps {
  children?: React.ReactNode
  items?: FileTreeItem[]
  title?: string
  className?: string
}

export function FileTree({
  children,
  items,
  title = "Repository Structure",
  className = "",
}: FileTreeProps) {
  return (
    <div
      className={`my-6 overflow-hidden rounded-xl border border-border/80 bg-zinc-950/90 text-zinc-200 shadow-sm dark:border-border/60 ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-900/90 px-4 py-2.5 font-mono text-xs text-zinc-400">
          <Folder className="size-3.5 text-primary" />
          <span className="font-medium text-zinc-200">{title}</span>
        </div>
      )}
      <div className="space-y-1 p-4 font-mono text-xs leading-relaxed">
        {items ? renderTreeItems(items) : children}
      </div>
    </div>
  )
}

function getFileIcon(name: string) {
  if (name.endsWith(".ts") || name.endsWith(".tsx")) {
    return <FileCode className="size-3.5 text-sky-400" />
  }
  if (name.endsWith(".json")) {
    return <FileJson className="size-3.5 text-amber-400" />
  }
  if (name.endsWith(".md") || name.endsWith(".mdx")) {
    return <FileText className="size-3.5 text-emerald-400" />
  }
  return <File className="size-3.5 text-zinc-400" />
}

function renderTreeItems(items: FileTreeItem[], depth = 0): React.ReactNode {
  return items.map((item, idx) => (
    <div key={`${item.name}-${idx}`} className="space-y-1">
      <div
        className={`flex items-center gap-2 rounded px-1.5 py-0.5 transition-colors ${
          item.highlight
            ? "bg-primary/20 font-medium text-primary"
            : "hover:bg-zinc-800/40"
        }`}
        style={{ paddingLeft: `${depth * 16 + 6}px` }}
      >
        {item.type === "folder" ? (
          <FolderOpen className="size-3.5 shrink-0 text-amber-400/90" />
        ) : (
          getFileIcon(item.name)
        )}
        <span className="truncate">{item.name}</span>
        {item.comment && (
          <span className="ml-auto text-[11px] text-zinc-500 italic">
            {"// " + item.comment}
          </span>
        )}
      </div>
      {item.children && renderTreeItems(item.children, depth + 1)}
    </div>
  ))
}

export function TreeFolder({
  name,
  children,
  comment,
}: {
  name: string
  children: React.ReactNode
  comment?: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-1.5 py-0.5 font-medium text-zinc-200">
        <FolderOpen className="size-3.5 shrink-0 text-amber-400/90" />
        <span>{name}</span>
        {comment && (
          <span className="ml-auto text-[11px] text-zinc-500 italic">
            {"// " + comment}
          </span>
        )}
      </div>
      <div className="ml-2 space-y-1 border-l border-zinc-800/60 pl-4">
        {children}
      </div>
    </div>
  )
}

export function TreeFile({
  name,
  comment,
  highlight,
}: {
  name: string
  comment?: string
  highlight?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded px-1.5 py-0.5 transition-colors ${
        highlight
          ? "bg-primary/20 font-medium text-primary"
          : "text-zinc-300 hover:bg-zinc-800/40"
      }`}
    >
      {getFileIcon(name)}
      <span>{name}</span>
      {comment && (
        <span className="ml-auto text-[11px] text-zinc-500 italic">
          {"// " + comment}
        </span>
      )}
    </div>
  )
}
