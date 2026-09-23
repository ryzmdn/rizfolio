"use client"

import { Check, ShieldCheck, Zap } from "lucide-react"
import { formatPrice } from "../lib/utils"
import { cn } from "@workspace/ui/lib/utils"

export type LicenseTier = "STANDARD" | "EXTENDED"

interface LicenseSelectorProps {
  standardPrice: number
  extendedPrice: number
  currency?: string
  selectedLicense: LicenseTier
  onSelectLicense: (license: LicenseTier) => void
}

export function LicenseSelector({
  standardPrice,
  extendedPrice,
  currency = "IDR",
  selectedLicense,
  onSelectLicense,
}: LicenseSelectorProps) {
  const options = [
    {
      id: "STANDARD" as LicenseTier,
      title: "Standard License",
      price: standardPrice,
      badge: "Single Project",
      icon: ShieldCheck,
      description: "For 1 commercial or personal production build.",
      perks: [
        "Deploy on 1 commercial or client application",
        "Full unminified TypeScript source code",
        "Lifetime patch & revision downloads",
        "Direct email engineering support",
      ],
    },
    {
      id: "EXTENDED" as LicenseTier,
      title: "Extended Commercial",
      price: extendedPrice,
      badge: "Unlimited & SaaS",
      icon: Zap,
      description: "For multi-client deployments and commercial SaaS applications.",
      perks: [
        "Unlimited end-product deployments",
        "Commercial SaaS and monetized app rights",
        "Multi-developer team code sharing",
        "Priority engineering support line",
      ],
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Select Commercial Tier
        </span>
        <span className="text-[11px] text-muted-foreground">
          Perpetual ownership
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedLicense === option.id
          const Icon = option.icon

          return (
            <div
              key={option.id}
              onClick={() => onSelectLicense(option.id)}
              className={cn(
                "relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all duration-200 select-none",
                isSelected
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40"
                  : "border-border/70 bg-card/40 hover:border-border hover:bg-card/70"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="size-4 text-primary" />
                      <h3 className="text-xs font-bold text-foreground">
                        {option.title}
                      </h3>
                    </div>
                    <span className="inline-block rounded-md border border-border/80 bg-muted/60 px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground">
                      {option.badge}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex size-4.5 items-center justify-center rounded-full border transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 bg-background"
                    )}
                  >
                    {isSelected && <Check className="size-3" />}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="font-mono text-lg font-bold text-foreground">
                    {formatPrice(option.price, currency)}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    One-time payment
                  </span>
                </div>

                <ul className="space-y-1.5 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                  {option.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 size-3 shrink-0 text-primary" />
                      <span className="leading-snug">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
