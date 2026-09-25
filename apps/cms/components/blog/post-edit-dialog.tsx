"use client"

import { useState } from "react"
import Image from "next/image"
import {
  X,
  Save,
  Loader2,
  Folder,
  Tag,
  Search,
} from "lucide-react"
import { MarkdownEditor } from "./markdown-editor"
import { updatePost } from "@/lib/actions/blog-actions"

interface CategoryItem {
  id: string
  name: string
  slug: string
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
  coverImageUrl?: string | null
  status: string
  readingTime: number
  publishedAt?: Date | null
  seoTitle?: string | null
  seoDesc?: string | null
}

interface PostEditDialogProps {
  post: PostItem | null
  isOpen: boolean
  onClose: () => void
  categories: CategoryItem[]
  tags: TagItem[]
  initialCategoryIds?: string[]
  initialTagIds?: string[]
}

interface PostEditFormProps {
  post: PostItem
  onClose: () => void
  categories: CategoryItem[]
  tags: TagItem[]
  initialCategoryIds: string[]
  initialTagIds: string[]
}

function PostEditForm({
  post,
  onClose,
  categories,
  tags,
  initialCategoryIds,
  initialTagIds,
}: PostEditFormProps) {
  const [title, setTitle] = useState(post.title || "")
  const [slug, setSlug] = useState(post.slug || "")
  const [excerpt, setExcerpt] = useState(post.excerpt || "")
  const [contentMd, setContentMd] = useState(post.contentMd || "")
  const [coverImageUrl, setCoverImageUrl] = useState(post.coverImageUrl || "")
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    post.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT"
  )
  const [seoTitle, setSeoTitle] = useState(post.seoTitle || "")
  const [seoDesc, setSeoDesc] = useState(post.seoDesc || "")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialCategoryIds
  )
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSeo, setShowSeo] = useState(false)

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function toggleTag(id: string) {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return

    setIsSubmitting(true)
    try {
      const isPublished = status === "PUBLISHED"
      const words = contentMd.trim().split(/\s+/).length
      const readingTime = Math.max(1, Math.ceil(words / 200))

      await updatePost(post.id, {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        excerpt: excerpt.trim(),
        contentMd,
        coverImageUrl: coverImageUrl.trim() || null,
        status,
        publishedAt: isPublished ? (post.publishedAt || new Date()) : null,
        readingTime,
        seoTitle: seoTitle.trim() || null,
        seoDesc: seoDesc.trim() || null,
        categoryIds: selectedCategoryIds,
        tagIds: selectedTagIds,
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
            Judul Artikel
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
            Status Publikasi
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "DRAFT" | "PUBLISHED")
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="DRAFT">Draft (Konsep)</option>
            <option value="PUBLISHED">Published (Publik)</option>
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
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            URL Gambar Sampul (Cover Image)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://..."
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />
            {coverImageUrl && (
              <div className="relative size-8 shrink-0 overflow-hidden rounded-lg border border-border">
                <Image
                  src={coverImageUrl}
                  alt="Pratinjau sampul"
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
          Ringkasan Singkat (Excerpt)
        </label>
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Isi Konten Artikel (Markdown)
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
            <span>Pilih Kategori</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.length === 0 ? (
              <span className="text-[11px] text-muted-foreground">
                Belum ada kategori.
              </span>
            ) : (
              categories.map((cat) => {
                const isChecked = selectedCategoryIds.includes(cat.id)
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
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
            <span>Pilih Tag</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.length === 0 ? (
              <span className="text-[11px] text-muted-foreground">
                Belum ada tag.
              </span>
            ) : (
              tags.map((t) => {
                const isChecked = selectedTagIds.includes(t.id)
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => toggleTag(t.id)}
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
                placeholder="Judul untuk mesin telusur Google..."
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
                placeholder="Deskripsi cuplikan hasil pencarian (SERP)..."
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>
        )}
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
              <span>Menyimpan Perubahan...</span>
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

export function PostEditDialog({
  post,
  isOpen,
  onClose,
  categories,
  tags,
  initialCategoryIds = [],
  initialTagIds = [],
}: PostEditDialogProps) {
  if (!isOpen || !post) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Artikel"
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
              Edit Artikel: {post.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Perbarui isi konten, slug URL, metadata SEO, dan klasifikasi artikel.
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

        <PostEditForm
          key={post.id}
          post={post}
          onClose={onClose}
          categories={categories}
          tags={tags}
          initialCategoryIds={initialCategoryIds}
          initialTagIds={initialTagIds}
        />
      </div>
    </div>
  )
}
