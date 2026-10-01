"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ShieldCheck,
  CreditCard,
  Wallet,
  Terminal,
  Lock,
  ArrowRight,
  Globe,
  Loader2,
} from "lucide-react"
import { useCart } from "./cart-provider"
import { useCurrency } from "./currency-context"
import { createOrderAction } from "../lib/actions"
import { createStripeCheckoutSessionAction } from "../lib/stripe-actions"
import { CurrencySelector } from "./currency-selector"
import { cn } from "@workspace/ui/lib/utils"

export function CheckoutForm() {
  const router = useRouter()
  const { items, grandTotal, coupon, clearCart } = useCart()
  const { currency, currencyInfo, format } = useCurrency()
  const [isPending, startTransition] = useTransition()

  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const paymentOptions = [
    {
      id: "stripe",
      title: "Stripe Secure Payment (Cards & E-Wallets)",
      description:
        "Credit or Debit cards, Apple Pay, Google Pay, Link, and local e-money supported in your currency.",
      badges: ["Visa / MC", "Apple Pay", "Google Pay", "E-Money"],
      icon: CreditCard,
    },
    {
      id: "sandbox",
      title: "Instant Sandbox Order (Developer Test Mode)",
      description:
        "Direct immediate order provisioning for testing without real card entry.",
      badges: ["Instant Access", "Test Mode"],
      icon: Terminal,
    },
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage("Please enter your full name with at least 2 characters.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!customerEmail.trim() || !emailRegex.test(customerEmail.trim())) {
      setErrorMessage("Please enter a valid delivery email address.")
      return
    }

    if (!agreeTerms) {
      setErrorMessage(
        "Please accept the Commercial Software License Terms to proceed."
      )
      return
    }

    if (items.length === 0) {
      setErrorMessage("Your shopping cart is empty.")
      return
    }

    startTransition(async () => {
      const orderItemsInput = items.map((it) => ({
        productId: it.productId,
        productTitle: it.title,
        productSlug: it.slug,
        licenseType: it.licenseType,
        pricePaid: it.price * it.quantity,
        fileName: it.fileName,
        fileSizeBytes: it.fileSizeBytes,
      }))

      if (paymentMethod === "stripe") {
        const result = await createStripeCheckoutSessionAction({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          currency,
          couponCode: coupon?.code,
          items: orderItemsInput,
        })

        if (!result.success) {
          setErrorMessage(
            result.error || "Failed to initialize Stripe payment session."
          )
          return
        }

        if (result.checkoutUrl) {
          clearCart()
          window.location.href = result.checkoutUrl
          return
        }

        if (result.isTestSimulation && result.orderNumber) {
          clearCart()
          router.push(`/order/${result.orderNumber}`)
          return
        }
      } else {
        const result = await createOrderAction({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          paymentMethod: "Instant Sandbox Order",
          couponCode: coupon?.code,
          items: orderItemsInput,
        })

        if (result.success && result.orderNumber) {
          clearCart()
          router.push(`/order/${result.orderNumber}`)
        } else {
          setErrorMessage(
            result.error || "An error occurred while creating your test order."
          )
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Currency & Location Selector Card */}
      <div className="space-y-4 rounded-lg border border-border/70 bg-card/40 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">
                Payment Currency & Region
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Select your preferred currency. Prices are calculated at
              equivalent values for every country.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CurrencySelector />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs text-muted-foreground">
          <span className="text-base select-none" aria-hidden="true">
            {currencyInfo.flag}
          </span>
          <p className="leading-relaxed">
            Charging in{" "}
            <span className="font-semibold text-foreground">
              {currencyInfo.name} ({currencyInfo.code})
            </span>
            . Equivalent value:{" "}
            <span className="font-mono font-bold text-foreground">
              {format(grandTotal)}
            </span>
            .
          </p>
        </div>
      </div>

      {/* 2. Delivery Contact Details */}
      <div className="space-y-4 rounded-lg border border-border/70 bg-card/40 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-foreground">
          1. Delivery Contact Details
        </h2>
        <p className="text-xs text-muted-foreground">
          Your permanent download tokens, license certificates, and transaction
          receipts will be delivered to this email address.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Full Name
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Alex Pratama"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Delivery Email Address
            </label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="alex@company.com"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 3. Payment Method Selection */}
      <div className="space-y-4 rounded-lg border border-border/70 bg-card/40 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            2. Payment Method
          </h2>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-muted-foreground" />
            <span>Stripe Encrypted</span>
          </span>
        </div>

        <div className="space-y-2.5">
          {paymentOptions.map((opt) => {
            const isSelected = paymentMethod === opt.id
            const Icon = opt.icon

            return (
              <div
                key={opt.id}
                onClick={() => setPaymentMethod(opt.id)}
                className={cn(
                  "flex cursor-pointer items-start gap-3.5 rounded-md border p-3.5 transition-colors select-none",
                  isSelected
                    ? "border-foreground/80 bg-muted/30"
                    : "border-border/60 bg-muted/10 hover:border-border hover:bg-muted/20"
                )}
              >
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border/80 bg-background text-foreground">
                  <Icon className="size-4" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {opt.title}
                    </span>
                    <div
                      className={cn(
                        "size-3.5 rounded-full border transition-colors",
                        isSelected
                          ? "border-foreground bg-foreground"
                          : "border-muted-foreground/40 bg-background"
                      )}
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    {opt.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {opt.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Terms and Submit */}
      <div className="space-y-4 rounded-lg border border-border/70 bg-card/40 p-5 sm:p-6">
        <label className="flex cursor-pointer items-start gap-3 select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 size-4 rounded-md border-border text-primary focus:ring-ring"
          />
          <span className="text-xs leading-relaxed text-muted-foreground">
            I agree to the{" "}
            <span className="font-medium text-foreground underline underline-offset-2">
              Commercial Software License Terms
            </span>
            , intellectual property terms, and 14-day defect resolution refund
            policy.
          </span>
        </label>

        {errorMessage && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || items.length === 0}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>
                {paymentMethod === "stripe"
                  ? "Connecting to Stripe Secure Gateway..."
                  : "Provisioning Digital License..."}
              </span>
            </>
          ) : (
            <>
              <Lock className="size-3.5" />
              <span>
                {paymentMethod === "stripe"
                  ? `Pay with Stripe (${format(grandTotal)})`
                  : `Complete Test Order (${format(grandTotal)})`}
              </span>
              <ArrowRight className="size-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
