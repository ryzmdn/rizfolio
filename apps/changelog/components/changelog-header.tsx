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
    <header className="sticky top-0 z-40 w-full border-b border-foreground/8 bg-background/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-foreground text-background shadow-xs transition-transform group-hover:scale-105">
              <GitBranch className="size-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-tight text-foreground">
                [ CHANGELOG // 07 ]
              </span>
              <span className="py-0.2 inline-flex items-center rounded-full border border-foreground/10 bg-foreground/[0.04] px-2 font-mono text-[10px] text-muted-foreground">
                v1.3.0
              </span>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-1.5 sm:flex"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-mono text-xs transition-all",
                    link.active
                      ? "bg-foreground font-medium text-background shadow-xs"
                      : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
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
            className="group inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background focus:outline-hidden"
            title="Search changelog, updates and roadmap (Ctrl+K or Cmd+K)"
            aria-label="Open search dialog"
          >
            <Search className="size-3.5 transition-colors" />
            <span className="hidden sm:inline">Search updates...</span>
            <kbd className="py-0.2 hidden rounded-full border border-foreground/10 bg-foreground/[0.04] px-2 font-mono text-[10px] text-muted-foreground group-hover:text-background sm:inline-block">
              ⌘K
            </kbd>
          </button>

          <a
            href="https://github.com/ryzmdn/rizfolio"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository Releases"
            className="hidden size-9 items-center justify-center rounded-full border border-foreground/10 bg-foreground/[0.03] text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background sm:inline-flex"
          >
            <GitHub size={14} />
          </a>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="inline-flex rounded-full border border-foreground/10 bg-foreground/[0.03] p-2 text-muted-foreground transition-all hover:bg-foreground hover:text-background sm:hidden"
          >
            {mobileMenuOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="animate-in border-b border-foreground/8 bg-background/95 px-5 py-4 backdrop-blur-xl duration-200 fade-in slide-in-from-top-2 sm:hidden">
          <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  onClick={() => setTimeout(() => setMobileMenuOpen(false), 50)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2 font-mono text-xs transition-colors",
                    link.active
                      ? "bg-foreground font-medium text-background"
                      : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-3.5" />
                    <span>{link.label}</span>
                  </div>
                  {link.external && (
                    <ExternalLink className="size-3 opacity-60" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
