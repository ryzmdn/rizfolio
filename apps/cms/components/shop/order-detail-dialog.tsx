"use client"

import { useState } from "react"
import {
  X,
  User,
  Mail,
  Calendar,
  CreditCard,
  Package,
  Key,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { updateOrderStatus } from "@/lib/actions/shop-actions"

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

interface ProductItem {
  id: string
  title: string
  slug: string
}

interface OrderDetailDialogProps {
  order: OrderItem | null
  items: OrderDetailItem[]
  products: ProductItem[]
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailDialog({
  order,
  items,
  products,
  isOpen,
  onClose,
}: OrderDetailDialogProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  if (!isOpen || !order) return null

  const productMap = new Map<string, string>()
  for (const p of products) {
    productMap.set(p.id, p.title)
  }

  async function handleStatusChange(
    newStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  ) {
    if (!order) return
    setIsUpdatingStatus(true)
    try {
      await updateOrderStatus(order.id, newStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  function getStatusVariant(status: string) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Inspeksi Pesanan Pelanggan"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-50 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-foreground">
              Rincian Pesanan #{order.orderNumber}
            </h2>
            <Badge variant={getStatusVariant(order.status)} className="font-mono text-xs">
              {order.status}
            </Badge>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-foreground">
              Ubah Status Pemenuhan Pesanan
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isUpdatingStatus || order.status === "PAID"}
                onClick={() => handleStatusChange("PAID")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Tandai Lunas (PAID)</span>
              </button>

              <button
                type="button"
                disabled={isUpdatingStatus || order.status === "PENDING"}
                onClick={() => handleStatusChange("PENDING")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <Clock className="size-3.5 text-amber-500" />
                <span>Menunggu (PENDING)</span>
              </button>

              <button
                type="button"
                disabled={isUpdatingStatus || order.status === "REFUNDED"}
                onClick={() => handleStatusChange("REFUNDED")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <RefreshCcw className="size-3.5 text-blue-500" />
                <span>Pengembalian (REFUNDED)</span>
              </button>

              <button
                type="button"
                disabled={isUpdatingStatus || order.status === "FAILED"}
                onClick={() => handleStatusChange("FAILED")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-40"
              >
                <AlertCircle className="size-3.5" />
                <span>Batalkan (FAILED)</span>
              </button>

              {isUpdatingStatus && (
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground pl-2">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Memperbarui status...</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-border/80 bg-background p-4">
              <h3 className="text-xs font-semibold text-foreground">
                Informasi Pembeli
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="size-3.5" />
                  <span className="font-medium text-foreground">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5" />
                  <span className="font-mono">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>
                    {new Date(order.createdAt).toLocaleString("id-ID", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border/80 bg-background p-4">
              <h3 className="text-xs font-semibold text-foreground">
                Rincian Pembayaran
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Transaksi:</span>
                  <span className="font-mono font-semibold text-foreground">
                    {order.currency} {order.totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Metode Pembayaran:</span>
                  <span className="font-mono text-foreground flex items-center gap-1">
                    <CreditCard className="size-3" />
                    {order.paymentProvider || "Standard Gateway"}
                  </span>
                </div>
                {order.paymentRef && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ID Referensi:</span>
                    <span className="font-mono text-foreground truncate max-w-[180px]">
                      {order.paymentRef}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ID Pesanan:</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {order.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Package className="size-4 text-muted-foreground" />
              <span>Daftar Item Produk yang Dibeli ({items.length})</span>
            </h3>

            <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
              <div className="divide-y divide-border/40 text-xs">
                {items.length === 0 ? (
                  <div className="py-6 text-center text-muted-foreground">
                    Tidak ada rincian item produk yang terlampir.
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 p-4 transition-colors hover:bg-muted/10 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <span className="font-medium text-foreground">
                          {productMap.get(item.productId) || item.productId}
                        </span>
                        {item.downloadToken && (
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                            <Key className="size-3 text-amber-500" />
                            <span>Token Unduhan: {item.downloadToken}</span>
                          </div>
                        )}
                        {item.tokenExpiresAt && (
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                            <Clock className="size-3" />
                            <span>
                              Kedaluwarsa:{" "}
                              {new Date(item.tokenExpiresAt).toLocaleDateString(
                                "id-ID"
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="font-mono font-semibold text-foreground">
                        {order.currency} {item.pricePaid.toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-border/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
