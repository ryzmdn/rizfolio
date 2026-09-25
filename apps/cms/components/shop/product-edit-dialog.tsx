"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Save, Loader2 } from "lucide-react"
import { updateProduct } from "@/lib/actions/shop-actions"

interface ProductItem {
  id: string
  title: string
  slug: string
  description: string
  price: number
  currency: string
  productType: string
  coverImageUrl: string | null
  galleryUrls: string[] | null
  stock: number
  isActive: boolean
}

interface ProductEditDialogProps {
  product: ProductItem | null
  isOpen: boolean
  onClose: () => void
}

interface ProductEditFormProps {
  product: ProductItem
  onClose: () => void
}

function ProductEditForm({ product, onClose }: ProductEditFormProps) {
  const [title, setTitle] = useState(product.title || "")
  const [slug, setSlug] = useState(product.slug || "")
  const [description, setDescription] = useState(product.description || "")
  const [price, setPrice] = useState(product.price || 0)
  const [currency, setCurrency] = useState(product.currency || "IDR")
  const [productType, setProductType] = useState(
    product.productType || "DIGITAL_DOWNLOAD"
  )
  const [coverImageUrl, setCoverImageUrl] = useState(
    product.coverImageUrl || ""
  )
  const [galleryUrlsInput, setGalleryUrlsInput] = useState(
    product.galleryUrls?.join(", ") || ""
  )
  const [stock, setStock] = useState(product.stock ?? 999)
  const [isActive, setIsActive] = useState(product.isActive ?? true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return

    setIsSubmitting(true)
    try {
      const parsedGallery = galleryUrlsInput
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean)

      await updateProduct(product.id, {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
        price: Number(price) || 0,
        currency,
        productType,
        coverImageUrl: coverImageUrl.trim() || null,
        galleryUrls: parsedGallery.length > 0 ? parsedGallery : null,
        stock: Number(stock) || 0,
        isActive,
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
            Nama Produk Digital
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
            Tipe Produk
          </label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="DIGITAL_DOWNLOAD">Digital Download (Source Code / Assets)</option>
            <option value="LICENSE">Lisensi Software</option>
            <option value="SERVICE">Layanan Konsultasi</option>
            <option value="COURSE">Materi Video / Course</option>
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
            Harga Satuan
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Mata Uang
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="IDR">IDR (Rupiah)</option>
            <option value="USD">USD (US Dollar)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Jumlah Stok Tersedia
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            min={0}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Status Aktif Katalog
          </label>
          <select
            value={isActive ? "true" : "false"}
            onChange={(e) => setIsActive(e.target.value === "true")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="true">Aktif (Dapat Dibeli)</option>
            <option value="false">Nonaktif (Diarsipkan)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Deskripsi Lengkap Produk
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          URL Gambar Sampul
        </label>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          />
          {coverImageUrl && (
            <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-border">
              <Image
                src={coverImageUrl}
                alt="Sampul"
                width={36}
                height={36}
                unoptimized
                className="size-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          URL Galeri Gambar (Pisahkan dengan koma)
        </label>
        <input
          type="text"
          value={galleryUrlsInput}
          onChange={(e) => setGalleryUrlsInput(e.target.value)}
          placeholder="https://images.unsplash.com/... , https://images.unsplash.com/..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
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
              <span>Menyimpan Produk...</span>
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

export function ProductEditDialog({
  product,
  isOpen,
  onClose,
}: ProductEditDialogProps) {
  if (!isOpen || !product) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Produk Digital"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-50 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Edit Produk: {product.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Perbarui harga, kuota stok, visibilitas, gambar sampul, dan deskripsi produk.
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

        <ProductEditForm key={product.id} product={product} onClose={onClose} />
      </div>
    </div>
  )
}
