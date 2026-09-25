"use client"

import { useState, useMemo } from "react"
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Loader2,
  Save,
  CheckCircle2,
  XCircle,
  Tag,
  Banknote,
  Sparkles,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  createService,
  updateService,
  deleteService,
} from "@/lib/actions/portfolio-actions"

interface ServiceItem {
  id: string
  title: string
  slug: string
  summary: string
  description: string
  deliverables: string[] | null
  startingPrice: number | null
  isActive: boolean
  displayOrder: number
  createdAt: Date
}

interface ServiceManagerProps {
  services: ServiceItem[]
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function formatRupiah(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "Konsultasi Kustom"
  }
  return `Rp ${value.toLocaleString("id-ID")}`
}

function ServiceEditForm({
  service,
  onClose,
}: {
  service: ServiceItem
  onClose: () => void
}) {
  const [title, setTitle] = useState(service.title || "")
  const [slug, setSlug] = useState(service.slug || "")
  const [summary, setSummary] = useState(service.summary || "")
  const [description, setDescription] = useState(service.description || "")
  const [deliverablesInput, setDeliverablesInput] = useState(
    service.deliverables?.join(", ") || ""
  )
  const [startingPrice, setStartingPrice] = useState<number | string>(
    service.startingPrice ?? ""
  )
  const [isActive, setIsActive] = useState(service.isActive ?? true)
  const [displayOrder, setDisplayOrder] = useState<number | string>(
    service.displayOrder || 0
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return

    const parsedDeliverables = deliverablesInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    setIsSubmitting(true)
    try {
      await updateService(service.id, {
        title: title.trim(),
        slug: slug.trim(),
        summary: summary.trim(),
        description: description.trim(),
        deliverables: parsedDeliverables,
        startingPrice:
          startingPrice === "" ? null : Number(startingPrice),
        isActive,
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Nama Layanan
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="cth: Full-stack Web Architecture"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">Slug URL</label>
            <button
              type="button"
              onClick={() => setSlug(generateSlug(title))}
              className="text-[10px] text-primary hover:underline"
            >
              Sinkronkan
            </button>
          </div>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="fullstack-web-architecture"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Harga Mulai (IDR)
          </label>
          <input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            placeholder="5000000"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
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
            Status Publikasi
          </label>
          <div className="flex h-9 items-center gap-2">
            <input
              type="checkbox"
              id="edit-is-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label
              htmlFor="edit-is-active"
              className="text-xs font-medium text-foreground cursor-pointer"
            >
              {isActive ? "Aktif Ditawarkan" : "Tidak Aktif"}
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Ringkasan Singkat
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          rows={2}
          placeholder="Ringkasan 1-2 kalimat untuk kartu layanan"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Deskripsi Lengkap
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Rincian komprehensif mengenai metodologi, proses, dan jaminan mutu"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Deliverables (Pisahkan dengan koma)
        </label>
        <input
          value={deliverablesInput}
          onChange={(e) => setDeliverablesInput(e.target.value)}
          placeholder="Source Code, CI/CD Pipeline, Dokumentasi Teknis, Garansi 30 Hari"
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

function ServiceEditDialog({
  service,
  isOpen,
  onClose,
}: {
  service: ServiceItem | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen || !service) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Ubah Layanan: {service.title}
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
        <ServiceEditForm key={service.id} service={service} onClose={onClose} />
      </div>
    </div>
  )
}

function ServiceCreateDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [summary, setSummary] = useState("")
  const [description, setDescription] = useState("")
  const [deliverablesInput, setDeliverablesInput] = useState("")
  const [startingPrice, setStartingPrice] = useState<number | string>("")
  const [isActive, setIsActive] = useState(true)
  const [displayOrder, setDisplayOrder] = useState<number | string>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(val))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return

    const parsedDeliverables = deliverablesInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    setIsSubmitting(true)
    try {
      await createService({
        title: title.trim(),
        slug: slug.trim(),
        summary: summary.trim(),
        description: description.trim(),
        deliverables: parsedDeliverables,
        startingPrice:
          startingPrice === "" ? null : Number(startingPrice),
        isActive,
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
              Tambah Layanan Baru
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Nama Layanan
              </label>
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="cth: Full-stack Web Development"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Slug URL
              </label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="fullstack-web-development"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Harga Mulai (IDR)
              </label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="5000000"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
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
                Status Layanan
              </label>
              <div className="flex h-9 items-center gap-2">
                <input
                  type="checkbox"
                  id="create-is-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="create-is-active"
                  className="text-xs font-medium text-foreground cursor-pointer"
                >
                  Aktif Ditawarkan
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Ringkasan Singkat
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              rows={2}
              placeholder="Deskripsi singkat yang tampil di beranda dan katalog"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Deskripsi Lengkap
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Rincian alur kerja, metodologi, dan nilai tambah yang didapatkan klien"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Deliverables (Pisahkan dengan koma)
            </label>
            <input
              value={deliverablesInput}
              onChange={(e) => setDeliverablesInput(e.target.value)}
              placeholder="Arsitektur Solusi, Kode Sumber Bersih, Otomasi CI/CD, Pengujian E2E"
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
                  Buat Layanan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ServiceManager({ services }: ServiceManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  )
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesSearch =
        srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (srv.deliverables &&
          srv.deliverables.some((d) =>
            d.toLowerCase().includes(searchQuery.toLowerCase())
          ))

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? srv.isActive
            : !srv.isActive

      return matchesSearch && matchesStatus
    })
  }, [services, searchQuery, statusFilter])

  const activeCount = useMemo(
    () => services.filter((s) => s.isActive).length,
    [services]
  )

  const totalDeliverables = useMemo(() => {
    return services.reduce(
      (acc, s) => acc + (s.deliverables ? s.deliverables.length : 0),
      0
    )
  }, [services])

  async function handleToggleStatus(srv: ServiceItem) {
    try {
      await updateService(srv.id, {
        isActive: !srv.isActive,
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteService(id)
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
            <span className="text-xs text-muted-foreground">Total Layanan</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {services.length}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Layanan Aktif</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-500">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Deliverable</span>
            <Sparkles className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-500">
            {totalDeliverables}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari layanan atau deliverable..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === "active"
                  ? "bg-emerald-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Aktif
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === "inactive"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Nonaktif
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Layanan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-foreground">
                      {srv.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] text-muted-foreground"
                    >
                      /{srv.slug}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                    <Banknote className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">
                      {formatRupiah(srv.startingPrice)}
                    </span>
                    <span>•</span>
                    <span>Urutan: {srv.displayOrder}</span>
                  </div>
                </div>

                <Badge
                  variant={srv.isActive ? "default" : "secondary"}
                  className={`text-[10px] font-medium ${
                    srv.isActive
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {srv.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">
                {srv.summary}
              </p>

              {srv.deliverables && srv.deliverables.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Deliverables:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {srv.deliverables.map((deliv, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-foreground"
                      >
                        <Tag className="h-2.5 w-2.5 text-muted-foreground" />
                        {deliv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
              <button
                type="button"
                onClick={() => handleToggleStatus(srv)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {srv.isActive ? (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span>Nonaktifkan</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Aktifkan</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(srv)}
                  className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <Pencil className="h-3 w-3" />
                  Ubah
                </button>
                <button
                  type="button"
                  disabled={deletingId === srv.id}
                  onClick={() => handleDelete(srv.id)}
                  className="inline-flex items-center gap-1 rounded border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
                >
                  {deletingId === srv.id ? (
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

        {filteredServices.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center">
            <Layers className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Tidak ada layanan ditemukan
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sesuaikan kata kunci pencarian atau tambahkan penawaran layanan baru.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Layanan
            </button>
          </div>
        )}
      </div>

      <ServiceCreateDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <ServiceEditDialog
        service={editingService}
        isOpen={Boolean(editingService)}
        onClose={() => setEditingService(null)}
      />
    </div>
  )
}
