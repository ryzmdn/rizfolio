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
      <Container className="max-w-2xl py-24 text-center">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-foreground/10 bg-foreground/[0.015] p-10 sm:p-16">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-foreground/15 bg-foreground/[0.02] text-muted-foreground">
            <ShoppingBag className="size-6 stroke-[1.25]" />
          </div>
          <h1 className="mt-5 text-2xl font-light tracking-tight text-foreground sm:text-3xl">
            Your Bag is Empty
          </h1>
          <p className="mt-2 max-w-sm text-xs leading-relaxed font-light text-muted-foreground sm:text-sm">
            Select an architectural software package or advisory contract from
            the catalog to initiate provisioning.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-3 font-mono text-xs tracking-widest text-background uppercase shadow-md transition-all hover:scale-[1.02]"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container className="max-w-6xl py-12 md:py-20">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        <span>Return to Catalog</span>
      </Link>

      <div className="mb-10 space-y-2 border-b border-foreground/6 pb-6">
        <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
          [ 01 / ENCRYPTED CHECKOUT ]
        </span>
        <h1 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Checkout & License Provisioning.
        </h1>
        <p className="max-w-2xl text-sm font-light text-muted-foreground">
          Complete your acquisition to receive immediate cryptographic download
          tokens and verified commercial license keys.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
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
