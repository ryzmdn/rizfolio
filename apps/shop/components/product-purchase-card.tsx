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
    <div className="sticky top-24 space-y-6 rounded-3xl border border-foreground/15 bg-background p-6 shadow-2xl sm:p-8">
      <div className="flex items-center justify-between border-b border-foreground/6 pb-4">
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          {isDigital ? "DIGITAL ARCHITECTURE" : "EXECUTIVE ADVISORY"}
        </span>

        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span>VERIFIED ASSET</span>
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            {format(currentPrice)}
          </span>
          <span className="font-mono text-xs text-muted-foreground uppercase">
            {selectedLicense === "EXTENDED"
              ? "Extended License"
              : "Standard License"}
          </span>
        </div>
        <p className="text-xs font-light text-muted-foreground">
          Perpetual commercial rights with instant download cryptographic token.
        </p>
      </div>

      <div className="border-t border-foreground/6 pt-4">
        <LicenseSelector
          standardPrice={product.price}
          extendedPrice={product.extendedPrice}
          currency={currency}
          selectedLicense={selectedLicense}
          onSelectLicense={setSelectedLicense}
        />
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-foreground py-3.5 font-mono text-xs tracking-widest text-background uppercase shadow-lg transition-all hover:opacity-90 active:scale-[0.99]"
        >
          <ShoppingBag className="size-3.5" />
          <span>Add to Bag</span>
        </button>

        <button
          type="button"
          onClick={handleInstantCheckout}
          className="group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-foreground/15 bg-background py-3.5 font-mono text-xs tracking-widest text-foreground uppercase transition-all hover:border-foreground/40 hover:bg-foreground/[0.03] active:scale-[0.99]"
        >
          <span>Instant Checkout</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>

        <div className="flex items-center justify-center gap-1.5 pt-1 font-mono text-[10px] text-muted-foreground">
          <Lock className="size-3 text-muted-foreground" />
          <span>Encrypted 256-bit checkout &amp; automated fulfillment</span>
        </div>
      </div>

      <div className="space-y-2 border-t border-foreground/6 pt-5 text-xs font-light text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 shrink-0 text-foreground/50" />
          <span>Full source code with unrestricted commercial deployment</span>
        </div>
        <div className="flex items-center gap-2">
          <Download className="size-3.5 shrink-0 text-foreground/50" />
          <span>Lifetime access and free revision repository downloads</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-3.5 shrink-0 text-foreground/50" />
          <span>14-day technical defect resolution guarantee</span>
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-foreground/8 bg-foreground/[0.015] p-4 font-mono text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>STACK</span>
          <span className="text-foreground">
            {product.techStack?.[0] || "Next.js 16"} +{" "}
            {product.techStack?.[1] || "React 19"}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>FORMAT</span>
          <span className="text-foreground">
            {isDigital ? "Cryptographic ZIP" : "Google Meet Advisory"}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>LICENSE</span>
          <span className="text-foreground">Perpetual Commercial</span>
        </div>
      </div>
    </div>
  )
}
