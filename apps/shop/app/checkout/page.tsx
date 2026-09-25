"use client"

import Link from "next/link"
import { ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"
import { useCart } from "@/components/cart-provider"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderSummaryCard } from "@/components/order-summary-card"

export default function CheckoutPage() {
  const { items } = useCart()

  if (items.length === 0) {
    return (
      <Container className="max-w-2xl py-20 text-center">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 p-8 py-20">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
            <ShoppingBag className="size-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Your Cart is Empty
          </h1>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
            You need to select at least one software architecture package or
            consultation session before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <span>Explore Store Catalog</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container className="max-w-6xl py-10 md:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        <span>Continue Shopping</span>
      </Link>

      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Checkout & License Provisioning
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Complete your purchase to receive instant access to your source code
          repository archives and perpetual commercial license keys.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <CheckoutForm />
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <OrderSummaryCard />
          </div>
        </div>
      </div>
    </Container>
  )
}
