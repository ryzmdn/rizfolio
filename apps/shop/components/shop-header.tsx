"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { useCart } from "./cart-provider"
import { CurrencySelector } from "./currency-selector"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { Container } from "@workspace/ui/components/layouts/container"
import { cn } from "@workspace/ui/lib/utils"

export function ShopHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalCount, openCart } = useCart()

  const navLinks = [
    { label: "ALL ASSETS", href: "/" },
    { label: "STARTER KITS", href: "/?category=STARTER_KIT" },
    { label: "UI SYSTEMS", href: "/?category=UI_SYSTEM" },
    { label: "BACKEND", href: "/?category=BACKEND" },
    { label: "ADVISORY", href: "/?type=SERVICE" },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/6 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-opacity hover:opacity-80"
            aria-label="Rizfolio Boutique Home"
          >
            <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
              RIZFOLIO.
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase sm:inline">
              ARCHIVE & BOUTIQUE
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 pl-4 md:flex"
            aria-label="Store navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-1 font-mono text-[11px] tracking-wider transition-colors uppercase",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <CurrencySelector />

          <button
            type="button"
            onClick={openCart}
            aria-label={`View cart with ${totalCount} items`}
            className="group relative inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.02] px-4 py-1.5 font-mono text-[11px] tracking-wider text-foreground uppercase transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/[0.05]"
          >
            <span>BAG</span>
            <span className="text-foreground/40">[</span>
            <span className="font-semibold text-foreground">{totalCount}</span>
            <span className="text-foreground/40">]</span>
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex size-8 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {mobileMenuOpen && (
        <div className="border-t border-foreground/6 bg-background/95 px-6 py-5 backdrop-blur-2xl md:hidden">
          <nav
            className="flex flex-col gap-2"
            aria-label="Mobile store navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setTimeout(() => setMobileMenuOpen(false), 50)}
                className="flex items-center justify-between rounded-lg px-2 py-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="size-3 text-muted-foreground/60" />
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
