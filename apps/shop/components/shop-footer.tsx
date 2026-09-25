"use client"

import {
  Zap,
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
      icon: Zap,
      title: "Instant Digital Fulfillment",
      description: "Direct download links and license keys provisioned upon purchase.",
    },
    {
      icon: ShieldCheck,
      title: "Production-Tested",
      description: "Strict TypeScript compliance with zero runtime type errors.",
    },
    {
      icon: FileCode,
      title: "Full Source Code",
      description: "Clean, unminified source code with comprehensive documentation.",
    },
    {
      icon: Clock,
      title: "14-Day Guarantee",
      description: "Eligible for refund assistance if the package does not meet specs.",
    },
  ]

  const ecosystemLinks = [
    { label: "Personal Portfolio", href: "https://rizkyramadhan.dev" },
    { label: "Engineering Blog", href: "https://blog.rizkyramadhan.dev" },
    { label: "Documentation & Explorer", href: "https://docs.rizkyramadhan.dev" },
  ]

  const legalLinks = [
    { label: "Standard License", href: "#" },
    { label: "Extended License", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ]

  return (
    <footer className="border-t border-border/80 bg-card/40">
      <div className="border-b border-border/60 py-10">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((g) => {
              const Icon = g.icon
              return (
                <div key={g.title} className="flex items-start gap-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-foreground">
                      {g.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {g.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="space-y-3 md:col-span-6">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="size-3.5" />
              </div>
              <span className="font-mono text-sm font-bold text-foreground">
                Rizfolio Store
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              Curated software architectures, production starter kits, and
              senior engineering consultation sessions engineered by Rizky
              Ramadhan to accelerate real-world digital builds.
            </p>
          </div>

          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
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

          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Legal & Licenses
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Rizky Ramadhan. All rights reserved.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground"
          >
            <span>Back to top</span>
            <ArrowUp className="size-3.5" />
          </button>
        </div>
      </Container>
    </footer>
  )
}
