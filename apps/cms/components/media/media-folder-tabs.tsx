"use client"

import { Folder, FolderOpen, Layers, BookOpen, Package, Image as ImageIcon } from "lucide-react"
import { MediaFolder } from "@/lib/media-types"

interface FolderCounts {
  all: number
  general: number
  blog: number
  portfolio: number
  products: number
}

interface MediaFolderTabsProps {
  selectedFolder: MediaFolder
  onSelectFolder: (folder: MediaFolder) => void
  counts: FolderCounts
}

export function MediaFolderTabs({
  selectedFolder,
  onSelectFolder,
  counts,
}: MediaFolderTabsProps) {
  const tabs: { key: MediaFolder; label: string; icon: typeof Folder }[] = [
    { key: "all", label: "Semua Aset", icon: Layers },
    { key: "general", label: "General", icon: FolderOpen },
    { key: "blog", label: "Blog", icon: BookOpen },
    { key: "portfolio", label: "Portofolio", icon: ImageIcon },
    { key: "products", label: "Produk", icon: Package },
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isSelected = selectedFolder === tab.key
        const count = counts[tab.key] || 0

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectFolder(tab.key)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors shrink-0 ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                isSelected
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
