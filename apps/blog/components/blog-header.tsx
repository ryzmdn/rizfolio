"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Rss, ArrowLeft, ArrowUpRight } from "lucide-react"
import { Header } from "@workspace/ui/components/layouts"
import { buttonVariants } from "@workspace/ui/components/button"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { cn } from "@workspace/ui/lib/utils"

const navTopics = [
  { href: "/", label: "All Articles" },
  { href: "/?category=architecture", label: "Architecture" },
  { href: "/?category=frontend", label: "Frontend" },
  { href: "/?category=performance", label: "Performance" },
]

export function BlogHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"

  return (
    <Header
      id="blog-header"
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Identity */}
        <div className="flex items-center gap-x-3">
          <Link
            href="/"
            className="flex items-center gap-x-2 text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            <span className="font-semibold text-primary">Rizky Ramadhan</span>
            <span className="text-muted-foreground/60">/</span>
            <span className="text-xs text-muted-foreground">Engineering Blog</span>
          </Link>
        </div>

        {/* Desktop Nav Topics */}
        <nav className="hidden items-center gap-x-1 md:flex">
          {navTopics.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <a
            href="/rss.xml"
            target="_blank"
            rel="noreferrer"
            aria-label="RSS Feed"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "text-muted-foreground hover:text-foreground"
            )}
          >
            <Rss className="size-4" />
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
              "hidden gap-x-1.5 text-xs font-normal sm:inline-flex"
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

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-border/60 bg-background/95 p-5 shadow-lg backdrop-blur-xl md:hidden">
          <nav className="flex flex-col space-y-2">
            {navTopics.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-muted-foreground/60">&rarr;</span>
              </Link>
            ))}
            <a
              href="/rss.xml"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span className="flex items-center gap-1.5">
                <Rss className="size-3.5 text-amber-500" />
                <span>RSS Syndication Feed</span>
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
