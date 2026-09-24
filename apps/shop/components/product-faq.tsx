"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import type { ProductFaq as ProductFaqType } from "../data/fallback-products"
import { cn } from "@workspace/ui/lib/utils"

interface ProductFaqProps {
  faq: ProductFaqType[]
}

export function ProductFaq({ faq }: ProductFaqProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]))

  if (!faq || faq.length === 0) return null

  function toggleIndex(idx: number) {
    setOpenIndices((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }

  return (
    <div className="space-y-4 rounded-3xl border border-border/70 bg-card/40 p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <HelpCircle className="size-4 text-primary" />
        <h3 className="text-base font-semibold text-foreground">
          Frequently Asked Questions
        </h3>
      </div>

      <div className="divide-y divide-border/60">
        {faq.map((item, idx) => {
          const isOpen = openIndices.has(idx)

          return (
            <div key={item.question} className="py-3.5">
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-3 text-left transition-colors hover:text-primary"
              >
                <span className="text-xs font-semibold text-foreground sm:text-sm">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </button>

              {isOpen && (
                <div className="pt-2 text-xs leading-relaxed text-muted-foreground">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
