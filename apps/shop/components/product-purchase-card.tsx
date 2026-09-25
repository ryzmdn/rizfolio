"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Download,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Zap,
} from "lucide-react"
import { useCart } from "./cart-provider"
import { LicenseSelector, type LicenseTier } from "./license-selector"
import { formatPrice } from "../lib/utils"
import type { ShopProduct } from "../lib/queries"

interface ProductPurchaseCardProps {
  product: ShopProduct
}

export function ProductPurchaseCard({ product }: ProductPurchaseCardProps) {
  const router = useRouter()
  const { addItem } = useCart()

  const [selectedLicense, setSelectedLicense] = useState<LicenseTier>("STANDARD")

  const isDigital = product.productType === "DIGITAL_DOWNLOAD"
  const currentPrice =
    selectedLicense === "EXTENDED" ? product.extendedPrice : product.price

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      coverImageUrl: product.coverImageUrl,
      productType: product.productType,
      licenseType: selectedLicense,
      price: currentPrice,
      currency: product.currency,
      fileName: product.files?.[0]?.fileName,
      fileSizeBytes: product.files?.[0]?.fileSizeBytes,
    })
  }

  function handleInstantCheckout() {
    handleAddToCart()
    router.push("/checkout")
  }

  return (
    <div className="sticky top-24 space-y-6 rounded-3xl border border-border/80 bg-card/70 p-6 shadow-sm backdrop-blur-md sm:p-8">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {isDigital ? (
            <>
              <Download className="size-3.5" />
              <span>Digital Download</span>
            </>
          ) : (
            <>
              <Sparkles className="size-3.5" />
              <span>1-on-1 Consultation</span>
            </>
          )}
        </span>

        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
          <CheckCircle2 className="size-3.5" />
          <span>In Stock & Ready</span>
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {formatPrice(currentPrice, product.currency)}
          </span>
          <span className="text-xs text-muted-foreground">
            {selectedLicense === "EXTENDED" ? "Extended Tier" : "Standard Tier"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Perpetual commercial license with instant access token delivery.
        </p>
      </div>

      <div className="border-t border-border/60 pt-5">
        <LicenseSelector
          standardPrice={product.price}
          extendedPrice={product.extendedPrice}
          currency={product.currency}
          selectedLicense={selectedLicense}
          onSelectLicense={setSelectedLicense}
        />
      </div>

      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.99]"
        >
          <ShoppingBag className="size-4" />
          <span>Add to Shopping Cart</span>
        </button>

        <button
          type="button"
          onClick={handleInstantCheckout}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-[0.99]"
        >
          <span>Instant Checkout</span>
          <ArrowRight className="size-3.5" />
        </button>

        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-muted-foreground">
          <Lock className="size-3 text-muted-foreground" />
          <span>Encrypted 256-bit checkout & direct fulfillment</span>
        </div>
      </div>

      <div className="space-y-2.5 border-t border-border/60 pt-5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          <span>Full source code with commercial usage rights</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="size-4 shrink-0 text-primary" />
          <span>Lifetime access and free future revision downloads</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0 text-primary" />
          <span>14-day defect resolution and refund guarantee</span>
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/30 p-4 text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Architecture</span>
          <span className="font-mono font-medium text-foreground">
            {product.techStack?.[0] || "Next.js 16"} + {product.techStack?.[1] || "React 19"}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Delivery Format</span>
          <span className="font-medium text-foreground">
            {isDigital ? "Secure ZIP Archive" : "Google Meet Calendar"}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>License Term</span>
          <span className="font-medium text-foreground">Perpetual</span>
        </div>
      </div>
    </div>
  )
}
