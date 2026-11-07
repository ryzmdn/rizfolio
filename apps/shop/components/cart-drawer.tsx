"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Download,
} from "lucide-react"
import { useCart } from "./cart-provider"
import { useCurrency } from "./currency-context"
import { formatPrice } from "../lib/utils"
import { validatePromoCodeAction } from "../lib/actions"
import { cn } from "@workspace/ui/lib/utils"

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    updateLicense,
    subtotal,
    discountAmount,
    grandTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart()
  const { currency, format } = useCurrency()

  const [couponInput, setCouponInput] = useState("")
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const drawerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousActiveElement = document.activeElement as HTMLElement | null
    document.body.style.overflow = "hidden"

    const drawerEl = drawerRef.current
    if (drawerEl) {
      const focusable = drawerEl.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length > 0) {
        focusable[0]?.focus()
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        closeCart()
        return
      }

      if (e.key === "Tab") {
        if (!drawerEl) return
        const focusable = drawerEl.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      previousActiveElement?.focus()
    }
  }, [isOpen, closeCart])

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault()
    if (!couponInput.trim()) return

    setCouponError(null)
    startTransition(async () => {
      const result = await validatePromoCodeAction(couponInput)
      if (result.valid && result.code && result.discountPercent) {
        applyCoupon({
          code: result.code,
          discountPercent: result.discountPercent,
          description: result.description || "Promotional Discount",
        })
        setCouponInput("")
      } else {
        setCouponError(result.error || "Invalid coupon code.")
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-foreground/10 bg-card/95 shadow-2xl backdrop-blur-2xl transition-transform"
      >
        <header className="flex items-center justify-between border-b border-foreground/8 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 text-foreground">
              <ShoppingBag className="size-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="cart-drawer-title"
                  className="font-serif text-base font-light tracking-tight text-foreground"
                >
                  Shopping Bag
                </h2>
                <span className="rounded-full border border-foreground/10 bg-foreground/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
                  {items.length === 0
                    ? "0 UNITS"
                    : `${items.reduce((acc, it) => acc + it.quantity, 0)} UNITS`}
                </span>
              </div>
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                Curated Architecture Artifacts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex size-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-dashed border-foreground/15 bg-foreground/5 text-muted-foreground">
              <ShoppingBag className="size-6 text-foreground/40" />
            </div>
            <h3 className="mt-5 font-serif text-lg font-light tracking-tight text-foreground">
              Your bag is empty
            </h3>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Explore our curated software architectures, production design
              systems, and advisory services.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 font-mono text-xs font-medium tracking-wider text-background uppercase transition-all duration-200 hover:opacity-90"
            >
              <span>Explore Collection</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-foreground/6 overflow-y-auto px-6 py-3">
              {items.map((item) => {
                const isExtended = item.licenseType === "EXTENDED"

                return (
                  <div key={item.id} className="space-y-3 py-4">
                    <div className="flex gap-4">
                      {item.coverImageUrl ? (
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5">
                          <Image
                            src={item.coverImageUrl}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/5">
                          <ShoppingBag className="size-5 text-foreground/40" />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="space-y-1">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="font-serif text-sm leading-snug font-light text-foreground transition-colors hover:text-muted-foreground"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="font-mono text-xs font-medium text-foreground">
                              {format(item.price)}
                            </span>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="font-mono text-[10px] text-muted-foreground uppercase">
                              {isExtended ? "Extended" : "Standard"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-foreground/10 bg-foreground/5 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label="Decrease quantity"
                              className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                            >
                              <Minus className="size-2.5" />
                            </button>
                            <span className="min-w-6 text-center font-mono text-xs font-medium text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label="Increase quantity"
                              className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                            >
                              <Plus className="size-2.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.title}`}
                            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-foreground/6 bg-foreground/3 px-3 py-1.5 text-xs">
                      <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                        License
                      </span>
                      <div className="flex items-center rounded-full border border-foreground/8 bg-foreground/5 p-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            const standardPrice = isExtended
                              ? Math.round(item.price / 1.75)
                              : item.price
                            updateLicense(item.id, "STANDARD", standardPrice)
                          }}
                          className={cn(
                            "rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase transition-all",
                            !isExtended
                              ? "bg-foreground font-semibold text-background shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Standard
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const extendedPrice = isExtended
                              ? item.price
                              : Math.round(item.price * 1.75)
                            updateLicense(item.id, "EXTENDED", extendedPrice)
                          }}
                          className={cn(
                            "rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase transition-all",
                            isExtended
                              ? "bg-foreground font-semibold text-background shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Extended
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-4 border-t border-foreground/8 bg-card/90 p-6 backdrop-blur-xl">
              {coupon ? (
                <div className="flex items-center justify-between rounded-full border border-foreground/20 bg-foreground/5 px-4 py-2 text-xs">
                  <div className="flex items-center gap-2 text-foreground">
                    <Tag className="size-3.5" />
                    <span className="font-mono font-semibold">
                      {coupon.code}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      ({coupon.discountPercent}% OFF)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label="Remove coupon"
                    className="flex size-5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      id="cart-coupon-input"
                      type="text"
                      aria-label="Promo or discount coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="PROMO CODE"
                      className="flex-1 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 font-mono text-xs uppercase placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={isPending || !couponInput.trim()}
                      className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 font-mono text-xs text-foreground uppercase transition-all duration-200 hover:border-foreground/30 hover:bg-foreground hover:text-background disabled:opacity-40"
                    >
                      {isPending ? "Validating..." : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="px-3 font-mono text-[11px] text-rose-500">
                      {couponError}
                    </p>
                  )}
                </form>
              )}

              <div className="space-y-2 border-t border-foreground/8 pt-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-mono text-[11px] tracking-wider uppercase">
                    Subtotal
                  </span>
                  <span className="font-mono text-foreground">
                    {format(subtotal)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between font-mono text-emerald-600 dark:text-emerald-400">
                    <span className="text-[11px] tracking-wider uppercase">
                      Discount
                    </span>
                    <span>-{format(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-foreground/8 pt-2.5">
                  <span className="font-serif text-sm font-light text-foreground">
                    Total Amount
                  </span>
                  <span className="font-mono text-lg font-light tracking-tight text-foreground">
                    {format(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setTimeout(() => closeCart(), 50)}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 font-mono text-xs tracking-widest text-background uppercase transition-all duration-300 hover:opacity-90"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full text-center font-mono text-[11px] tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  Continue Browsing
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 pt-1 font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-3 text-foreground/40" />
                  <span>256-Bit Encrypted</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Download className="size-3 text-foreground/40" />
                  <span>Instant Delivery</span>
                </span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
