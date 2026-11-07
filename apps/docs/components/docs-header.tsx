"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Header } from "@workspace/ui/components/layouts"
import { buttonVariants } from "@workspace/ui/components/button"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { Search, Menu, X, ArrowLeft, ArrowUpRight } from "lucide-react"
import { GitHub } from "@workspace/ui/constants/icons"
import { cn } from "@workspace/ui/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Repositories" },
  { href: "/categories", label: "Curriculum & Topics" },
]

export function DocsHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"

  function openSearch() {
    window.dispatchEvent(new CustomEvent("open-docs-search"))
  }

  return (
    <Header
      id="docs-header"
      className="sticky top-0 z-40 w-full border-b border-foreground/8 bg-background/85 backdrop-blur-2xl shadow-xs"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Rizky Ramadhan Docs & Code Archives"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-base font-light tracking-tight text-foreground transition-opacity group-hover:opacity-75 sm:text-lg">
                  Blueprint Archive
                </span>
                <span className="rounded-full border border-foreground/10 bg-foreground/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  DOCS.05
                </span>
              </div>
              <span className="hidden font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 sm:inline">
                Open Source & Code Archives
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200",
                  isActive
                    ? "bg-foreground font-semibold text-background shadow-xs"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search repositories and code"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/3 px-3.5 py-1.5 font-mono text-xs uppercase text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
          >
            <Search className="size-3.5 text-foreground/50" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded-full border border-foreground/10 bg-background/90 px-1.5 py-0.2 font-mono text-[9px] text-foreground/70 md:inline-flex">
              ⌘K
            </kbd>
          </button>

          <a
            href="https://github.com/ryzmdn"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            className="hidden size-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground sm:flex"
          >
            <GitHub className="size-3.5" />
          </a>

          <ThemeToggle
            className="size-8 rounded-full border border-foreground/10 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
          />

          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground hover:text-background lg:inline-flex"
          >
            <ArrowLeft className="size-3" />
            <span>Portfolio</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
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

      {mobileOpen && (
        <div className="border-b border-foreground/8 bg-background/95 p-5 shadow-2xl backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setTimeout(() => setMobileOpen(false), 50)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors",
                    isActive
                      ? "bg-foreground font-semibold text-background"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  )}
                >
                  <span>{link.label}</span>
                  <span className="text-muted-foreground/50">&rarr;</span>
                </Link>
              )
            })}

            <button
              type="button"
              onClick={() => {
                setTimeout(() => setMobileOpen(false), 50)
                openSearch()
              }}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <Search className="size-3.5" />
                <span>Search Archives</span>
              </span>
              <kbd className="rounded-full border border-foreground/10 bg-background px-2 py-0.5 text-[9px]">
                ⌘K
              </kbd>
            </button>

            <a
              href="https://github.com/ryzmdn"
              target="_blank"
              rel="noreferrer"
              onClick={() => setTimeout(() => setMobileOpen(false), 50)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <GitHub className="size-3.5" />
                <span>GitHub Repositories</span>
              </span>
              <ArrowUpRight className="size-3.5" />
            </a>

            <a
              href={portfolioUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setTimeout(() => setMobileOpen(false), 50)}
              className="flex items-center justify-between rounded-xl border border-foreground/10 bg-foreground/5 px-3.5 py-2.5 text-foreground hover:bg-foreground hover:text-background"
            >
              <span>Return to Portfolio</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          </nav>
        </div>
      )}
    </Header>
  )
}
