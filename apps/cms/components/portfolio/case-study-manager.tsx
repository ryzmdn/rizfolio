"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  X,
  Loader2,
  Calendar,
  Save,
  FolderGit2,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { MarkdownEditor } from "../blog/markdown-editor"
import {
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from "@/lib/actions/portfolio-actions"

interface CaseStudyItem {
  id: string
  slug: string
  title: string
  clientName: string | null
  summary: string
  contentMd: string
  thumbnailUrl: string | null
  liveUrl: string | null
  repoUrl: string | null
  metrics: unknown
  isPublished: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

interface CaseStudyManagerProps {
  caseStudies: CaseStudyItem[]
}

function CaseStudyEditDialog({
  study,
  isOpen,
  onClose,
}: {
  study: CaseStudyItem | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen || !study) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Studi Kasus"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-50 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Edit Studi Kasus: {study.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Perbarui analisis arsitektur, hasil metrik, tautan repositori, dan konten Markdown.
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

        <CaseStudyEditForm key={study.id} study={study} onClose={onClose} />
      </div>
    </div>
  )
}

function CaseStudyEditForm({
  study,
  onClose,
}: {
  study: CaseStudyItem
  onClose: () => void
}) {
  const [title, setTitle] = useState(study.title || "")
  const [slug, setSlug] = useState(study.slug || "")
  const [clientName, setClientName] = useState(study.clientName || "")
  const [summary, setSummary] = useState(study.summary || "")
  const [contentMd, setContentMd] = useState(study.contentMd || "")
  const [thumbnailUrl, setThumbnailUrl] = useState(study.thumbnailUrl || "")
  const [liveUrl, setLiveUrl] = useState(study.liveUrl || "")
  const [repoUrl, setRepoUrl] = useState(study.repoUrl || "")
  const [isPublished, setIsPublished] = useState(study.isPublished ?? false)
  const [displayOrder, setDisplayOrder] = useState<number | string>(
    study.displayOrder || 0
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return

    setIsSubmitting(true)
    try {
      await updateCaseStudy(study.id, {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        clientName: clientName.trim() || null,
        summary: summary.trim(),
        contentMd,
        thumbnailUrl: thumbnailUrl.trim() || null,
        liveUrl: liveUrl.trim() || null,
        repoUrl: repoUrl.trim() || null,
        isPublished,
        displayOrder: Number(displayOrder) || 0,
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-foreground">
            Judul Studi Kasus
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Klien / Organisasi
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Fintech Global Corp"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Slug URL
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
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
            <option value="true">Publik (Tampil di Portofolio)</option>
            <option value="false">Draf (Konsep)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Urutan Tampilan
          </label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Ringkasan Tantangan & Solusi (Summary)
        </label>
        <textarea
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            URL Gambar Sampul (Thumbnail)
          </label>
          <input
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Live URL Proyek
          </label>
          <input
            type="text"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://client-demo.com"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            URL Repositori Kode
          </label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Konten Studi Kasus Mendalam (Markdown)
        </label>
        <MarkdownEditor
          value={contentMd}
          onChange={setContentMd}
          rows={12}
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
              <span>Menyimpan...</span>
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

export function CaseStudyManager({ caseStudies }: CaseStudyManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStudy, setEditingStudy] = useState<CaseStudyItem | null>(null)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [clientName, setClientName] = useState("")
  const [summary, setSummary] = useState("")
  const [contentMd, setContentMd] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [displayOrder, setDisplayOrder] = useState<number | string>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredCaseStudies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return caseStudies.filter((cs) => {
      const matchSearch =
        !q ||
        cs.title.toLowerCase().includes(q) ||
        cs.slug.toLowerCase().includes(q) ||
        (cs.clientName && cs.clientName.toLowerCase().includes(q)) ||
        cs.summary.toLowerCase().includes(q)

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && cs.isPublished) ||
        (statusFilter === "DRAFT" && !cs.isPublished)

      return matchSearch && matchStatus
    })
  }, [caseStudies, searchQuery, statusFilter])

  async function handleCreateCaseStudy(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const generatedSlug =
      slug.trim().toLowerCase() ||
      title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")

    setIsSubmitting(true)
    try {
      await createCaseStudy({
        title: title.trim(),
        slug: generatedSlug,
        clientName: clientName.trim() || null,
        summary: summary.trim(),
        contentMd: contentMd || "# " + title.trim(),
        thumbnailUrl: thumbnailUrl.trim() || null,
        liveUrl: liveUrl.trim() || null,
        repoUrl: repoUrl.trim() || null,
        isPublished,
        displayOrder: Number(displayOrder) || 1,
      })

      setTitle("")
      setSlug("")
      setClientName("")
      setSummary("")
      setContentMd("")
      setThumbnailUrl("")
      setLiveUrl("")
      setRepoUrl("")
      setIsPublished(true)
      setDisplayOrder((prev) => Number(prev) + 1)
      setIsFormOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari judul, klien, topik studi kasus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-72"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Publik</option>
            <option value="DRAFT">Draf</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>{isFormOpen ? "Tutup Formulir" : "Tambah Studi Kasus"}</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleCreateCaseStudy} className="space-y-5 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Tulis Studi Kasus Proyek Baru
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
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-foreground">
                Judul Studi Kasus
              </label>
              <input
                type="text"
                placeholder="e.g. Distributed Core Engine Migration"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!slug) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]/g, "")
                    )
                  }
                }}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Nama Klien / Perusahaan
              </label>
              <input
                type="text"
                placeholder="e.g. Enterprise Logistics Corp"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Slug URL
              </label>
              <input
                type="text"
                placeholder="distributed-core-engine-migration"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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
                <option value="true">Publik (Tampil di Portofolio)</option>
                <option value="false">Draf (Konsep)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Urutan Tampilan
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                min={1}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Ringkasan Studi Kasus (Excerpt)
            </label>
            <textarea
              rows={2}
              placeholder="Ringkasan singkat masalah arsitektur, teknologi yang digunakan, dan dampak solusi..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                URL Gambar Sampul (Thumbnail)
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Live URL Demo / Production
              </label>
              <input
                type="text"
                placeholder="https://project.com"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                URL Repositori GitHub
              </label>
              <input
                type="text"
                placeholder="https://github.com/..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Konten Dokumentasi Studi Kasus (Markdown)
            </label>
            <MarkdownEditor
              value={contentMd}
              onChange={setContentMd}
              rows={10}
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
                  <span>Simpan Studi Kasus</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground flex items-center justify-between">
          <span>Daftar Studi Kasus ({filteredCaseStudies.length})</span>
        </div>

        <div className="divide-y divide-border/40 text-xs">
          {filteredCaseStudies.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Belum ada studi kasus proyek terdaftar.
            </div>
          ) : (
            filteredCaseStudies.map((study) => (
              <div
                key={study.id}
                className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3.5">
                  {study.thumbnailUrl ? (
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border">
                      <Image
                        src={study.thumbnailUrl}
                        alt={study.title}
                        width={48}
                        height={48}
                        unoptimized
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-foreground">
                      <Briefcase className="size-5 text-muted-foreground" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {study.title}
                      </span>
                      {study.clientName && (
                        <Badge variant="outline" className="text-[10px]">
                          {study.clientName}
                        </Badge>
                      )}
                      <Badge
                        variant={study.isPublished ? "default" : "secondary"}
                        className="text-[9px]"
                      >
                        {study.isPublished ? "Publik" : "Draf"}
                      </Badge>
                    </div>

                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {study.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground/80">
                        /{study.slug}
                      </span>
                      <span>&bull;</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>
                          {new Date(study.createdAt).toLocaleDateString(
                            "id-ID",
                            { dateStyle: "medium" }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {study.liveUrl && (
                    <a
                      href={study.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex size-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      title="Kunjungi Live Demo"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}

                  {study.repoUrl && (
                    <a
                      href={study.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex size-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      title="Lihat Repositori GitHub"
                    >
                      <FolderGit2 className="size-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setEditingStudy(study)}
                    className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <Pencil className="size-3.5 text-muted-foreground" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Hapus studi kasus "${study.title}"?`)) {
                        await deleteCaseStudy(study.id)
                      }
                    }}
                    className="flex size-8 items-center justify-center rounded-lg border border-destructive/20 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Hapus Studi Kasus"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CaseStudyEditDialog
        study={editingStudy}
        isOpen={Boolean(editingStudy)}
        onClose={() => setEditingStudy(null)}
      />
    </div>
  )
}
