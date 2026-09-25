"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  Trash2,
  Search,
  X,
  Calendar,
  Percent,
  Check,
  Ban,
  Loader2,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/lib/actions/shop-actions"

interface CouponItem {
  id: string
  code: string
  discountPercent: number
  description: string | null
  expiresAt: Date | null
  minSpend: number | null
  maxUses: number | null
  usedCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface CouponManagerProps {
  coupons: CouponItem[]
}

export function CouponManager({ coupons }: CouponManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [code, setCode] = useState("")
  const [discountPercent, setDiscountPercent] = useState<number | string>(10)
  const [description, setDescription] = useState("")
  const [minSpend, setMinSpend] = useState<number | string>(0)
  const [maxUses, setMaxUses] = useState<number | string>("")
  const [expiresAt, setExpiresAt] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredCoupons = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return coupons.filter((c) => {
      return (
        !q ||
        c.code.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      )
    })
  }, [coupons, searchQuery])

  async function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || Number(discountPercent) <= 0) return

    setIsSubmitting(true)
    try {
      await createCoupon({
        code: code.trim().toUpperCase(),
        discountPercent: Number(discountPercent),
        description: description.trim() || null,
        minSpend: minSpend ? Number(minSpend) : 0,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive,
      })

      setCode("")
      setDiscountPercent(10)
      setDescription("")
      setMinSpend(0)
      setMaxUses("")
      setExpiresAt("")
      setIsActive(true)
      setIsFormOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleActive(coupon: CouponItem) {
    await updateCoupon(coupon.id, {
      isActive: !coupon.isActive,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari kode kupon promo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-72"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>{isFormOpen ? "Tutup Formulir" : "Tambah Kupon Promo"}</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleCreateCoupon} className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Buat Kupon Diskon Promo Baru
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
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Kode Kupon (Otomatis Kapital)
              </label>
              <input
                type="text"
                placeholder="e.g. WELCOME25"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs uppercase text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Persentase Diskon (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  min={1}
                  max={100}
                  required
                  className="w-full rounded-lg border border-border bg-background py-2 pr-8 pl-3 text-xs text-foreground focus:outline-none"
                />
                <Percent className="absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Minimum Belanja (IDR, opsional)
              </label>
              <input
                type="number"
                placeholder="e.g. 100000"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                min={0}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Batas Penggunaan (Kuota, opsional)
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                min={1}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Tanggal Kedaluwarsa (Opsional)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Status Kupon
              </label>
              <select
                value={isActive ? "true" : "false"}
                onChange={(e) => setIsActive(e.target.value === "true")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                <option value="true">Aktif (Dapat Digunakan)</option>
                <option value="false">Nonaktif (Dijeda)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Deskripsi Promo Kupon
            </label>
            <input
              type="text"
              placeholder="e.g. Diskon 25% untuk peluncuran tema monorepo baru..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
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
                  <span>Menyimpan Kupon...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>Buat Kupon Diskon</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground flex items-center justify-between">
          <span>Daftar Kupon Promo Aktif ({filteredCoupons.length} kupon)</span>
        </div>

        <div className="divide-y divide-border/40 text-xs">
          {filteredCoupons.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Belum ada kupon diskon terdaftar.
            </div>
          ) : (
            filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant="default" className="font-mono text-xs">
                      {coupon.code}
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {coupon.discountPercent}% OFF
                    </Badge>
                    <Badge
                      variant={coupon.isActive ? "outline" : "destructive"}
                      className="text-[10px]"
                    >
                      {coupon.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>

                  {coupon.description && (
                    <p className="text-xs text-muted-foreground">
                      {coupon.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
                    <span>
                      Min. Belanja:{" "}
                      {coupon.minSpend
                        ? `IDR ${coupon.minSpend.toLocaleString("id-ID")}`
                        : "Tanpa Minimum"}
                    </span>
                    <span>&bull;</span>
                    <span>
                      Penggunaan: {coupon.usedCount}
                      {coupon.maxUses ? ` / ${coupon.maxUses} kuota` : " kali"}
                    </span>
                    {coupon.expiresAt && (
                      <>
                        <span>&bull;</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>
                            Kedaluwarsa:{" "}
                            {new Date(coupon.expiresAt).toLocaleDateString(
                              "id-ID",
                              { dateStyle: "medium" }
                            )}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(coupon)}
                    className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {coupon.isActive ? (
                      <>
                        <Ban className="size-3 text-amber-500" />
                        <span>Nonaktifkan</span>
                      </>
                    ) : (
                      <>
                        <Check className="size-3 text-emerald-500" />
                        <span>Aktifkan</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Hapus kupon "${coupon.code}" permanen?`)) {
                        await deleteCoupon(coupon.id)
                      }
                    }}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Hapus Kupon"
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
  )
}
