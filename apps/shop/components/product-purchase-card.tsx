"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Download,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react"
import { useCart } from "./cart-provider"
import { useCurrency } from "./currency-context"
import { LicenseSelector, type LicenseTier } from "./license-selector"
import { formatPrice } from "../lib/utils"
import type { ShopProduct } from "../lib/queries"

interface ProductPurchaseCardProps {
  product: ShopProduct
}

export function ProductPurchaseCard({ product }: ProductPurchaseCardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { currency, format } = useCurrency()

  const [selectedLicense, setSelectedLicense] =
    useState<LicenseTier>("STANDARD")

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
    <div className="sticky top-20 space-y-5 rounded-lg border border-border/70 bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-muted/30 px-2.5 py-1 text-xs font-medium text-foreground">
          {isDigital ? (
            <>
              <Download className="size-3.5 text-muted-foreground" />
              <span>Digital Package</span>
            </>
          ) : (
            <>
              <Users className="size-3.5 text-muted-foreground" />
              <span>1-on-1 Consultation</span>
            </>
          )}
        </span>

        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5" />
          <span>Verified & Available</span>
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {format(currentPrice)}
          </span>
          <span className="text-xs text-muted-foreground">
            {selectedLicense === "EXTENDED" ? "Extended Tier" : "Standard Tier"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Perpetual commercial license with instant access token delivery.
        </p>
      </div>

      <div className="border-t border-border/50 pt-4">
        <LicenseSelector
          standardPrice={product.price}
          extendedPrice={product.extendedPrice}
          currency={currency}
          selectedLicense={selectedLicense}
          onSelectLicense={setSelectedLicense}
        />
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-foreground py-2.5 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
        >
          <ShoppingBag className="size-3.5" />
          <span>Add to Shopping Cart</span>
        </button>

        <button
          type="button"
          onClick={handleInstantCheckout}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border/70 bg-background py-2.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/60"
        >
          <span>Instant Checkout</span>
          <ArrowRight className="size-3.5" />
        </button>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
          <Lock className="size-3 text-muted-foreground" />
          <span>Encrypted 256-bit checkout & direct fulfillment</span>
        </div>
      </div>

      <div className="space-y-2 border-t border-border/50 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 shrink-0 text-muted-foreground" />
          <span>Full source code with commercial usage rights</span>
        </div>
        <div className="flex items-center gap-2">
          <Download className="size-3.5 shrink-0 text-muted-foreground" />
          <span>Lifetime access and free future revision downloads</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-3.5 shrink-0 text-muted-foreground" />
          <span>14-day defect resolution and refund guarantee</span>
        </div>
      </div>

      <div className="space-y-1.5 rounded-md border border-border/50 bg-muted/20 p-3.5 text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Architecture</span>
          <span className="font-mono font-medium text-foreground">
            {product.techStack?.[0] || "Next.js 16"} +{" "}
            {product.techStack?.[1] || "React 19"}
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
