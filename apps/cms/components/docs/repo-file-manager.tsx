"use client"

import { useState, useMemo } from "react"
import {
  Folder,
  FileCode,
  Plus,
  Trash2,
  Search,
  Code,
  X,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { createRepoFile, deleteRepoFile } from "@/lib/actions/docs-actions"

interface RepositoryItem {
  id: string
  name: string
  slug: string
}

interface RepoFileItem {
  id: string
  repoId: string
  path: string
  filename: string
  sizeBytes: number
  isDirectory: boolean
  storageUrl?: string | null
  contentText?: string | null
}

interface RepoFileManagerProps {
  repositories: RepositoryItem[]
  files: RepoFileItem[]
}

export function RepoFileManager({ repositories, files }: RepoFileManagerProps) {
  const [selectedRepoId, setSelectedRepoId] = useState<string>(
    repositories[0]?.id || "ALL"
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<RepoFileItem | null>(null)

  const [formRepoId, setFormRepoId] = useState<string>(
    repositories[0]?.id || ""
  )
  const [filePath, setFilePath] = useState("")
  const [filename, setFilename] = useState("")
  const [isDirectory, setIsDirectory] = useState(false)
  const [sizeBytes, setSizeBytes] = useState(0)
  const [contentText, setContentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const repoMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const r of repositories) {
      map.set(r.id, r.name)
    }
    return map
  }, [repositories])

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchRepo =
        selectedRepoId === "ALL" || f.repoId === selectedRepoId
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        f.path.toLowerCase().includes(q) ||
        f.filename.toLowerCase().includes(q)
      return matchRepo && matchSearch
    })
  }, [files, selectedRepoId, searchQuery])

  async function handleCreateFile(e: React.FormEvent) {
    e.preventDefault()
    if (!formRepoId || !filename.trim()) return

    const fullPath = filePath.trim()
      ? `${filePath.trim().replace(/^\/+|\/+$/g, "")}/${filename.trim()}`
      : filename.trim()

    setIsSubmitting(true)
    try {
      await createRepoFile({
        repoId: formRepoId,
        path: fullPath,
        filename: filename.trim(),
        isDirectory,
        sizeBytes: isDirectory ? 0 : Number(sizeBytes) || contentText.length,
        contentText: isDirectory ? null : contentText || null,
        parentPath: filePath.trim().replace(/^\/+|\/+$/g, ""),
      })

      setFilePath("")
      setFilename("")
      setContentText("")
      setSizeBytes(0)
      setIsDirectory(false)
      setIsFormOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-foreground">
              Filter Berdasarkan Repositori:
            </span>
            <select
              value={selectedRepoId}
              onChange={(e) => setSelectedRepoId(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="ALL">Semua Repositori ({files.length} berkas)</option>
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.id}>
                  {repo.name}
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
          <span>{isFormOpen ? "Tutup Formulir" : "Tambah Berkas Kode"}</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleCreateFile} className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Tambah Berkas / Direktori Kode Baru
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
                Target Repositori
              </label>
              <select
                value={formRepoId}
                onChange={(e) => setFormRepoId(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                {repositories.map((repo) => (
                  <option key={repo.id} value={repo.id}>
                    {repo.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Direktori Induk (Opsional)
              </label>
              <input
                type="text"
                placeholder="e.g. src/components"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Nama Berkas / Folder
              </label>
              <input
                type="text"
                placeholder="e.g. button.tsx atau lib"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
              <input
                type="checkbox"
                checked={isDirectory}
                onChange={(e) => setIsDirectory(e.target.checked)}
                className="rounded border-border text-primary"
              />
              <span>Merupakan Direktori / Folder</span>
            </label>

            {!isDirectory && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">
                  Ukuran Berkas (Bytes):
                </label>
                <input
                  type="number"
                  value={sizeBytes}
                  onChange={(e) => setSizeBytes(Number(e.target.value))}
                  min={0}
                  className="w-28 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none"
                />
              </div>
            )}
          </div>

          {!isDirectory && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Konten Kode Teks (Source Code)
              </label>
              <textarea
                rows={8}
                placeholder="Tempelkan atau ketik kode sumber berkas di sini..."
                value={contentText}
                onChange={(e) => {
                  setContentText(e.target.value)
                  if (sizeBytes === 0) {
                    setSizeBytes(e.target.value.length)
                  }
                }}
                className="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Plus className="size-3.5" />
              <span>{isSubmitting ? "Menyimpan..." : "Simpan Berkas"}</span>
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground flex items-center justify-between">
          <span>Struktur Pohon Berkas Kode ({filteredFiles.length} entri)</span>
          {selectedRepoId !== "ALL" && (
            <Badge variant="outline" className="text-[10px]">
              {repoMap.get(selectedRepoId)}
            </Badge>
          )}
        </div>

        <div className="divide-y divide-border/40 text-xs">
          {filteredFiles.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Belum ada berkas kode terdaftar pada repositori ini.
            </div>
          ) : (
            filteredFiles.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/20"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-foreground">
                    {f.isDirectory ? (
                      <Folder className="size-3.5 text-amber-500" />
                    ) : (
                      <FileCode className="size-3.5 text-blue-500" />
                    )}
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-foreground truncate">
                        {f.path}
                      </span>
                      {f.isDirectory && (
                        <Badge variant="secondary" className="text-[9px]">
                          Folder
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {repoMap.get(f.repoId) || f.repoId} &bull;{" "}
                      {f.isDirectory ? "Direktori" : formatBytes(f.sizeBytes)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {f.contentText && (
                    <button
                      type="button"
                      onClick={() => setPreviewFile(f)}
                      className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <Code className="size-3 text-muted-foreground" />
                      <span>Lihat Kode</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Hapus berkas "${f.path}"?`)) {
                        await deleteRepoFile(f.id)
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

      {previewFile && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setPreviewFile(null)}
          />
          <div className="relative z-50 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <FileCode className="size-4 text-blue-500" />
                <span className="font-semibold text-foreground">
                  {previewFile.path}
                </span>
                <span className="text-muted-foreground">
                  ({formatBytes(previewFile.sizeBytes)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-muted/20 p-4">
              <pre className="font-mono text-xs leading-relaxed text-foreground">
                <code>{previewFile.contentText}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
