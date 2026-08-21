import { CmsPageShell } from "../../components/cms-page-shell"
import { Badge } from "@workspace/ui/components/badge"
import { DeleteButton } from "../../components/delete-confirm-dialog"
import {
  getProducts,
  createProduct,
  deleteProduct,
  getOrders,
} from "../../lib/actions/shop-actions"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ShopManagerPage() {
  const [productList, orderList] = await Promise.all([
    getProducts(),
    getOrders(),
  ])

  return (
    <CmsPageShell
      title="Shop & Orders Manager"
      description="Kelola katalog produk digital, harga, file unduhan, dan status pesanan."
    >
      <div className="space-y-8">
        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Tambah Produk Digital
          </h2>
          <form
            action={async (formData: FormData) => {
              "use server"
              const title = formData.get("title")?.toString() || ""
              const slug =
                formData.get("slug")?.toString().trim().toLowerCase() ||
                title
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^\w-]/g, "")
              const description = formData.get("description")?.toString() || ""
              const price = parseInt(
                formData.get("price")?.toString() || "0",
                10
              )
              const currency = formData.get("currency")?.toString() || "IDR"
              const productType =
                formData.get("productType")?.toString() || "DIGITAL_DOWNLOAD"
              const coverImageUrl =
                formData.get("coverImageUrl")?.toString() || null

              if (title && slug) {
                await createProduct({
                  title,
                  slug,
                  description,
                  price,
                  currency,
                  productType,
                  coverImageUrl,
                  stock: 999,
                  isActive: true,
                })
              }
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                name="title"
                placeholder="Nama Produk (e.g. Next.js Template)"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <input
                name="slug"
                placeholder="Slug URL (opsional)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <input
                name="price"
                type="number"
                placeholder="Harga (e.g. 150000)"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <textarea
              name="description"
              rows={2}
              placeholder="Deskripsi produk digital..."
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />

            <div className="flex items-center justify-between pt-1">
              <input
                name="coverImageUrl"
                placeholder="URL Gambar Sampul (opsional)"
                className="w-72 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="size-3.5" />
                Tambah Produk
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
          <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground">
            Daftar Produk ({productList.length})
          </div>

          <div className="divide-y divide-border/40 text-xs">
            {productList.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Belum ada produk yang ditambahkan.
              </div>
            ) : (
              productList.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {prod.title}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {prod.currency} {prod.price.toLocaleString("id-ID")}
                      </Badge>
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      /{prod.slug} • {prod.productType}
                    </div>
                  </div>

                  <DeleteButton
                    onConfirm={async () => {
                      "use server"
                      await deleteProduct(prod.id)
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
          <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground">
            Pesanan Masuk ({orderList.length})
          </div>

          <div className="divide-y divide-border/40 text-xs">
            {orderList.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Belum ada riwayat pesanan.
              </div>
            ) : (
              orderList.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
                >
                  <div>
                    <div className="font-medium text-foreground">
                      #{order.orderNumber} • {order.customerEmail}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {order.currency}{" "}
                      {order.totalAmount.toLocaleString("id-ID")} •{" "}
                      {new Date(order.createdAt).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <Badge
                    variant={order.status === "PAID" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {order.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </CmsPageShell>
  )
}
