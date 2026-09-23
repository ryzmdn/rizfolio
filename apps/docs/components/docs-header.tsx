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
      className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-3">
          <Link
            href="/"
            className="flex items-center gap-x-2.5 text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-85"
          >
            <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-muted/60 font-mono text-xs font-semibold text-foreground">
              R
            </div>
            <div className="flex items-center gap-x-1.5">
              <span className="font-semibold text-foreground">Rizky Ramadhan</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-mono text-xs text-muted-foreground">
                Docs & Code
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-x-1 md:flex">
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

        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search repositories and code"
            className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/70 hover:text-foreground"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="pointer-events-none hidden items-center gap-0.5 rounded border border-border/80 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <a
            href="https://github.com/ryzmdn"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "text-muted-foreground hover:text-foreground hidden sm:inline-flex"
            )}
          >
            <GitHub className="size-4" />
          </a>

          <ThemeToggle
            className={buttonVariants({
              variant: "secondary",
              size: "icon-sm",
            })}
          />

          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden gap-x-1.5 text-xs font-normal lg:inline-flex"
            )}
          >
            <ArrowLeft className="size-3" />
            <span>Portfolio</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "md:hidden"
            )}
          >
            {mobileOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-b border-border/60 bg-background/95 p-4 shadow-lg backdrop-blur-xl md:hidden">
          <nav className="flex flex-col space-y-1.5">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <span>{link.label}</span>
                  <span className="text-muted-foreground/60">&rarr;</span>
                </Link>
              )
            })}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                openSearch()
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <Search className="size-3.5" />
                <span>Search Repos & Code</span>
              </span>
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>

            <a
              href="https://github.com/ryzmdn"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20"
            >
              <span>Back to Main Portfolio</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          </nav>
        </div>
      )}
    </Header>
  )
}
