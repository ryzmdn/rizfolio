"use client"

import { useState } from "react"
import { X, Save, Loader2 } from "lucide-react"
import { MarkdownEditor } from "../blog/markdown-editor"
import { updateRepository } from "@/lib/actions/docs-actions"

interface RepositoryItem {
  id: string
  name: string
  slug: string
  description: string | null
  category: string
  courseName: string | null
  semester: string | null
  techStack: string[] | null
  githubUrl: string | null
  demoUrl: string | null
  license: string | null
  starsCount: number
  downloadsCount: number
  readmeContent: string | null
  isPublic: boolean
}

interface RepoEditDialogProps {
  repo: RepositoryItem | null
  isOpen: boolean
  onClose: () => void
}

interface RepoEditFormProps {
  repo: RepositoryItem
  onClose: () => void
}

function RepoEditForm({ repo, onClose }: RepoEditFormProps) {
  const [name, setName] = useState(repo.name || "")
  const [slug, setSlug] = useState(repo.slug || "")
  const [description, setDescription] = useState(repo.description || "")
  const [category, setCategory] = useState(repo.category || "OPEN_SOURCE")
  const [courseName, setCourseName] = useState(repo.courseName || "")
  const [semester, setSemester] = useState(repo.semester || "")
  const [techStackInput, setTechStackInput] = useState(
    repo.techStack?.join(", ") || ""
  )
  const [githubUrl, setGithubUrl] = useState(repo.githubUrl || "")
  const [demoUrl, setDemoUrl] = useState(repo.demoUrl || "")
  const [license, setLicense] = useState(repo.license || "MIT")
  const [starsCount, setStarsCount] = useState(repo.starsCount || 0)
  const [downloadsCount, setDownloadsCount] = useState(repo.downloadsCount || 0)
  const [isPublic, setIsPublic] = useState(repo.isPublic ?? true)
  const [readmeContent, setReadmeContent] = useState(repo.readmeContent || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) return

    setIsSubmitting(true)
    try {
      const parsedTechStack = techStackInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      await updateRepository(repo.id, {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim() || null,
        category,
        courseName: courseName.trim() || null,
        semester: semester.trim() || null,
        techStack: parsedTechStack.length > 0 ? parsedTechStack : null,
        githubUrl: githubUrl.trim() || null,
        demoUrl: demoUrl.trim() || null,
        license: license.trim() || "MIT",
        starsCount: Number(starsCount) || 0,
        downloadsCount: Number(downloadsCount) || 0,
        isPublic,
        readmeContent: readmeContent || null,
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
            Nama Repositori / Proyek
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Kategori
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="OPEN_SOURCE">Open Source</option>
            <option value="EXPERIMENT">Eksperimen</option>
            <option value="ASSIGNMENT">Tugas Kuliah / Akademik</option>
          </select>
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
            Lisensi
          </label>
          <input
            type="text"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            placeholder="MIT, Apache-2.0"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Visibilitas Publik
          </label>
          <select
            value={isPublic ? "true" : "false"}
            onChange={(e) => setIsPublic(e.target.value === "true")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="true">Publik (Tampil di Docs)</option>
            <option value="false">Privat (Hanya Admin)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Deskripsi Repositori
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ringkasan tujuan repositori, fitur utama, dan arsitektur..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Mata Kuliah / Topik (Opsional)
          </label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g. Distributed Systems"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Semester / Batch (Opsional)
          </label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="e.g. Semester 6 / 2026"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Tech Stack (Pisahkan dengan koma)
        </label>
        <input
          type="text"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
          placeholder="e.g. Next.js, TypeScript, Go, PostgreSQL, Docker"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            GitHub URL
          </label>
          <input
            type="text"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Live Demo URL
          </label>
          <input
            type="text"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://demo.ryzmdn.me"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Jumlah Bintang (Stars Count)
          </label>
          <input
            type="number"
            value={starsCount}
            onChange={(e) => setStarsCount(Number(e.target.value))}
            min={0}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Jumlah Unduhan (Downloads Count)
          </label>
          <input
            type="number"
            value={downloadsCount}
            onChange={(e) => setDownloadsCount(Number(e.target.value))}
            min={0}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          README Konten Repositori (Markdown)
        </label>
        <MarkdownEditor
          value={readmeContent}
          onChange={setReadmeContent}
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
              <span>Menyimpan Repositori...</span>
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

export function RepoEditDialog({ repo, isOpen, onClose }: RepoEditDialogProps) {
  if (!isOpen || !repo) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Repositori"
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
              Edit Repositori: {repo.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              Perbarui metadata proyek, tech stack, lisensi, dan dokumentasi README.
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

        <RepoEditForm key={repo.id} repo={repo} onClose={onClose} />
      </div>
    </div>
  )
}
