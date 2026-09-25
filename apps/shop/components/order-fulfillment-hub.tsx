"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Download,
  Copy,
  Check,
  Printer,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from "lucide-react"
import { formatPrice } from "../lib/utils"
import type { DigitalOrder } from "../lib/queries"

interface OrderFulfillmentHubProps {
  order: DigitalOrder
}

export function OrderFulfillmentHub({ order }: OrderFulfillmentHubProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  function handleCopyLicense(key: string) {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center sm:p-12">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-8" />
        </div>
        <span className="mt-4 font-mono text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Order Verified & Completed
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
          Order Fulfillment Hub
        </h1>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Thank you for your purchase, {order.customerName}. Your permanent
          access tokens and commercial software licenses are provisioned below.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-xl border border-border/80 bg-background px-3.5 py-1.5 font-mono text-xs font-bold text-foreground">
            Order: {order.orderNumber}
          </span>
          <span className="rounded-xl border border-border/80 bg-background px-3.5 py-1.5 text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Purchased Assets & Licenses ({order.items.length})
          </h2>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Printer className="size-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        <div className="space-y-6">
          {order.items.map((item, index) => {
            const isService = !item.downloadToken
            const downloadUrl = item.downloadToken
              ? `/download/${item.downloadToken}`
              : "#"

            return (
              <div
                key={item.productId + index}
                className="space-y-6 rounded-3xl border border-border/80 bg-card/60 p-6 backdrop-blur-md sm:p-8"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                        {item.licenseType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Item {index + 1}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      {item.productTitle}
                    </h3>
                  </div>

                  <div className="font-mono text-sm font-bold text-foreground sm:text-base">
                    {formatPrice(item.pricePaid, order.currency)}
                  </div>
                </div>

                {isService ? (
                  <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                        <Calendar className="size-4" />
                        <span>Book Your 1-on-1 Consultation Slot</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select a convenient time slot on Google Meet for your
                        dedicated engineering session.
                      </p>
                    </div>

                    <a
                      href="https://calendar.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                    >
                      <span>Schedule Meeting</span>
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-background/80 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {item.fileName || "digital-source-archive.zip"}
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Full unminified source code archive with lifetime
                        revision access.
                      </p>
                    </div>

                    <a
                      href={downloadUrl}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                    >
                      <Download className="size-3.5" />
                      <span>Download ZIP Package</span>
                    </a>
                  </div>
                )}

                {item.licenseKey && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">
                        Perpetual License Certificate Key
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Commercial usage authorized
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-background px-4 py-3">
                      <code className="font-mono text-xs font-bold text-primary sm:text-sm">
                        {item.licenseKey}
                      </code>

                      <button
                        type="button"
                        onClick={() => handleCopyLicense(item.licenseKey!)}
                        aria-label="Copy license key"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        {copiedKey === item.licenseKey ? (
                          <>
                            <Check className="size-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            <span>Copy Key</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {!isService && (
                  <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <Terminal className="size-3.5 text-primary" />
                      <span>Quick Start Instructions</span>
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
                      <p>1. Extract archive: unzip {item.fileName || "archive.zip"} -d ./project</p>
                      <p>2. Install dependencies: pnpm install</p>
                      <p>3. Start development server: pnpm dev</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card/40 p-6 backdrop-blur-md sm:p-8">
        <h3 className="text-sm font-bold text-foreground">
          Invoice & Payment Receipt
        </h3>

        <div className="mt-4 divide-y divide-border/50 text-xs">
          <div className="flex items-center justify-between py-2 text-muted-foreground">
            <span>Customer Name</span>
            <span className="font-medium text-foreground">
              {order.customerName}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 text-muted-foreground">
            <span>Customer Email</span>
            <span className="font-mono text-foreground">
              {order.customerEmail}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 text-muted-foreground">
            <span>Payment Method</span>
            <span className="font-medium text-foreground">
              {order.paymentMethod}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 text-muted-foreground">
            <span>Payment Status</span>
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3" />
              <span>{order.status}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 text-sm font-bold text-foreground">
            <span>Total Paid</span>
            <span className="font-mono text-base">
              {formatPrice(order.totalAmount, order.currency)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:underline"
        >
          <Layers className="size-3.5" />
          <span>Explore More Software Packages</span>
        </Link>

        <p className="text-[11px] text-muted-foreground">
          Need technical assistance? Reach us at support@rizkyramadhan.dev
        </p>
      </div>
    </div>
  )
}
