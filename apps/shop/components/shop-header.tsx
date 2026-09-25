"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Menu, X, Layers, Sparkles } from "lucide-react"
import { useCart } from "./cart-provider"
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
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
              <Layers className="size-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-tight text-foreground">
                RizShop
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Software & Assets
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 pl-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
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

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card px-2.5 py-1 text-[11px] font-mono font-medium text-muted-foreground">
            <Sparkles className="size-3 text-primary" />
            <span>IDR Store</span>
          </div>

          <button
            type="button"
            onClick={openCart}
            aria-label={`View cart with ${totalCount} items`}
            className="relative inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted/60 hover:border-primary/40 shadow-xs"
          >
            <ShoppingBag className="size-4 text-primary" />
            <span className="hidden sm:inline">Cart</span>
            {totalCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary font-mono text-[10px] font-bold text-primary-foreground">
                {totalCount}
              </span>
            )}
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
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
        <div className="border-t border-border bg-card/95 px-6 py-4 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
