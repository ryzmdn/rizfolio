"use client"

import { useState, useMemo } from "react"
import {
  Quote,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Loader2,
  Save,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/actions/portfolio-actions"

interface TestimonialItem {
  id: string
  clientName: string
  role: string | null
  company: string | null
  content: string
  rating: number
  avatarUrl: string | null
  isFeatured: boolean
  displayOrder: number
  createdAt: Date
}

interface TestimonialManagerProps {
  testimonials: TestimonialItem[]
}

function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  )
}

function TestimonialEditForm({
  item,
  onClose,
}: {
  item: TestimonialItem
  onClose: () => void
}) {
  const [clientName, setClientName] = useState(item.clientName || "")
  const [role, setRole] = useState(item.role || "")
  const [company, setCompany] = useState(item.company || "")
  const [content, setContent] = useState(item.content || "")
  const [rating, setRating] = useState<number>(item.rating || 5)
  const [avatarUrl, setAvatarUrl] = useState(item.avatarUrl || "")
  const [isFeatured, setIsFeatured] = useState(item.isFeatured ?? false)
  const [displayOrder, setDisplayOrder] = useState<number | string>(
    item.displayOrder || 0
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientName.trim() || !content.trim()) return

    setIsSubmitting(true)
    try {
      await updateTestimonial(item.id, {
        clientName: clientName.trim(),
        role: role.trim() || null,
        company: company.trim() || null,
        content: content.trim(),
        rating,
        avatarUrl: avatarUrl.trim() || null,
        isFeatured,
        displayOrder: Number(displayOrder) || 0,
      })
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-medium text-foreground">
            Nama Klien / Tokoh
          </label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            placeholder="cth: Sarah Jenkins"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-medium text-foreground">
            Jabatan / Peran
          </label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="cth: Head of Engineering"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-medium text-foreground">
            Perusahaan / Organisasi
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="cth: FinTech Global Labs"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Penilaian Rating (1-5)
          </label>
          <div className="flex items-center gap-1.5 pt-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setRating(val)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`h-5 w-5 ${
                    val <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
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
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Sorotan Unggulan
          </label>
          <div className="flex h-9 items-center gap-2">
            <input
              type="checkbox"
              id="edit-is-featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label
              htmlFor="edit-is-featured"
              className="text-xs font-medium text-foreground cursor-pointer"
            >
              Tampilkan di Beranda
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Isi Testimoni / Ulasan
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          placeholder="Tuliskan umpan balik atau testimoni dari klien..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          URL Foto Profil Klien (Opsional)
        </label>
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </form>
  )
}

function TestimonialEditDialog({
  item,
  isOpen,
  onClose,
}: {
  item: TestimonialItem | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen || !item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Quote className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Ubah Testimoni: {item.clientName}
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
        <TestimonialEditForm key={item.id} item={item} onClose={onClose} />
      </div>
    </div>
  )
}

function TestimonialCreateDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [clientName, setClientName] = useState("")
  const [role, setRole] = useState("")
  const [company, setCompany] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState<number>(5)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [displayOrder, setDisplayOrder] = useState<number | string>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientName.trim() || !content.trim()) return

    setIsSubmitting(true)
    try {
      await createTestimonial({
        clientName: clientName.trim(),
        role: role.trim() || null,
        company: company.trim() || null,
        content: content.trim(),
        rating,
        avatarUrl: avatarUrl.trim() || null,
        isFeatured,
        displayOrder: Number(displayOrder) || 0,
      })
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Tambah Testimoni Baru
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-medium text-foreground">
                Nama Klien / Tokoh
              </label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                placeholder="cth: Alex Rivera"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-medium text-foreground">
                Jabatan / Posisi
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="cth: Chief Technology Officer"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-medium text-foreground">
                Perusahaan / Brand
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="cth: Innovate Corp"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Penilaian Rating (1-5)
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setRating(val)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        val <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
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
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Sorotan Unggulan
              </label>
              <div className="flex h-9 items-center gap-2">
                <input
                  type="checkbox"
                  id="create-is-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="create-is-featured"
                  className="text-xs font-medium text-foreground cursor-pointer"
                >
                  Tampilkan di Beranda
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Isi Testimoni / Ulasan Klien
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              placeholder="Tuliskan testimoni atau review kepuasan klien atas kinerja dan hasil akhir proyek..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              URL Foto Profil Klien (Opsional)
            </label>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Simpan Testimoni
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function TestimonialManager({ testimonials }: TestimonialManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured">("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        t.clientName.toLowerCase().includes(query) ||
        (t.company && t.company.toLowerCase().includes(query)) ||
        (t.role && t.role.toLowerCase().includes(query)) ||
        t.content.toLowerCase().includes(query)

      const matchesFeatured =
        featuredFilter === "all" ? true : t.isFeatured

      return matchesSearch && matchesFeatured
    })
  }, [testimonials, searchQuery, featuredFilter])

  const averageRating = useMemo(() => {
    if (testimonials.length === 0) return "5.0"
    const sum = testimonials.reduce((acc, curr) => acc + curr.rating, 0)
    return (sum / testimonials.length).toFixed(1)
  }, [testimonials])

  const featuredCount = useMemo(() => {
    return testimonials.filter((t) => t.isFeatured).length
  }, [testimonials])

  async function handleToggleFeatured(item: TestimonialItem) {
    try {
      await updateTestimonial(item.id, {
        isFeatured: !item.isFeatured,
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteTestimonial(id)
    } catch (error) {
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Total Testimoni
            </span>
            <Quote className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {testimonials.length}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Skor Kepuasan
            </span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-500">
            {averageRating} <span className="text-xs font-normal text-muted-foreground">/ 5.0</span>
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Testimoni Unggulan
            </span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-primary">
            {featuredCount}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama klien, instansi, konten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setFeaturedFilter("all")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                featuredFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFeaturedFilter("featured")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                featuredFilter === "featured"
                  ? "bg-amber-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Unggulan
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Testimoni
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredTestimonials.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {item.clientName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {item.clientName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {[item.role, item.company].filter(Boolean).join(" • ")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <StarRatingDisplay rating={item.rating} />
                  {item.isFeatured && (
                    <Badge
                      variant="outline"
                      className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-500"
                    >
                      Unggulan
                    </Badge>
                  )}
                </div>
              </div>

              <blockquote className="rounded-lg bg-muted/40 p-3 text-xs italic text-foreground leading-relaxed">
                &ldquo;{item.content}&rdquo;
              </blockquote>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <button
                type="button"
                onClick={() => handleToggleFeatured(item)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${
                    item.isFeatured ? "text-amber-500" : "text-muted-foreground"
                  }`}
                />
                <span>
                  {item.isFeatured ? "Hapus dari Unggulan" : "Jadikan Unggulan"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(item)}
                  className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <Pencil className="h-3 w-3" />
                  Ubah
                </button>
                <button
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center gap-1 rounded border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
                >
                  {deletingId === item.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTestimonials.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center">
            <Quote className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Tidak ada testimoni ditemukan
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sesuaikan kata kunci pencarian atau rekam testimoni kepuasan klien baru.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Testimoni
            </button>
          </div>
        )}
      </div>

      <TestimonialCreateDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <TestimonialEditDialog
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
      />
    </div>
  )
}
