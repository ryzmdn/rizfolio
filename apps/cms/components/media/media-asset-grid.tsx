"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Download,
  Eye,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  HardDrive,
  Calendar,
  Tag,
  ArrowUpDown,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { type MediaAssetItem } from "@/lib/media-types"
import { deleteMediaAsset } from "@/lib/actions/media-browser-actions"

interface MediaAssetGridProps {
  assets: MediaAssetItem[]
  onAssetDeleted?: () => void
}

type SortOption = "newest" | "oldest" | "size-desc" | "size-asc" | "name-asc"

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

function isImageFile(asset: MediaAssetItem): boolean {
  const mime = asset.mimeType?.toLowerCase() || ""
  if (mime.startsWith("image/")) return true
  const ext = asset.name.split(".").pop()?.toLowerCase() || ""
  return ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(ext)
}

function AssetPreviewModal({
  asset,
  isOpen,
  onClose,
}: {
  asset: MediaAssetItem | null
  isOpen: boolean
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !asset) return null

  const isImg = isImageFile(asset)

  function handleCopy() {
    if (!asset) return
    navigator.clipboard.writeText(asset.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2 overflow-hidden">
            {isImg ? (
              <ImageIcon className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <FileText className="h-4 w-4 text-primary shrink-0" />
            )}
            <h3 className="truncate text-xs font-semibold text-foreground">
              {asset.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto bg-black/10 p-6 min-h-[300px]">
          {isImg ? (
            <Image
              src={asset.url}
              alt={asset.name}
              width={800}
              height={600}
              unoptimized
              className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-md"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-12 text-muted-foreground">
              <FileText className="h-16 w-16" />
              <p className="text-xs font-medium text-foreground">
                Pratinjau visual tidak tersedia untuk berkas ini
              </p>
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh Berkas
              </a>
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-primary" />
              Folder: <strong className="text-foreground">{asset.folder}</strong>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <HardDrive className="h-3.5 w-3.5 text-primary" />
              Ukuran: <strong className="text-foreground">{formatFileSize(asset.size)}</strong>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Waktu: <strong className="text-foreground">{formatDate(asset.createdAt)}</strong>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-2">
            <span className="truncate font-mono text-[11px] text-foreground">
              {asset.url}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/80"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin URL</span>
                  </>
                )}
              </button>
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirmModal({
  asset,
  isOpen,
  onClose,
  onDeleted,
}: {
  asset: MediaAssetItem | null
  isOpen: boolean
  onClose: () => void
  onDeleted?: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !asset) return null

  async function handleConfirmDelete() {
    if (!asset) return
    setIsDeleting(true)
    try {
      await deleteMediaAsset(asset.path)
      if (onDeleted) onDeleted()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-sm font-semibold text-foreground">
          Konfirmasi Hapus Aset Media
        </h3>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Apakah Anda yakin ingin menghapus berkas{" "}
          <strong className="text-foreground">{asset.name}</strong> dari bucket
          Supabase Storage? Berkas yang telah dihapus tidak dapat dipulihkan.
        </p>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirmDelete}
            className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-4 py-2 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                Hapus Permanen
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export function MediaAssetGrid({ assets, onAssetDeleted }: MediaAssetGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewAsset, setPreviewAsset] = useState<MediaAssetItem | null>(null)
  const [deletingAsset, setDeletingAsset] = useState<MediaAssetItem | null>(null)

  const filteredAssets = useMemo(() => {
    const list = assets.filter((asset) => {
      const q = searchQuery.toLowerCase()
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.folder.toLowerCase().includes(q)
      )
    })

    return list.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sortBy === "size-desc") {
        return b.size - a.size
      }
      if (sortBy === "size-asc") {
        return a.size - b.size
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
  }, [assets, searchQuery, sortBy])

  function handleCopyUrl(url: string, path: string) {
    navigator.clipboard.writeText(url)
    setCopiedId(path)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama berkas aset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
          >
            <option value="newest">Terbaru Diunggah</option>
            <option value="oldest">Terlama Diunggah</option>
            <option value="size-desc">Ukuran Terbesar</option>
            <option value="size-asc">Ukuran Terkecil</option>
            <option value="name-asc">Nama Berkas (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredAssets.map((asset) => {
          const isImg = isImageFile(asset)
          const isCopied = copiedId === asset.path

          return (
            <div
              key={asset.path}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card transition-all hover:border-border hover:shadow-md"
            >
              <div
                onClick={() => setPreviewAsset(asset)}
                className="relative aspect-square w-full cursor-pointer overflow-hidden bg-muted/30"
              >
                {isImg ? (
                  <Image
                    src={asset.url}
                    alt={asset.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    unoptimized
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <FileText className="h-10 w-10 opacity-70" />
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-[11px] font-medium text-foreground shadow-sm">
                    <Eye className="h-3 w-3" />
                    <span>Pratinjau</span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="absolute left-2 top-2 bg-background/80 text-[9px] backdrop-blur-xs font-mono uppercase"
                >
                  {asset.folder}
                </Badge>
              </div>

              <div className="space-y-1.5 p-3">
                <p
                  title={asset.name}
                  className="truncate text-xs font-medium text-foreground"
                >
                  {asset.name}
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{formatFileSize(asset.size)}</span>
                  <span>{formatDate(asset.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-2">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(asset.url, asset.path)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        <span className="text-emerald-500">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Salin URL</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingAsset(asset)}
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filteredAssets.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Tidak ada aset ditemukan
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sesuaikan kata kunci pencarian atau unggah berkas baru ke folder ini.
            </p>
          </div>
        )}
      </div>

      <AssetPreviewModal
        asset={previewAsset}
        isOpen={Boolean(previewAsset)}
        onClose={() => setPreviewAsset(null)}
      />

      <DeleteConfirmModal
        asset={deletingAsset}
        isOpen={Boolean(deletingAsset)}
        onClose={() => setDeletingAsset(null)}
        onDeleted={onAssetDeleted}
      />
    </div>
  )
}
