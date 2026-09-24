"use client"

import { useState } from "react"
import {
  Folder,
  Tag,
  Plus,
  Trash2,
  Hash,
} from "lucide-react"
import {
  createBlogCategory,
  deleteBlogCategory,
  createBlogTag,
  deleteBlogTag,
} from "@/lib/actions/blog-actions"
import { Badge } from "@workspace/ui/components/badge"

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

interface CategoryTagManagerProps {
  categories: CategoryItem[]
  tags: TagItem[]
}

export function CategoryTagManager({
  categories,
  tags,
}: CategoryTagManagerProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "tags">("categories")
  const [categoryName, setCategoryName] = useState("")
  const [categorySlug, setCategorySlug] = useState("")
  const [categoryDesc, setCategoryDesc] = useState("")
  const [isSubmittingCat, setIsSubmittingCat] = useState(false)

  const [tagName, setTagName] = useState("")
  const [tagSlug, setTagSlug] = useState("")
  const [isSubmittingTag, setIsSubmittingTag] = useState(false)

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!categoryName.trim()) return

    const slug =
      categorySlug.trim().toLowerCase() ||
      categoryName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")

    setIsSubmittingCat(true)
    try {
      await createBlogCategory({
        name: categoryName.trim(),
        slug,
        description: categoryDesc.trim() || null,
      })
      setCategoryName("")
      setCategorySlug("")
      setCategoryDesc("")
    } finally {
      setIsSubmittingCat(false)
    }
  }

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault()
    if (!tagName.trim()) return

    const slug =
      tagSlug.trim().toLowerCase() ||
      tagName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")

    setIsSubmittingTag(true)
    try {
      await createBlogTag({
        name: tagName.trim(),
        slug,
      })
      setTagName("")
      setTagSlug("")
    } finally {
      setIsSubmittingTag(false)
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Taksonomi Konten Blog
          </h2>
          <p className="text-xs text-muted-foreground">
            Kelola kategori induk dan label tag untuk pengelompokan artikel.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-background p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTab === "categories"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Folder className="size-3.5" />
            <span>Kategori ({categories.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tags")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTab === "tags"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Tag className="size-3.5" />
            <span>Tag ({tags.length})</span>
          </button>
        </div>
      </div>

      {activeTab === "categories" && (
        <div className="space-y-5">
          <form onSubmit={handleCreateCategory} className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
            <span className="text-xs font-medium text-foreground">
              Tambah Kategori Baru
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Nama Kategori (e.g. Software Architecture)"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value)
                  if (!categorySlug) {
                    setCategorySlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]/g, "")
                    )
                  }
                }}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              />
              <input
                type="text"
                placeholder="Slug URL (e.g. software-architecture)"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Deskripsi singkat kategori (opsional)"
              value={categoryDesc}
              onChange={(e) => setCategoryDesc(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingCat}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="size-3.5" />
                <span>Simpan Kategori</span>
              </button>
            </div>
          </form>

          <div className="divide-y divide-border/40 rounded-lg border border-border/60 bg-background text-xs">
            {categories.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                Belum ada kategori yang ditambahkan.
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {cat.name}
                      </span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        /{cat.slug}
                      </Badge>
                    </div>
                    {cat.description && (
                      <p className="text-[11px] text-muted-foreground">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Hapus kategori "${cat.name}"?`)) {
                        await deleteBlogCategory(cat.id)
                      }
                    }}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "tags" && (
        <div className="space-y-5">
          <form onSubmit={handleCreateTag} className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
            <span className="text-xs font-medium text-foreground">
              Tambah Tag Baru
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Nama Tag (e.g. Next.js, TypeScript)"
                value={tagName}
                onChange={(e) => {
                  setTagName(e.target.value)
                  if (!tagSlug) {
                    setTagSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]/g, "")
                    )
                  }
                }}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              />
              <input
                type="text"
                placeholder="Slug Tag (e.g. next-js, typescript)"
                value={tagSlug}
                onChange={(e) => setTagSlug(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingTag}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="size-3.5" />
                <span>Simpan Tag</span>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 rounded-lg border border-border/60 bg-background p-4 text-xs">
            {tags.length === 0 ? (
              <div className="w-full py-4 text-center text-muted-foreground">
                Belum ada tag yang ditambahkan.
              </div>
            ) : (
              tags.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-2.5 py-1 text-xs"
                >
                  <Hash className="size-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">{t.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    ({t.slug})
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Hapus tag "${t.name}"?`)) {
                        await deleteBlogTag(t.id)
                      }
                    }}
                    className="ml-1 text-muted-foreground transition-colors hover:text-destructive"
                    title="Hapus Tag"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
