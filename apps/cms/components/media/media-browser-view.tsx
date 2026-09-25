"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  HardDrive,
  Files,
  FolderOpen,
  Globe2,
  RefreshCw,
} from "lucide-react"
import {
  type MediaAssetItem,
  type MediaFolder,
} from "@/lib/media-types"
import { MediaFolderTabs } from "./media-folder-tabs"
import { MediaAssetGrid } from "./media-asset-grid"
import { MediaUploadZone } from "./media-upload-zone"

interface MediaBrowserViewProps {
  initialAssets: MediaAssetItem[]
}

function formatTotalSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function MediaBrowserView({ initialAssets }: MediaBrowserViewProps) {
  const router = useRouter()
  const [selectedFolder, setSelectedFolder] = useState<MediaFolder>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const counts = useMemo(() => {
    return {
      all: initialAssets.length,
      general: initialAssets.filter((a) => a.folder === "general").length,
      blog: initialAssets.filter((a) => a.folder === "blog").length,
      portfolio: initialAssets.filter((a) => a.folder === "portfolio").length,
      products: initialAssets.filter((a) => a.folder === "products").length,
    }
  }, [initialAssets])

  const totalBytes = useMemo(() => {
    return initialAssets.reduce((acc, curr) => acc + curr.size, 0)
  }, [initialAssets])

  const visibleAssets = useMemo(() => {
    if (selectedFolder === "all") return initialAssets
    return initialAssets.filter((a) => a.folder === selectedFolder)
  }, [initialAssets, selectedFolder])

  function handleRefresh() {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 800)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Aset Media</span>
            <Files className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {initialAssets.length}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Kapasitas Terpakai</span>
            <HardDrive className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-500">
            {formatTotalSize(totalBytes)}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Folder Aktif</span>
            <FolderOpen className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground capitalize">
            {selectedFolder === "all" ? "Semua Folder" : selectedFolder}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Infrastruktur CDN</span>
            <Globe2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-500">
            Supabase Edge
          </p>
        </div>
      </div>

      <MediaUploadZone
        currentFolder={selectedFolder}
        onUploadComplete={handleRefresh}
      />

      <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Jelajahi Aset Media
          </h3>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Segarkan</span>
          </button>
        </div>

        <MediaFolderTabs
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          counts={counts}
        />

        <MediaAssetGrid
          assets={visibleAssets}
          onAssetDeleted={handleRefresh}
        />
      </div>
    </div>
  )
}
