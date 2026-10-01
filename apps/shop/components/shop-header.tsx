"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Menu, X, Layers } from "lucide-react"
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
    { label: "All Products", href: "/" },
    { label: "Starter Kits", href: "/?category=STARTER_KIT" },
    { label: "UI Kits", href: "/?category=UI_SYSTEM" },
    { label: "Backend", href: "/?category=BACKEND" },
    { label: "Consultations", href: "/?type=SERVICE" },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
      <Container className="flex h-15 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
            aria-label="Rizfolio Store Home"
          >
            <div className="flex size-8 items-center justify-center rounded-md border border-border/80 bg-muted/40 text-foreground transition-colors group-hover:border-foreground/30">
              <Layers className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-tight text-foreground sm:text-sm">
                RizShop
              </span>
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                Software & Assets
              </span>
            </div>
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
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector />

          <button
            type="button"
            onClick={openCart}
            aria-label={`View cart with ${totalCount} items`}
            className="relative inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-muted/20 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/60"
          >
            <ShoppingBag className="size-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Cart</span>
            {totalCount > 0 && (
              <span className="flex size-4.5 items-center justify-center rounded-full bg-foreground font-mono text-[10px] font-bold text-background">
                {totalCount}
              </span>
            )}
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex size-8 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>
      </Container>

      {mobileMenuOpen && (
        <div className="border-t border-border/60 bg-background/98 px-5 py-4 backdrop-blur-xl md:hidden">
          <nav
            className="flex flex-col gap-1.5"
            aria-label="Mobile store navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
