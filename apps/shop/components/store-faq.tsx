"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

import { FAQ_ITEMS, type FaqItem } from "../data/faq"

export { FAQ_ITEMS, type FaqItem }

export function StoreFaq({ items = FAQ_ITEMS }: { items?: FaqItem[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["faq-1"]))

  function toggleFaq(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <section className="space-y-6 border-t border-border/60 pt-12">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Frequently Asked Questions
        </h2>
        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Transparent licensing terms, instant digital delivery workflows, and
          senior engineering support guarantees.
        </p>
      </div>

      <div className="divide-y divide-border/50">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openIds.has(item.id)

          return (
            <div key={item.id} className="py-3.5">
              <button
                type="button"
                onClick={() => toggleFaq(item.id)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-4 text-left transition-colors hover:text-foreground"
              >
                <span className="text-xs font-semibold text-foreground sm:text-sm">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180 text-foreground"
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
    </section>
  )
}
