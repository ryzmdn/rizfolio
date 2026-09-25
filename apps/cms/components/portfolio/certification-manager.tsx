"use client"

import { useState, useMemo } from "react"
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  X,
  Loader2,
  Save,
  Calendar,
  ShieldCheck,
  Building2,
  Hash,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  createCertification,
  updateCertification,
  deleteCertification,
} from "@/lib/actions/portfolio-actions"

interface CertificationItem {
  id: string
  title: string
  issuer: string
  issueDate: string
  expiryDate: string | null
  credentialUrl: string | null
  credentialId: string | null
  badgeUrl: string | null
  displayOrder: number
  createdAt: Date
}

interface CertificationManagerProps {
  certifications: CertificationItem[]
}

function CertificationEditForm({
  cert,
  onClose,
}: {
  cert: CertificationItem
  onClose: () => void
}) {
  const [title, setTitle] = useState(cert.title || "")
  const [issuer, setIssuer] = useState(cert.issuer || "")
  const [issueDate, setIssueDate] = useState(cert.issueDate || "")
  const [expiryDate, setExpiryDate] = useState(cert.expiryDate || "")
  const [credentialId, setCredentialId] = useState(cert.credentialId || "")
  const [credentialUrl, setCredentialUrl] = useState(cert.credentialUrl || "")
  const [badgeUrl, setBadgeUrl] = useState(cert.badgeUrl || "")
  const [displayOrder, setDisplayOrder] = useState<number | string>(
    cert.displayOrder || 0
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !issuer.trim() || !issueDate.trim()) return

    setIsSubmitting(true)
    try {
      await updateCertification(cert.id, {
        title: title.trim(),
        issuer: issuer.trim(),
        issueDate: issueDate.trim(),
        expiryDate: expiryDate.trim() || null,
        credentialId: credentialId.trim() || null,
        credentialUrl: credentialUrl.trim() || null,
        badgeUrl: badgeUrl.trim() || null,
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
            Nama Sertifikasi
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="cth: AWS Certified Solutions Architect"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Institusi / Penerbit
          </label>
          <input
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            required
            placeholder="cth: Amazon Web Services"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Tanggal Terbit
          </label>
          <input
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
            placeholder="cth: Maret 2024"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Masa Berlaku / Kedaluwarsa
          </label>
          <input
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="cth: Maret 2027 atau Seumur Hidup"
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            ID Kredensial
          </label>
          <input
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            placeholder="cth: AWS-PSA-123456"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            URL Verifikasi Kredensial
          </label>
          <input
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            placeholder="https://credly.com/badges/..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          URL Gambar Lencana / Badge
        </label>
        <input
          value={badgeUrl}
          onChange={(e) => setBadgeUrl(e.target.value)}
          placeholder="https://images.credly.com/..."
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

function CertificationEditDialog({
  cert,
  isOpen,
  onClose,
}: {
  cert: CertificationItem | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen || !cert) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Ubah Sertifikasi: {cert.title}
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
        <CertificationEditForm key={cert.id} cert={cert} onClose={onClose} />
      </div>
    </div>
  )
}

function CertificationCreateDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [title, setTitle] = useState("")
  const [issuer, setIssuer] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [credentialId, setCredentialId] = useState("")
  const [credentialUrl, setCredentialUrl] = useState("")
  const [badgeUrl, setBadgeUrl] = useState("")
  const [displayOrder, setDisplayOrder] = useState<number | string>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !issuer.trim() || !issueDate.trim()) return

    setIsSubmitting(true)
    try {
      await createCertification({
        title: title.trim(),
        issuer: issuer.trim(),
        issueDate: issueDate.trim(),
        expiryDate: expiryDate.trim() || null,
        credentialId: credentialId.trim() || null,
        credentialUrl: credentialUrl.trim() || null,
        badgeUrl: badgeUrl.trim() || null,
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
              Tambah Sertifikasi Baru
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
                Nama Sertifikasi
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="cth: Google Cloud Professional Data Engineer"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Institusi / Penerbit
              </label>
              <input
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                required
                placeholder="cth: Google Cloud"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Tanggal Terbit
              </label>
              <input
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
                placeholder="cth: Januari 2024"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Masa Berlaku / Kedaluwarsa
              </label>
              <input
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="cth: Januari 2026 atau Berlaku Selamanya"
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
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                ID Kredensial
              </label>
              <input
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="cth: GCP-PDE-987654"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                URL Verifikasi Kredensial
              </label>
              <input
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://google.accredible.com/..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              URL Gambar Lencana / Badge
            </label>
            <input
              value={badgeUrl}
              onChange={(e) => setBadgeUrl(e.target.value)}
              placeholder="https://images.credly.com/..."
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
                  Tambah Sertifikasi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function CertificationManager({
  certifications,
}: CertificationManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredCerts = useMemo(() => {
    return certifications.filter((cert) => {
      const query = searchQuery.toLowerCase()
      return (
        cert.title.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(query))
      )
    })
  }, [certifications, searchQuery])

  const uniqueIssuersCount = useMemo(() => {
    const issuers = new Set(certifications.map((c) => c.issuer.trim()))
    return issuers.size
  }, [certifications])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteCertification(id)
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
              Total Sertifikasi
            </span>
            <Award className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {certifications.length}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Penerbit Kredensial
            </span>
            <Building2 className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-500">
            {uniqueIssuersCount}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Status Verifikasi
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-500">
            {certifications.filter((c) => Boolean(c.credentialUrl)).length} Terverifikasi
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari sertifikasi, penerbit, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Sertifikasi
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredCerts.map((cert) => (
          <div
            key={cert.id}
            className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500 shrink-0" />
                    <h4 className="text-sm font-semibold text-foreground">
                      {cert.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {cert.issuer}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {cert.issueDate}
                    </span>
                    {cert.expiryDate && (
                      <>
                        <span>•</span>
                        <span>Berlaku s/d {cert.expiryDate}</span>
                      </>
                    )}
                  </div>
                </div>

                <Badge variant="outline" className="text-[10px] font-mono">
                  #{cert.displayOrder}
                </Badge>
              </div>

              {cert.credentialId && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3 w-3 text-primary" />
                  <span className="font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded">
                    {cert.credentialId}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Verifikasi Kredensial
                </a>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  Tanpa tautan publik
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCert(cert)}
                  className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <Pencil className="h-3 w-3" />
                  Ubah
                </button>
                <button
                  type="button"
                  disabled={deletingId === cert.id}
                  onClick={() => handleDelete(cert.id)}
                  className="inline-flex items-center gap-1 rounded border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
                >
                  {deletingId === cert.id ? (
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

        {filteredCerts.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center">
            <Award className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Tidak ada sertifikasi ditemukan
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sesuaikan kata kunci pencarian atau daftarkan lisensi dan sertifikat profesional baru.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Sertifikasi
            </button>
          </div>
        )}
      </div>

      <CertificationCreateDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <CertificationEditDialog
        cert={editingCert}
        isOpen={Boolean(editingCert)}
        onClose={() => setEditingCert(null)}
      />
    </div>
  )
}
