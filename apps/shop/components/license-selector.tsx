"use client"

import { Check, ShieldCheck, Building2 } from "lucide-react"
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
      icon: Building2,
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
                "relative flex cursor-pointer flex-col justify-between rounded-md border p-3.5 transition-colors select-none",
                isSelected
                  ? "border-foreground/80 bg-muted/30"
                  : "border-border/70 bg-card/30 hover:border-foreground/30 hover:bg-muted/20"
              )}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="size-3.5 text-muted-foreground" />
                      <h3 className="text-xs font-semibold text-foreground">
                        {option.title}
                      </h3>
                    </div>
                    <span className="inline-block rounded-md border border-border/70 bg-muted/40 px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground">
                      {option.badge}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full border transition-colors",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border/80 bg-background"
                    )}
                  >
                    {isSelected && <Check className="size-2.5" />}
                  </div>
                </div>

                <div className="pt-0.5">
                  <span className="font-mono text-base font-bold text-foreground">
                    {formatPrice(option.price, currency)}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    One-time payment
                  </span>
                </div>

                <ul className="space-y-1 border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground">
                  {option.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
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
