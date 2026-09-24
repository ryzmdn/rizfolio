"use client"

import { useState, useMemo } from "react"
import {
  FileArchive,
  Plus,
  Trash2,
  Search,
  X,
  Calendar,
  HardDrive,
  Loader2,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { createProductFile, deleteProductFile } from "@/lib/actions/shop-actions"

interface ProductItem {
  id: string
  title: string
  slug: string
}

interface ProductFileItem {
  id: string
  productId: string
  fileName: string
  fileSizeBytes: number
  storagePath: string
  createdAt: Date
}

interface ProductFileManagerProps {
  products: ProductItem[]
  files: ProductFileItem[]
}

export function ProductFileManager({
  products,
  files,
}: ProductFileManagerProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [formProductId, setFormProductId] = useState<string>(
    products[0]?.id || ""
  )
  const [fileName, setFileName] = useState("")
  const [fileSizeBytes, setFileSizeBytes] = useState(0)
  const [storagePath, setStoragePath] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const productMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const p of products) {
      map.set(p.id, p.title)
    }
    return map
  }, [products])

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchProduct =
        selectedProductId === "ALL" || f.productId === selectedProductId
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        f.fileName.toLowerCase().includes(q) ||
        f.storagePath.toLowerCase().includes(q)
      return matchProduct && matchSearch
    })
  }, [files, selectedProductId, searchQuery])

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  async function handleCreateFile(e: React.FormEvent) {
    e.preventDefault()
    if (!formProductId || !fileName.trim() || !storagePath.trim()) return

    setIsSubmitting(true)
    try {
      await createProductFile({
        productId: formProductId,
        fileName: fileName.trim(),
        fileSizeBytes: Number(fileSizeBytes) || 0,
        storagePath: storagePath.trim(),
      })

      setFileName("")
      setFileSizeBytes(0)
      setStoragePath("")
      setIsFormOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-foreground">
              Filter Berdasarkan Produk:
            </span>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="ALL">Semua Produk ({files.length} berkas)</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-foreground">
              Cari Berkas:
            </span>
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari nama berkas atau path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-60"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>{isFormOpen ? "Tutup Formulir" : "Tambah Berkas Unduhan"}</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleCreateFile} className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Lampirkan Berkas Unduhan Digital
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Target Produk Digital
              </label>
              <select
                value={formProductId}
                onChange={(e) => setFormProductId(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Nama Berkas Rilis
              </label>
              <input
                type="text"
                placeholder="e.g. project-assets-v1.0.zip"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Ukuran Berkas (Bytes)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="e.g. 1048576"
                  value={fileSizeBytes}
                  onChange={(e) => setFileSizeBytes(Number(e.target.value))}
                  min={0}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  ({formatBytes(fileSizeBytes)})
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Storage Path / URL Berkas Aman
            </label>
            <input
              type="text"
              placeholder="e.g. products/zip/project-assets-v1.0.zip"
              value={storagePath}
              onChange={(e) => setStoragePath(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>Simpan Berkas Unduhan</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground flex items-center justify-between">
          <span>Daftar Berkas Unduhan Digital ({filteredFiles.length} berkas)</span>
          {selectedProductId !== "ALL" && (
            <Badge variant="outline" className="text-[10px]">
              {productMap.get(selectedProductId)}
            </Badge>
          )}
        </div>

        <div className="divide-y divide-border/40 text-xs">
          {filteredFiles.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Belum ada berkas unduhan terdaftar pada produk ini.
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/20"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-foreground">
                    <FileArchive className="size-4 text-primary" />
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-foreground truncate">
                        {file.fileName}
                      </span>
                      <Badge variant="outline" className="text-[9px]">
                        {formatBytes(file.fileSizeBytes)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                      <span className="font-semibold text-foreground/80">
                        {productMap.get(file.productId) || file.productId}
                      </span>
                      <span>&bull;</span>
                      <div className="flex items-center gap-1">
                        <HardDrive className="size-3" />
                        <span className="truncate">{file.storagePath}</span>
                      </div>
                      <span>&bull;</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>
                          {new Date(file.createdAt).toLocaleDateString("id-ID", {
                            dateStyle: "medium",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Hapus berkas unduhan "${file.fileName}"?`)) {
                        await deleteProductFile(file.id)
                      }
                    }}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Hapus Berkas"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
