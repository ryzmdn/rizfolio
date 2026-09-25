"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GitBranch,
  Milestone,
  Rss,
  Search,
  Menu,
  X,
  ExternalLink,
} from "lucide-react"
import { GitHub } from "@workspace/ui/constants/icons"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { cn } from "@workspace/ui/lib/utils"

export function ChangelogHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function openSearch() {
    window.dispatchEvent(new CustomEvent("open-changelog-search"))
  }

  const navLinks = [
    {
      href: "/",
      label: "Timeline",
      active: pathname === "/" || pathname.startsWith("/release"),
      icon: GitBranch,
    },
    {
      href: "/roadmap",
      label: "Roadmap",
      active: pathname === "/roadmap",
      icon: Milestone,
    },
    {
      href: "/rss.xml",
      label: "RSS",
      active: false,
      external: true,
      icon: Rss,
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background shadow-xs transition-transform group-hover:scale-105">
              <GitBranch className="size-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                RizChangelog
              </span>
              <span className="inline-flex items-center rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                v1.3.0
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    link.active
                      ? "bg-foreground/10 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{link.label}</span>
                  {link.external && (
                    <ExternalLink className="size-2.5 opacity-60" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={openSearch}
            className="group inline-flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted/80 hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
            title="Search changelog, updates and roadmap (Ctrl+K or Cmd+K)"
            aria-label="Open search dialog"
          >
            <Search className="size-3.5 transition-colors group-hover:text-foreground" />
            <span className="hidden sm:inline">Search updates...</span>
            <kbd className="hidden rounded border border-border/80 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground group-hover:border-foreground/20 sm:inline-block">
              Ctrl K
            </kbd>
          </button>

          <a
            href="https://github.com/ryzmdn/rizfolio"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository Releases"
            className="hidden rounded-lg border border-border/80 bg-muted/40 p-2 text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted/80 hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 sm:inline-flex"
          >
            <GitHub size={15} />
          </a>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-2 text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted/80 hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 sm:hidden"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-border/80 bg-background/95 px-4 py-3 backdrop-blur-md sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    link.active
                      ? "bg-foreground/10 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.external && <ExternalLink className="size-3 opacity-60" />}
                </Link>
              )
            })}
            <a
              href="https://github.com/ryzmdn/rizfolio"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <div className="flex items-center gap-2.5">
                <GitHub size={16} />
                <span>GitHub Releases</span>
              </div>
              <ExternalLink className="size-3 opacity-60" />
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
