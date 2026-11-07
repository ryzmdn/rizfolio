"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Rss, ArrowUpRight, Search } from "lucide-react"
import { Header } from "@workspace/ui/components/layouts"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { cn } from "@workspace/ui/lib/utils"
import { SearchModal } from "./search-modal"

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
  const [searchOpen, setSearchOpen] = useState(false)
  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      } else if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(
          (document.activeElement?.tagName || "").toUpperCase()
        )
      ) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return

      rafId = window.requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 20
        setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev))
        rafId = null
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <Header
      id="blog-header"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-foreground/8 bg-background/85 shadow-xs backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="The Monograph by Rizky Ramadhan"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-light tracking-tight text-foreground transition-opacity group-hover:opacity-75 sm:text-lg">
                The Monograph
              </span>
              <span className="rounded-full border border-foreground/10 bg-foreground/5 px-2 py-0.5 font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                PUB.04
              </span>
            </div>
            <span className="hidden font-mono text-[9px] tracking-widest text-muted-foreground/70 uppercase sm:inline">
              Systems Architecture & Craft
            </span>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main publication navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-all duration-200 hover:bg-foreground/5 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search articles (Cmd+K or /)"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/3 px-3 py-1.5 font-mono text-xs text-muted-foreground uppercase transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
          >
            <Search className="size-3.5 text-foreground/50" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="py-0.2 hidden rounded-full border border-foreground/10 bg-background/90 px-1.5 font-mono text-[9px] text-foreground/70 sm:inline-block">
              ⌘K
            </kbd>
          </button>

          <a
            href="/rss.xml"
            target="_blank"
            rel="noreferrer"
            aria-label="RSS Feed"
            className="hidden size-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground sm:flex"
          >
            <Rss className="size-3.5" />
          </a>

          <ThemeToggle className="size-8 rounded-full border border-foreground/10 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground" />

          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 font-mono text-xs tracking-wider text-foreground uppercase transition-all duration-200 hover:border-foreground/30 hover:bg-foreground hover:text-background sm:inline-flex"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="size-3" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            className="flex size-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            {mobileOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {mobileOpen && (
        <div className="border-t border-foreground/8 bg-background/95 px-6 py-5 backdrop-blur-2xl md:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col gap-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setTimeout(() => setMobileOpen(false), 50)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="size-3 text-muted-foreground/50" />
              </Link>
            ))}
            <div className="flex items-center justify-between border-t border-foreground/8 pt-4 font-mono text-xs">
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground hover:underline"
              >
                <span>Return to Portfolio</span>
                <ArrowUpRight className="size-3" />
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
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
