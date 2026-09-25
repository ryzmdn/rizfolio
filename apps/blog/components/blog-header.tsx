"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Rss, ArrowUpRight } from "lucide-react"
import { Header } from "@workspace/ui/components/layouts"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { cn } from "@workspace/ui/lib/utils"

const navItems = [
  { href: "/", label: "All" },
  { href: "/?category=architecture", label: "Architecture" },
  { href: "/?category=frontend", label: "Frontend" },
  { href: "/?category=performance", label: "Performance" },
  { href: "/?category=database", label: "Database" },
]

export function BlogHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <Header
      id="blog-header"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-zinc-200/80 bg-background/95 backdrop-blur-xl dark:border-zinc-800/80"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          href="/"
          className="group flex items-baseline gap-x-2"
          aria-label="Rizky Ramadhan Engineering Blog"
        >
          <span className="font-semibold tracking-tight text-foreground transition-opacity group-hover:opacity-75">
            Rizky Ramadhan
          </span>
          <span className="hidden text-[11px] font-medium uppercase tracking-widest text-muted-foreground sm:inline">
            Engineering
          </span>
        </Link>

        <nav className="hidden items-center gap-x-0.5 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-x-1.5">
          <a
            href="/rss.xml"
            target="_blank"
            rel="noreferrer"
            aria-label="RSS Feed"
            className="hidden rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground sm:flex"
          >
            <Rss className="size-3.5" />
          </a>

          <ThemeToggle className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground" />

          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-x-1 rounded-md border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-muted sm:inline-flex"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="size-3" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground md:hidden"
          >
            {mobileOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/98 backdrop-blur-xl md:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-7xl divide-y divide-border/30 px-5"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between py-3 text-sm font-medium text-foreground"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </Link>
            ))}
            <div className="flex items-center gap-x-4 py-4">
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-primary"
              >
                Portfolio
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-x-1 text-sm text-muted-foreground"
              >
                <Rss className="size-3.5" />
                <span>RSS</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </Header>
  )
}
