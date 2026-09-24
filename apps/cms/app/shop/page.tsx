import { CmsPageShell } from "@/components/cms-page-shell"
import { ShopManagerView } from "@/components/shop/shop-manager-view"
import {
  getProducts,
  getOrders,
  getAllProductFiles,
  getCoupons,
  getAllOrderItems,
} from "@/lib/actions/shop-actions"

export const dynamic = "force-dynamic"

export default async function ShopManagerPage() {
  const [products, orders, productFiles, coupons, orderItems] =
    await Promise.all([
      getProducts(),
      getOrders(),
      getAllProductFiles(),
      getCoupons(),
      getAllOrderItems(),
    ])

  return (
    <CmsPageShell
      title="Shop, Orders & Coupon Manager"
      description="Kelola katalog produk digital, status pesanan pelanggan, berkas unduhan, dan kupon diskon promo."
    >
      <ShopManagerView
        products={products}
        orders={orders}
        productFiles={productFiles}
        coupons={coupons}
        orderItems={orderItems}
      />
    </CmsPageShell>
  )
}
