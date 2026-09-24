"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  ShoppingBag,
  ShoppingCart,
  FileArchive,
  Ticket,
  Search,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  Calendar,
  CreditCard,
  User,
  Loader2,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { ProductEditDialog } from "./product-edit-dialog"
import { ProductFileManager } from "./product-file-manager"
import { OrderDetailDialog } from "./order-detail-dialog"
import { CouponManager } from "./coupon-manager"
import { createProduct, deleteProduct } from "@/lib/actions/shop-actions"

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
  createdAt: Date
  updatedAt: Date
}

interface ProductFileItem {
  id: string
  productId: string
  fileName: string
  fileSizeBytes: number
  storagePath: string
  createdAt: Date
}

interface OrderItem {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  currency: string
  status: string
  paymentProvider: string | null
  paymentRef: string | null
  createdAt: Date
  updatedAt: Date
}

interface OrderDetailItem {
  id: string
  orderId: string
  productId: string
  pricePaid: number
  downloadToken: string | null
  tokenExpiresAt: Date | null
}

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

interface ShopManagerViewProps {
  products: ProductItem[]
  orders: OrderItem[]
  productFiles: ProductFileItem[]
  coupons: CouponItem[]
  orderItems: OrderDetailItem[]
}

type ShopTab = "PRODUCTS" | "ORDERS" | "FILES" | "COUPONS"

export function ShopManagerView({
  products,
  orders,
  productFiles,
  coupons,
  orderItems,
}: ShopManagerViewProps) {
  const [activeTab, setActiveTab] = useState<ShopTab>("PRODUCTS")
  const [searchProduct, setSearchProduct] = useState("")
  const [productTypeFilter, setProductTypeFilter] = useState("ALL")
  const [searchOrder, setSearchOrder] = useState("")
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL")

  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number | string>(150000)
  const [currency, setCurrency] = useState("IDR")
  const [productType, setProductType] = useState("DIGITAL_DOWNLOAD")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [stock, setStock] = useState<number | string>(999)
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredProducts = useMemo(() => {
    const q = searchProduct.toLowerCase().trim()
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)

      const matchType =
        productTypeFilter === "ALL" || p.productType === productTypeFilter

      return matchSearch && matchType
    })
  }, [products, searchProduct, productTypeFilter])

  const filteredOrders = useMemo(() => {
    const q = searchOrder.toLowerCase().trim()
    return orders.filter((o) => {
      const matchSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)

      const matchStatus =
        orderStatusFilter === "ALL" || o.status === orderStatusFilter

      return matchSearch && matchStatus
    })
  }, [orders, searchOrder, orderStatusFilter])

  const orderItemsMap = useMemo(() => {
    const map = new Map<string, OrderDetailItem[]>()
    for (const item of orderItems) {
      const arr = map.get(item.orderId) || []
      arr.push(item)
      map.set(item.orderId, arr)
    }
    return map
  }, [orderItems])

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const generatedSlug =
      slug.trim().toLowerCase() ||
      title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")

    setIsSubmitting(true)
    try {
      await createProduct({
        title: title.trim(),
        slug: generatedSlug,
        description: description.trim(),
        price: Number(price) || 0,
        currency,
        productType,
        coverImageUrl: coverImageUrl.trim() || null,
        stock: Number(stock) || 0,
        isActive,
      })

      setTitle("")
      setSlug("")
      setDescription("")
      setPrice(150000)
      setCurrency("IDR")
      setProductType("DIGITAL_DOWNLOAD")
      setCoverImageUrl("")
      setStock(999)
      setIsActive(true)
      setIsFormExpanded(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  function getOrderStatusVariant(status: string) {
    switch (status) {
      case "PAID":
      case "COMPLETED":
        return "default"
      case "PENDING":
        return "secondary"
      case "REFUNDED":
        return "outline"
      case "FAILED":
      default:
        return "destructive"
    }
  }

  const shopBaseUrl =
    process.env.NEXT_PUBLIC_SHOP_URL || "http://localhost:3003"

  return (
    <div className="space-y-6">
      <div className="flex border-b border-border/80">
        <button
          type="button"
          onClick={() => setActiveTab("PRODUCTS")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition-colors ${
            activeTab === "PRODUCTS"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingBag className="size-4" />
          <span>Katalog Produk</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ORDERS")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition-colors ${
            activeTab === "ORDERS"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingCart className="size-4" />
          <span>Pesanan Pelanggan</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {orders.length}
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
          <FileArchive className="size-4" />
          <span>Berkas Unduhan Digital</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {productFiles.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("COUPONS")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition-colors ${
            activeTab === "COUPONS"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Ticket className="size-4" />
          <span>Kupon Promo</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {coupons.length}
          </span>
        </button>
      </div>

      {activeTab === "PRODUCTS" && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
            <div className="flex items-center justify-between border-b border-border/80 p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
                  <Plus className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Tambah Produk Digital Baru
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Tambahkan template kode, materi pembelajaran, lisensi perangkat lunak, atau paket jasa.
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
              <form onSubmit={handleCreateProduct} className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Nama Produk Digital
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Next.js Enterprise Starter Template"
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
                      Tipe Produk
                    </label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    >
                      <option value="DIGITAL_DOWNLOAD">Digital Download</option>
                      <option value="LICENSE">Lisensi Software</option>
                      <option value="SERVICE">Layanan Konsultasi</option>
                      <option value="COURSE">Video Course</option>
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
                      placeholder="nextjs-enterprise-starter"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Harga Satuan
                    </label>
                    <input
                      type="number"
                      placeholder="150000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
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

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Deskripsi Produk Digital
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan fitur, spesifikasi teknis, dan apa saja yang diperoleh pembeli..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      URL Gambar Sampul
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Jumlah Stok
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      min={0}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
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
                        <Plus className="size-3.5" />
                        <span>Simpan & Daftarkan Produk</span>
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
                <ShoppingBag className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Daftar Katalog Produk ({filteredProducts.length})
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="w-48 rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-60"
                  />
                </div>

                <select
                  value={productTypeFilter}
                  onChange={(e) => setProductTypeFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="ALL">Semua Tipe</option>
                  <option value="DIGITAL_DOWNLOAD">Digital Download</option>
                  <option value="LICENSE">Lisensi Software</option>
                  <option value="SERVICE">Layanan</option>
                  <option value="COURSE">Video Course</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
              <div className="divide-y divide-border/40 text-xs">
                {filteredProducts.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    {searchProduct || productTypeFilter !== "ALL"
                      ? "Tidak ada produk yang cocok dengan filter pencarian."
                      : "Belum ada produk digital terdaftar."}
                  </div>
                ) : (
                  filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3.5">
                        {prod.coverImageUrl ? (
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border">
                            <Image
                              src={prod.coverImageUrl}
                              alt={prod.title}
                              width={48}
                              height={48}
                              unoptimized
                              className="size-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-foreground">
                            <ShoppingBag className="size-5 text-muted-foreground" />
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {prod.title}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {prod.currency} {prod.price.toLocaleString("id-ID")}
                            </Badge>
                            <Badge
                              variant={prod.isActive ? "default" : "destructive"}
                              className="text-[9px]"
                            >
                              {prod.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                            <Badge variant="secondary" className="text-[9px]">
                              {prod.productType}
                            </Badge>
                          </div>

                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {prod.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
                            <span className="font-semibold text-foreground/80">
                              /{prod.slug}
                            </span>
                            <span>&bull;</span>
                            <span>Stok: {prod.stock}</span>
                            <span>&bull;</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              <span>
                                {new Date(prod.createdAt).toLocaleDateString(
                                  "id-ID",
                                  { dateStyle: "medium" }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <a
                          href={`${shopBaseUrl}/product/${prod.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex size-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Lihat Produk di Toko"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setEditingProduct(prod)}
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
                                `Hapus produk "${prod.title}" beserta berkas unduhannya?`
                              )
                            ) {
                              await deleteProduct(prod.id)
                            }
                          }}
                          className="flex size-8 items-center justify-center rounded-lg border border-destructive/20 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          title="Hapus Produk"
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

      {activeTab === "ORDERS" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Daftar Pesanan Masuk ({filteredOrders.length})
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari nomor pesanan, pembeli, email..."
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  className="w-56 rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-72"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
              >
                <option value="ALL">Semua Status</option>
                <option value="PAID">PAID (Lunas)</option>
                <option value="PENDING">PENDING (Menunggu)</option>
                <option value="REFUNDED">REFUNDED (Dikembalikan)</option>
                <option value="FAILED">FAILED (Dibatalkan)</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
            <div className="divide-y divide-border/40 text-xs">
              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  {searchOrder || orderStatusFilter !== "ALL"
                    ? "Tidak ada pesanan yang cocok dengan filter pencarian."
                    : "Belum ada pesanan masuk."}
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const itemsCount = (orderItemsMap.get(order.id) || []).length

                  return (
                    <div
                      key={order.id}
                      className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono font-semibold text-foreground">
                            #{order.orderNumber}
                          </span>
                          <Badge
                            variant={getOrderStatusVariant(order.status)}
                            className="font-mono text-[10px]"
                          >
                            {order.status}
                          </Badge>
                          <span className="font-mono font-semibold text-foreground">
                            {order.currency} {order.totalAmount.toLocaleString("id-ID")}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="size-3" />
                            <span className="font-medium text-foreground">
                              {order.customerName}
                            </span>
                          </div>
                          <span>&bull;</span>
                          <span className="font-mono">{order.customerEmail}</span>
                          <span>&bull;</span>
                          <span>{itemsCount} item produk</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CreditCard className="size-3" />
                            <span>{order.paymentProvider || "Gateway"}</span>
                          </div>
                          <span>&bull;</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            <span>
                              {new Date(order.createdAt).toLocaleString("id-ID", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <Eye className="size-3.5 text-muted-foreground" />
                          <span>Inspeksi Pesanan</span>
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "FILES" && (
        <ProductFileManager products={products} files={productFiles} />
      )}

      {activeTab === "COUPONS" && (
        <CouponManager coupons={coupons} />
      )}

      <ProductEditDialog
        product={editingProduct}
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
      />

      <OrderDetailDialog
        order={selectedOrder}
        items={selectedOrder ? orderItemsMap.get(selectedOrder.id) || [] : []}
        products={products}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  )
}
