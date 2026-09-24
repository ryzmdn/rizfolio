"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Loader2,
  Folder,
  Tag,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Calendar,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { MarkdownEditor } from "./markdown-editor"
import { PostEditDialog } from "./post-edit-dialog"
import { CategoryTagManager } from "./category-tag-manager"
import { createPost, deletePost } from "@/lib/actions/blog-actions"

interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string | null
}

interface TagItem {
  id: string
  name: string
  slug: string
}

interface PostItem {
  id: string
  title: string
  slug: string
  excerpt: string
  contentMd: string
  coverImageUrl: string | null
  status: string
  readingTime: number
  publishedAt: Date | null
  seoTitle: string | null
  seoDesc: string | null
  createdAt: Date
  updatedAt: Date
}

interface BlogManagerViewProps {
  initialPosts: PostItem[]
  categories: CategoryItem[]
  tags: TagItem[]
  postCategoriesMap: Record<string, string[]>
  postTagsMap: Record<string, string[]>
}

export function BlogManagerView({
  initialPosts,
  categories,
  tags,
  postCategoriesMap,
  postTagsMap,
}: BlogManagerViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL")
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [editingPost, setEditingPost] = useState<PostItem | null>(null)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [contentMd, setContentMd] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDesc, setSeoDesc] = useState("")
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [showSeo, setShowSeo] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return initialPosts.filter((post) => {
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q)

      const matchStatus =
        statusFilter === "ALL" || post.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [initialPosts, searchQuery, statusFilter])

  function toggleCatSelection(id: string) {
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function toggleTagSelection(id: string) {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const generatedSlug =
      slug.trim().toLowerCase() ||
      title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")

    const words = contentMd.trim().split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(words / 200))
    const isPublished = status === "PUBLISHED"

    setIsSubmitting(true)
    try {
      await createPost({
        title: title.trim(),
        slug: generatedSlug,
        excerpt: excerpt.trim(),
        contentMd,
        coverImageUrl: coverImageUrl.trim() || null,
        status,
        publishedAt: isPublished ? new Date() : null,
        readingTime,
        seoTitle: seoTitle.trim() || null,
        seoDesc: seoDesc.trim() || null,
        categoryIds: selectedCatIds,
        tagIds: selectedTagIds,
      })

      setTitle("")
      setSlug("")
      setExcerpt("")
      setContentMd("")
      setCoverImageUrl("")
      setSeoTitle("")
      setSeoDesc("")
      setSelectedCatIds([])
      setSelectedTagIds([])
      setIsFormExpanded(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of categories) {
      map.set(c.id, c.name)
    }
    return map
  }, [categories])

  const tagNameMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const t of tags) {
      map.set(t.id, t.name)
    }
    return map
  }, [tags])

  const blogBaseUrl = process.env.NEXT_PUBLIC_BLOG_URL || "http://localhost:3001"

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="flex items-center justify-between border-b border-border/80 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
              <Plus className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Tulis Artikel Baru
              </h2>
              <p className="text-xs text-muted-foreground">
                Tulis artikel teknis dengan editor Markdown interaktif dan optimasi SEO.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFormExpanded((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <span>{isFormExpanded ? "Tutup Formulir" : "Buka Editor"}</span>
            {isFormExpanded ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>
        </div>

        {isFormExpanded && (
          <form onSubmit={handleCreatePost} className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-foreground">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arsitektur Monorepo Skala Besar dengan Turborepo"
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
                  Status Publikasi
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "DRAFT" | "PUBLISHED")
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="PUBLISHED">Published (Publik)</option>
                  <option value="DRAFT">Draft (Konsep)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Slug URL
                </label>
                <input
                  type="text"
                  placeholder="arsitektur-monorepo-skala-besar"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  URL Gambar Sampul
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                  {coverImageUrl && (
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-lg border border-border">
                      <Image
                        src={coverImageUrl}
                        alt="Sampul"
                        width={32}
                        height={32}
                        unoptimized
                        className="size-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Ringkasan Artikel (Excerpt)
              </label>
              <textarea
                rows={2}
                placeholder="Ringkasan singkat artikel yang akan tampil di feed dan kartu pratinjau..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Konten Artikel (Markdown)
              </label>
              <MarkdownEditor
                value={contentMd}
                onChange={setContentMd}
                rows={12}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2 rounded-lg border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <Folder className="size-3.5 text-muted-foreground" />
                  <span>Kategori Artikel</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {categories.length === 0 ? (
                    <span className="text-[11px] text-muted-foreground">
                      Belum ada kategori. Buat di bagian Taksonomi.
                    </span>
                  ) : (
                    categories.map((cat) => {
                      const isChecked = selectedCatIds.includes(cat.id)
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => toggleCatSelection(cat.id)}
                          className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                            isChecked
                              ? "border-primary bg-primary text-primary-foreground font-semibold"
                              : "border-border/80 bg-background text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {cat.name}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <Tag className="size-3.5 text-muted-foreground" />
                  <span>Tag Artikel</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.length === 0 ? (
                    <span className="text-[11px] text-muted-foreground">
                      Belum ada tag. Buat di bagian Taksonomi.
                    </span>
                  ) : (
                    tags.map((t) => {
                      const isChecked = selectedTagIds.includes(t.id)
                      return (
                        <button
                          type="button"
                          key={t.id}
                          onClick={() => toggleTagSelection(t.id)}
                          className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                            isChecked
                              ? "border-primary bg-primary text-primary-foreground font-semibold"
                              : "border-border/80 bg-background text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          #{t.name}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-4">
              <button
                type="button"
                onClick={() => setShowSeo((prev) => !prev)}
                className="flex w-full items-center justify-between text-xs font-medium text-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <Search className="size-3.5 text-muted-foreground" />
                  <span>Pengaturan Metadata SEO (Opsional)</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {showSeo ? "Sembunyikan" : "Tampilkan"}
                </span>
              </button>

              {showSeo && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Judul optimal untuk pencarian Google..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={seoDesc}
                      onChange={(e) => setSeoDesc(e.target.value)}
                      placeholder="Deskripsi rangkuman untuk cuplikan pencarian..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              )}
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
                    <span>Mempublikasikan Artikel...</span>
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" />
                    <span>Simpan & Publikasikan</span>
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
            <FileText className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Daftar Artikel ({filteredPosts.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-60"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "ALL" | "PUBLISHED" | "DRAFT"
                )
              }
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
          <div className="divide-y divide-border/40 text-xs">
            {filteredPosts.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                {searchQuery || statusFilter !== "ALL"
                  ? "Tidak ada artikel yang cocok dengan filter pencarian."
                  : "Belum ada artikel yang ditulis."}
              </div>
            ) : (
              filteredPosts.map((post) => {
                const postCatIds = postCategoriesMap[post.id] || []
                const postTagIds = postTagsMap[post.id] || []

                return (
                  <div
                    key={post.id}
                    className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {post.title}
                        </span>
                        <Badge
                          variant={
                            post.status === "PUBLISHED"
                              ? "default"
                              : "secondary"
                          }
                          className="font-mono text-[10px]"
                        >
                          {post.status}
                        </Badge>
                      </div>

                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground/80">
                          /{post.slug}
                        </span>
                        <span>&bull;</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(
                              "id-ID",
                              { dateStyle: "medium" }
                            )}
                          </span>
                        </div>
                        <span>&bull;</span>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{post.readingTime} menit baca</span>
                        </div>
                      </div>

                      {postCatIds.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {postCatIds.map((catId) => {
                            const catName = categoryNameMap.get(catId)
                            if (!catName) return null
                            return (
                              <Badge
                                key={catId}
                                variant="outline"
                                className="text-[10px]"
                              >
                                {catName}
                              </Badge>
                            )
                          })}
                        </div>
                      )}

                      {postTagIds.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {postTagIds.map((tagId) => {
                            const tagName = tagNameMap.get(tagId)
                            if (!tagName) return null
                            return (
                              <span
                                key={tagId}
                                className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                              >
                                #{tagName}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`${blogBaseUrl}/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex size-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title="Lihat Halaman Publik"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => setEditingPost(post)}
                        className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        <Pencil className="size-3.5 text-muted-foreground" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          if (
                            confirm(`Hapus artikel "${post.title}" permanen?`)
                          ) {
                            await deletePost(post.id)
                          }
                        }}
                        className="flex size-8 items-center justify-center rounded-lg border border-destructive/20 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="Hapus Artikel"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <CategoryTagManager categories={categories} tags={tags} />

      <PostEditDialog
        post={editingPost}
        isOpen={Boolean(editingPost)}
        onClose={() => setEditingPost(null)}
        categories={categories}
        tags={tags}
        initialCategoryIds={editingPost ? postCategoriesMap[editingPost.id] : []}
        initialTagIds={editingPost ? postTagsMap[editingPost.id] : []}
      />
    </div>
  )
}
