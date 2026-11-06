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
import { formatRawPrice } from "../lib/utils"
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
    <div className="space-y-12">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-foreground/15 bg-foreground/[0.02] p-8 text-center sm:p-14">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-foreground/15 bg-foreground/[0.03] text-foreground">
          <CheckCircle2 className="size-6 stroke-[1.5]" />
        </div>
        <span className="mt-4 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          ORDER CRYPTOGRAPHICALLY VERIFIED
        </span>
        <h1 className="mt-2 text-2xl font-light tracking-tight text-foreground sm:text-4xl">
          Order Fulfillment &amp; License Provisioning
        </h1>
        <p className="mt-3 max-w-md text-xs font-light leading-relaxed text-muted-foreground sm:text-sm">
          Thank you for your acquisition, {order.customerName}. Your permanent access tokens and commercial software licenses are provisioned below.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full border border-foreground/15 bg-background px-4 py-1 font-mono text-xs text-foreground">
            ORDER #{order.orderNumber}
          </span>
          <span className="rounded-full border border-foreground/15 bg-background px-4 py-1 font-mono text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-foreground/6 pb-4">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            PURCHASED ARCHITECTURES &amp; LICENSES ({order.items.length})
          </h2>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-foreground/15 px-3.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <Printer className="size-3" />
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
                className="space-y-6 rounded-3xl border border-foreground/10 bg-foreground/[0.015] p-6 sm:p-8"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                      <span className="rounded-full border border-foreground/15 bg-background px-2.5 py-0.5 text-[10px] text-foreground uppercase">
                        {item.licenseType}
                      </span>
                      <span>•</span>
                      <span>ITEM 0{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                      {item.productTitle}
                    </h3>
                  </div>

                  <div className="font-mono text-lg font-light text-foreground sm:text-xl">
                    {formatRawPrice(item.pricePaid, order.currency)}
                  </div>
                </div>

                {isService ? (
                  <div className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-xs text-foreground uppercase">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span>Book Your 1-on-1 Advisory Session</span>
                      </div>
                      <p className="text-xs font-light text-muted-foreground">
                        Select an available calendar slot on Google Meet for your dedicated systems review.
                      </p>
                    </div>

                    <a
                      href="https://calendar.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-mono text-xs tracking-wider text-background uppercase shadow-md transition-all hover:scale-[1.02]"
                    >
                      <span>Schedule Meeting</span>
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1 font-mono">
                      <span className="text-xs font-medium text-foreground">
                        {item.fileName || "digital-source-archive.zip"}
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Full unminified repository source archive with lifetime revision access.
                      </p>
                    </div>

                    <a
                      href={downloadUrl}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-mono text-xs tracking-wider text-background uppercase shadow-md transition-all hover:scale-[1.02]"
                    >
                      <Download className="size-3.5" />
                      <span>Download Archive</span>
                    </a>
                  </div>
                )}

                {item.licenseKey && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                      <span>PERPETUAL LICENSE CERTIFICATE KEY</span>
                      <span className="text-[10px] uppercase">COMMERCIAL USE AUTHORIZED</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-foreground/15 bg-background p-3 sm:p-4">
                      <code className="font-mono text-xs text-foreground sm:text-sm">
                        {item.licenseKey}
                      </code>

                      <button
                        type="button"
                        onClick={() => handleCopyLicense(item.licenseKey!)}
                        aria-label="Copy license key"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1 font-mono text-xs text-foreground transition-colors hover:border-foreground/40"
                      >
                        {copiedKey === item.licenseKey ? (
                          <>
                            <Check className="size-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {!isService && (
                  <div className="space-y-2 rounded-2xl border border-foreground/8 bg-foreground/[0.015] p-4 font-mono text-xs">
                    <div className="flex items-center gap-2 text-foreground uppercase tracking-wider">
                      <Terminal className="size-3.5 text-muted-foreground" />
                      <span>Quick Extraction Instructions</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-muted-foreground">
                      <p>1. Extract archive: unzip {item.fileName || "archive.zip"} -d ./project</p>
                      <p>2. Install dependencies: pnpm install</p>
                      <p>3. Start development: pnpm dev</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.015] p-6 sm:p-8">
        <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          RECEIPT &amp; TRANSACTION BREAKDOWN
        </h3>

        <div className="mt-4 divide-y divide-foreground/6 font-mono text-xs">
          <div className="flex items-center justify-between py-2.5 text-muted-foreground">
            <span>Customer</span>
            <span className="text-foreground">{order.customerName}</span>
          </div>

          <div className="flex items-center justify-between py-2.5 text-muted-foreground">
            <span>Email</span>
            <span className="text-foreground">{order.customerEmail}</span>
          </div>

          <div className="flex items-center justify-between py-2.5 text-muted-foreground">
            <span>Payment Provider</span>
            <span className="text-foreground">{order.paymentMethod}</span>
          </div>

          <div className="flex items-center justify-between py-2.5 text-muted-foreground">
            <span>Status</span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="size-3" />
              <span>{order.status}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 text-sm text-foreground">
            <span>Total Captured</span>
            <span className="text-base font-semibold">
              {formatRawPrice(order.totalAmount, order.currency)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-foreground/6 pt-8 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <Layers className="size-3.5" />
          <span>Explore More Architectures</span>
        </Link>

        <p className="font-mono text-[11px] text-muted-foreground">
          Need assistance? Contact support@rizkyramadhan.dev
        </p>
      </div>
    </div>
  )
}
