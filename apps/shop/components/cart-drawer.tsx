"use client"

import { useState, useTransition, useEffect } from "react"
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
  Zap,
} from "lucide-react"
import { useCart } from "./cart-provider"
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

  const [couponInput, setCouponInput] = useState("")
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        closeCart()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, closeCart])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

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
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        aria-label="Shopping Cart Drawer"
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform"
      >
        <header className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Shopping Cart
              </h2>
              <p className="text-xs text-muted-foreground">
                {items.length === 0
                  ? "0 items"
                  : `${items.reduce((acc, it) => acc + it.quantity, 0)} item(s) selected`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-muted-foreground">
              <ShoppingBag className="size-7 text-muted-foreground/60" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">
              Your cart is empty
            </h3>
            <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Explore our curated software architectures, design systems, and
              consultation packages.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
            >
              <span>Explore Store Catalog</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border/50 overflow-y-auto px-6 py-2">
              {items.map((item) => {
                const isExtended = item.licenseType === "EXTENDED"

                return (
                  <div key={item.id} className="py-4 space-y-3">
                    <div className="flex gap-3">
                      {item.coverImageUrl ? (
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted">
                          <Image
                            src={item.coverImageUrl}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted">
                          <ShoppingBag className="size-6 text-muted-foreground/60" />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="space-y-1">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="text-xs font-semibold leading-snug text-foreground transition-colors hover:text-primary"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {formatPrice(item.price, item.currency)}
                            </span>
                            <span>•</span>
                            <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                              {isExtended
                                ? "Extended License"
                                : "Standard License"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-lg border border-border bg-muted/40">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label="Decrease quantity"
                              className="flex size-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="min-w-6 text-center font-mono text-xs font-medium text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label="Increase quantity"
                              className="flex size-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.title}`}
                            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-2.5 py-1.5 text-[11px]">
                      <span className="text-muted-foreground">Tier:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const standardPrice = isExtended
                              ? Math.round(item.price / 1.75)
                              : item.price
                            updateLicense(item.id, "STANDARD", standardPrice)
                          }}
                          className={cn(
                            "rounded px-2 py-0.5 font-medium transition-colors",
                            !isExtended
                              ? "bg-primary text-primary-foreground"
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
                            "rounded px-2 py-0.5 font-medium transition-colors",
                            isExtended
                              ? "bg-primary text-primary-foreground"
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

            <div className="space-y-4 border-t border-border/80 bg-card p-6">
              {coupon ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Tag className="size-3.5" />
                    <span className="font-mono font-semibold">
                      {coupon.code}
                    </span>
                    <span>({coupon.discountPercent}% off applied)</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label="Remove coupon"
                    className="flex size-5 items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. DEV20)"
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs uppercase placeholder:normal-case placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={isPending || !couponInput.trim()}
                      className="rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      {isPending ? "Validating..." : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-500">{couponError}</p>
                  )}
                </form>
              )}

              <div className="space-y-2 border-t border-border/60 pt-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-border/60 pt-2 text-sm font-semibold text-foreground">
                  <span>Grand Total</span>
                  <span className="font-mono text-base">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="size-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-primary" />
                  <span>Encrypted Checkout</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Zap className="size-3.5 text-primary" />
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
