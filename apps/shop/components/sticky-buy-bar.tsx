"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Layers } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"
import { useCurrency } from "./currency-context"
import { AddToCartButton } from "./add-to-cart-button"
import type { ShopProduct } from "../lib/queries"
import { cn } from "@workspace/ui/lib/utils"

interface StickyBuyBarProps {
  product: ShopProduct
}

export function StickyBuyBar({ product }: StickyBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { format } = useCurrency()

  useEffect(() => {
    let rafId: number | null = null

    function handleScroll() {
      if (rafId !== null) return

      rafId = window.requestAnimationFrame(() => {
        const nextVisible = window.scrollY > 450
        setIsVisible((prev) => (prev !== nextVisible ? nextVisible : prev))
        rafId = null
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      role="region"
      aria-label="Quick purchase bar"
      className={cn(
        "fixed right-0 bottom-0 left-0 z-40 border-t border-foreground/8 bg-background/90 p-3 shadow-2xl backdrop-blur-2xl transition-all"
      )}
    >
      <Container className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 overflow-hidden">
          {product.coverImageUrl ? (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-foreground/10 bg-muted">
              <Image
                src={product.coverImageUrl}
                alt={product.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-muted">
              <Layers className="size-4 text-muted-foreground" />
            </div>
          )}

          <div className="truncate">
            <h3 className="truncate text-xs font-medium text-foreground sm:text-sm">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">
                {format(product.price)}
              </span>
              <span>•</span>
              <span className="uppercase">PERPETUAL COMMERCIAL</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <AddToCartButton
            product={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              coverImageUrl: product.coverImageUrl,
              productType: product.productType,
              price: product.price,
              currency: product.currency,
            }}
            size="sm"
            label="Add to Bag"
          />
        </div>
      </Container>
    </div>
  )
}
