"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface FaqItem {
  id: string
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do I receive digital packages after checkout?",
    answer:
      "Digital assets are provisioned immediately upon successful transaction completion. You will be redirected to your dedicated Order Fulfillment Hub where you can download the full ZIP source archive, copy your license key, and view the quick-start installation guide. A backup receipt with permanent access tokens is also recorded.",
  },
  {
    id: "faq-2",
    question: "What is the difference between Standard and Extended licenses?",
    answer:
      "A Standard License permits you to use the codebase for one personal or commercial client project. An Extended Commercial License grants unlimited multi-project usage, commercial SaaS distribution, and rights to incorporate the architecture into monetized customer applications.",
  },
  {
    id: "faq-3",
    question: "Do I receive future updates when Next.js or Tailwind releases new versions?",
    answer:
      "Yes. All digital starter kits and UI systems include lifetime patches. Whenever upstream dependencies receive major upgrades (such as Next.js releases or Tailwind CSS improvements), revised archives are pushed to the repository and become accessible via your download token.",
  },
  {
    id: "faq-4",
    question: "How does the 1-on-1 Consultation Session work?",
    answer:
      "Upon booking a consultation package, you receive a direct scheduling link to pick a 60-minute or 90-minute time slot on Google Meet. Ahead of the session, we review your repository architecture, performance bottlenecks, or migration requirements to deliver targeted engineering guidance.",
  },
  {
    id: "faq-5",
    question: "Can I request a refund if the codebase does not match specifications?",
    answer:
      "We offer a 14-day quality guarantee. If you encounter a verified bug or architectural defect that cannot be resolved via our support team within 48 hours, you are eligible for full refund assistance.",
  },
]

export function StoreFaq() {
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
