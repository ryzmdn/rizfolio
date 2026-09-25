"use client"

import { useState } from "react"
import { X, Save, Loader2 } from "lucide-react"
import { updateChangelog } from "@/lib/actions/changelog-actions"

interface ChangelogItem {
  id: string
  version: string
  title: string
  releaseDate: string
  summary: string | null
  isPublished: boolean
}

interface ChangelogEditDialogProps {
  changelog: ChangelogItem | null
  isOpen: boolean
  onClose: () => void
}

interface ChangelogEditFormProps {
  changelog: ChangelogItem
  onClose: () => void
}

function ChangelogEditForm({ changelog, onClose }: ChangelogEditFormProps) {
  const [version, setVersion] = useState(changelog.version || "")
  const [title, setTitle] = useState(changelog.title || "")
  const [releaseDate, setReleaseDate] = useState(changelog.releaseDate || "")
  const [summary, setSummary] = useState(changelog.summary || "")
  const [isPublished, setIsPublished] = useState(changelog.isPublished ?? true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!version.trim() || !title.trim() || !releaseDate.trim()) return

    setIsSubmitting(true)
    try {
      await updateChangelog(changelog.id, {
        version: version.trim(),
        title: title.trim(),
        releaseDate: releaseDate.trim(),
        summary: summary.trim() || null,
        isPublished,
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Nomor Versi Rilis
          </label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-foreground">
            Judul Rilis Pembaruan
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Tanggal Rilis
          </label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Status Publikasi
          </label>
          <select
            value={isPublished ? "true" : "false"}
            onChange={(e) => setIsPublished(e.target.value === "true")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="true">Publik (Tampil di Timeline)</option>
            <option value="false">Draf (Hanya Admin)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Ringkasan Pembaruan (Summary)
        </label>
        <textarea
          rows={4}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Ringkasan perubahan, fitur baru utama, dan perbaikan stabilitas..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border/80 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border/80 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Menyimpan Rilis...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export function ChangelogEditDialog({
  changelog,
  isOpen,
  onClose,
}: ChangelogEditDialogProps) {
  if (!isOpen || !changelog) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Catatan Rilis Changelog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-50 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Edit Rilis: {changelog.version} - {changelog.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Perbarui judul rilis, tanggal rilis, ringkasan, dan status publikasi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <ChangelogEditForm
          key={changelog.id}
          changelog={changelog}
          onClose={onClose}
        />
      </div>
    </div>
  )
}
