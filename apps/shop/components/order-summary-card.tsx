"use client"

import Image from "next/image"
import { ShieldCheck, Zap, Lock, ShoppingBag, Tag } from "lucide-react"
import { useCart } from "./cart-provider"
import { formatPrice } from "../lib/utils"

export function OrderSummaryCard() {
  const { items, subtotal, discountAmount, grandTotal, coupon } = useCart()

  return (
    <div className="space-y-6 rounded-3xl border border-border/80 bg-card/60 p-6 shadow-sm backdrop-blur-md sm:p-8">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <h2 className="text-base font-semibold text-foreground">
          Order Summary
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {items.reduce((acc, it) => acc + it.quantity, 0)} item(s)
        </span>
      </div>

      <div className="divide-y divide-border/50">
        {items.map((item) => {
          const isExtended = item.licenseType === "EXTENDED"

          return (
            <div key={item.id} className="flex gap-3 py-3.5">
              {item.coverImageUrl ? (
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted">
                  <Image
                    src={item.coverImageUrl}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted">
                  <ShoppingBag className="size-5 text-muted-foreground" />
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="line-clamp-1 text-xs font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span>Qty: {item.quantity}</span>
                    <span>•</span>
                    <span className="rounded bg-muted px-1.5 py-0.2 font-medium">
                      {isExtended ? "Extended" : "Standard"}
                    </span>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-foreground">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {coupon && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <Tag className="size-3.5" />
            <span className="font-mono font-semibold">{coupon.code}</span>
          </div>
          <span>{coupon.discountPercent}% Discount Applied</span>
        </div>
      )}

      <div className="space-y-2.5 border-t border-border/60 pt-4 text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span>Promotional Discount</span>
            <span className="font-mono">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border/60 pt-3 text-base font-bold text-foreground">
          <span>Total Amount</span>
          <span className="font-mono text-lg">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      <div className="space-y-2 border-t border-border/60 pt-5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Lock className="size-3.5 shrink-0 text-primary" />
          <span>256-bit SSL encrypted transaction verification</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="size-3.5 shrink-0 text-primary" />
          <span>Immediate digital fulfillment and token generation</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 shrink-0 text-primary" />
          <span>14-day technical defect resolution guarantee</span>
        </div>
      </div>
    </div>
  )
}
