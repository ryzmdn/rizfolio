"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  History,
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
      active: pathname === "/",
      icon: History,
    },
    {
      href: "/roadmap",
      label: "Roadmap",
      active: pathname === "/roadmap",
      icon: Milestone,
    },
    {
      href: "/rss.xml",
      label: "RSS Feed",
      active: false,
      external: true,
      icon: Rss,
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <History className="size-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-foreground">
                RizChangelog
              </span>
              <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                v1.3.0
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    link.active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{link.label}</span>
                  {link.external && (
                    <ExternalLink className="size-2.5 text-muted-foreground/70" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-card hover:text-foreground"
            title="Search changelog and roadmap (Cmd+K)"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search updates...</span>
            <kbd className="hidden rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
              Ctrl+K
            </kbd>
          </button>

          <a
            href="https://github.com/ryzmdn/rizfolio"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository Releases"
            className="hidden rounded-xl border border-border/80 bg-card/60 p-2 text-muted-foreground transition-colors hover:bg-card hover:text-foreground sm:inline-flex"
          >
            <GitHub size={16} />
          </a>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="inline-flex rounded-xl border border-border/80 bg-card/60 p-2 text-muted-foreground transition-colors hover:bg-card hover:text-foreground md:hidden"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-border/80 bg-background/95 px-4 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-2">
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
                    "flex items-center justify-between rounded-xl p-2.5 text-xs font-medium transition-colors",
                    link.active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.external && <ExternalLink className="size-3" />}
                </Link>
              )
            })}
            <a
              href="https://github.com/ryzmdn/rizfolio"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl p-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <div className="flex items-center gap-2">
                <GitHub size={16} />
                <span>GitHub Releases</span>
              </div>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
