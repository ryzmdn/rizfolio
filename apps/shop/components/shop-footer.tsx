"use client"

import {
  Download,
  ShieldCheck,
  FileCode,
  Clock,
  ArrowUp,
  Layers,
} from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"

export function ShopFooter() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const guarantees = [
    {
      icon: Download,
      title: "Instant Digital Fulfillment",
      description:
        "Direct download links and license keys provisioned upon purchase.",
    },
    {
      icon: ShieldCheck,
      title: "Production-Tested",
      description:
        "Strict TypeScript compliance with zero runtime type errors.",
    },
    {
      icon: FileCode,
      title: "Full Source Code",
      description:
        "Clean, unminified source code with comprehensive documentation.",
    },
    {
      icon: Clock,
      title: "14-Day Guarantee",
      description:
        "Eligible for refund assistance if the package does not meet specs.",
    },
  ]

  const ecosystemLinks = [
    { label: "Personal Portfolio", href: "https://rizkyramadhan.dev" },
    { label: "Engineering Blog", href: "https://blog.rizkyramadhan.dev" },
    {
      label: "Documentation & Explorer",
      href: "https://docs.rizkyramadhan.dev",
    },
  ]

  const legalLinks = [
    { label: "Standard License Terms", href: "/#faq" },
    { label: "Extended License Terms", href: "/#faq" },
    { label: "Refund & Resolution Policy", href: "/#faq" },
    { label: "Delivery & Fulfillment FAQ", href: "/#faq" },
  ]

  return (
    <footer className="border-t border-foreground/8 bg-background">
      <div className="border-b border-foreground/6 py-12">
        <Container>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((g) => {
              const Icon = g.icon
              return (
                <div key={g.title} className="flex items-start gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 text-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-sm font-light tracking-tight text-foreground">
                      {g.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {g.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 text-foreground">
                <Layers className="size-3.5" aria-hidden="true" />
              </div>
              <span className="font-serif text-base font-light tracking-tight text-foreground">
                Rizfolio Architecture Store
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              Curated software architectures, production starter kits, and
              senior engineering consultation sessions engineered by Rizky
              Ramadhan to accelerate real-world digital builds.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              <span>Global Instant Asset Delivery Network</span>
            </div>
          </div>

          <div className="space-y-4 md:col-span-3">
            <h4 className="font-mono text-[11px] tracking-widest text-foreground uppercase">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {ecosystemLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:col-span-3">
            <h4 className="font-mono text-[11px] tracking-widest text-foreground uppercase">
              Legal & Terms
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-foreground/8 pt-8 font-mono text-[11px] text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Rizky Ramadhan. All architectural
            assets protected.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 tracking-wider uppercase transition-all duration-200 hover:border-foreground/30 hover:bg-foreground hover:text-background"
          >
            <span>Back to top</span>
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </Container>
    </footer>
  )
}
