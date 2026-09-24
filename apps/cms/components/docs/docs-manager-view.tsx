"use client"

import { useState, useMemo } from "react"
import {
  FolderGit2,
  FileCode,
  FileArchive,
  Search,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  Download,
  Eye,
  Calendar,
  Layers,
  BookOpen,
  Loader2,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { MarkdownEditor } from "../blog/markdown-editor"
import { RepoEditDialog } from "./repo-edit-dialog"
import { RepoFileManager } from "./repo-file-manager"
import { RepoReleaseManager } from "./repo-release-manager"
import { createRepository, deleteRepository } from "@/lib/actions/docs-actions"

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
  viewsCount: number
  downloadsCount: number
  readmeContent: string | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
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

interface RepoReleaseItem {
  id: string
  repoId: string
  versionTag: string
  zipStoragePath: string
  changelog: string | null
  createdAt: Date
}

interface DocsManagerViewProps {
  repositories: RepositoryItem[]
  files: RepoFileItem[]
  releases: RepoReleaseItem[]
}

type DocsTab = "REPOSITORIES" | "FILES" | "RELEASES"

export function DocsManagerView({
  repositories,
  files,
  releases,
}: DocsManagerViewProps) {
  const [activeTab, setActiveTab] = useState<DocsTab>("REPOSITORIES")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [editingRepo, setEditingRepo] = useState<RepositoryItem | null>(null)

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("OPEN_SOURCE")
  const [courseName, setCourseName] = useState("")
  const [semester, setSemester] = useState("")
  const [techStackInput, setTechStackInput] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [license, setLicense] = useState("MIT")
  const [isPublic, setIsPublic] = useState(true)
  const [readmeContent, setReadmeContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredRepositories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return repositories.filter((repo) => {
      const matchSearch =
        !q ||
        repo.name.toLowerCase().includes(q) ||
        repo.slug.toLowerCase().includes(q) ||
        (repo.description && repo.description.toLowerCase().includes(q)) ||
        (repo.courseName && repo.courseName.toLowerCase().includes(q)) ||
        (repo.techStack &&
          repo.techStack.some((tech) => tech.toLowerCase().includes(q)))

      const matchCategory =
        categoryFilter === "ALL" || repo.category === categoryFilter

      return matchSearch && matchCategory
    })
  }, [repositories, searchQuery, categoryFilter])

  async function handleCreateRepository(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const generatedSlug =
      slug.trim().toLowerCase() ||
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")

    const parsedTechStack = techStackInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    setIsSubmitting(true)
    try {
      await createRepository({
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim() || null,
        category,
        courseName: courseName.trim() || null,
        semester: semester.trim() || null,
        techStack: parsedTechStack.length > 0 ? parsedTechStack : null,
        githubUrl: githubUrl.trim() || null,
        demoUrl: demoUrl.trim() || null,
        license: license.trim() || "MIT",
        isPublic,
        readmeContent: readmeContent.trim() || null,
        starsCount: 0,
        downloadsCount: 0,
        viewsCount: 0,
      })

      setName("")
      setSlug("")
      setDescription("")
      setCategory("OPEN_SOURCE")
      setCourseName("")
      setSemester("")
      setTechStackInput("")
      setGithubUrl("")
      setDemoUrl("")
      setLicense("MIT")
      setIsPublic(true)
      setReadmeContent("")
      setIsFormExpanded(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const docsBaseUrl =
    process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:3002"

  return (
    <div className="space-y-6">
      <div className="flex border-b border-border/80">
        <button
          type="button"
          onClick={() => setActiveTab("REPOSITORIES")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition-colors ${
            activeTab === "REPOSITORIES"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FolderGit2 className="size-4" />
          <span>Repositori & Dokumen</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {repositories.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("FILES")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition-colors ${
            activeTab === "FILES"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCode className="size-4" />
          <span>Penjelajah Berkas Kode</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {files.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("RELEASES")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition-colors ${
            activeTab === "RELEASES"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileArchive className="size-4" />
          <span>Arsip Rilis</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {releases.length}
          </span>
        </button>
      </div>

      {activeTab === "REPOSITORIES" && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
            <div className="flex items-center justify-between border-b border-border/80 p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
                  <Plus className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Tambah Repositori / Dokumen Baru
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Daftarkan proyek sumber terbuka, dokumen modul akademik, atau pustaka kode.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormExpanded((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>{isFormExpanded ? "Tutup Formulir" : "Buka Formulir"}</span>
                {isFormExpanded ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>
            </div>

            {isFormExpanded && (
              <form onSubmit={handleCreateRepository} className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Nama Repositori / Proyek
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. core-engine-framework"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
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
                      Kategori Repositori
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
                      placeholder="core-engine-framework"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Lisensi
                    </label>
                    <input
                      type="text"
                      placeholder="MIT, Apache-2.0"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
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
                    Deskripsi Ringkas
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Deskripsi tujuan, arsitektur, dan ringkasan fitur utama proyek..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                      placeholder="e.g. Distributed Systems Engineering"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Semester / Batch (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Semester 6 / 2026"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
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
                    placeholder="e.g. TypeScript, React 19, Tailwind CSS, PostgreSQL, Docker"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
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
                      placeholder="https://github.com/ryzmdn/core-engine"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Live Demo URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://core.ryzmdn.me"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Dokumentasi README.md (Markdown)
                  </label>
                  <MarkdownEditor
                    value={readmeContent}
                    onChange={setReadmeContent}
                    rows={12}
                  />
                </div>

                <div className="flex justify-end pt-2">
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
                        <Plus className="size-3.5" />
                        <span>Simpan & Daftarkan Repositori</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Daftar Repositori & Dokumentasi ({filteredRepositories.length})
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari repositori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-60"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="OPEN_SOURCE">Open Source</option>
                  <option value="EXPERIMENT">Eksperimen</option>
                  <option value="ASSIGNMENT">Tugas Kuliah</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
              <div className="divide-y divide-border/40 text-xs">
                {filteredRepositories.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    {searchQuery || categoryFilter !== "ALL"
                      ? "Tidak ada repositori yang cocok dengan filter pencarian."
                      : "Belum ada repositori atau dokumen terdaftar."}
                  </div>
                ) : (
                  filteredRepositories.map((repo) => (
                    <div
                      key={repo.id}
                      className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {repo.name}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {repo.category}
                          </Badge>
                          <Badge
                            variant={repo.isPublic ? "secondary" : "destructive"}
                            className="text-[9px]"
                          >
                            {repo.isPublic ? "Publik" : "Privat"}
                          </Badge>
                          {repo.license && (
                            <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                              {repo.license}
                            </span>
                          )}
                        </div>

                        {repo.description && (
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {repo.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground/80">
                            /{repo.slug}
                          </span>
                          {repo.courseName && (
                            <>
                              <span>&bull;</span>
                              <span>{repo.courseName}</span>
                            </>
                          )}
                          {repo.semester && (
                            <>
                              <span>&bull;</span>
                              <span>{repo.semester}</span>
                            </>
                          )}
                          <span>&bull;</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            <span>
                              {new Date(repo.createdAt).toLocaleDateString(
                                "id-ID",
                                { dateStyle: "medium" }
                              )}
                            </span>
                          </div>
                        </div>

                        {repo.techStack && repo.techStack.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <Layers className="size-3 text-muted-foreground" />
                            {repo.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded bg-muted/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="size-3 text-amber-500" />
                            <span>{repo.starsCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="size-3 text-blue-500" />
                            <span>{repo.downloadsCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="size-3 text-emerald-500" />
                            <span>{repo.viewsCount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`${docsBaseUrl}/repo/${repo.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex size-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Lihat Dokumentasi Publik"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setEditingRepo(repo)}
                          className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <Pencil className="size-3.5 text-muted-foreground" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            if (
                              confirm(
                                `Hapus repositori "${repo.name}" beserta seluruh berkas dan rilisnya?`
                              )
                            ) {
                              await deleteRepository(repo.id)
                            }
                          }}
                          className="flex size-8 items-center justify-center rounded-lg border border-destructive/20 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          title="Hapus Repositori"
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
        </div>
      )}

      {activeTab === "FILES" && (
        <RepoFileManager repositories={repositories} files={files} />
      )}

      {activeTab === "RELEASES" && (
        <RepoReleaseManager repositories={repositories} releases={releases} />
      )}

      <RepoEditDialog
        repo={editingRepo}
        isOpen={Boolean(editingRepo)}
        onClose={() => setEditingRepo(null)}
      />
    </div>
  )
}
