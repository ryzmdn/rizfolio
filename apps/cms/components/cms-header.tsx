"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  Search,
  ExternalLink,
  ChevronRight,
  Home,
} from "lucide-react"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { RevalidationButton } from "./revalidation-button"

interface CmsHeaderProps {
  onOpenMobileMenu?: () => void
  onOpenCommandPalette?: () => void
}

const portfolioUrl =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"

export function CmsHeader({
  onOpenMobileMenu,
  onOpenCommandPalette,
}: CmsHeaderProps) {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/85 px-4 backdrop-blur-md transition-colors sm:px-6 md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile menu"
          className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus:outline-hidden md:hidden"
        >
          <Menu className="size-4" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
            title="Overview Dashboard"
          >
            <Home className="size-3.5" />
            <span className="hidden sm:inline">cms</span>
          </Link>

          {pathSegments.length === 0 ? (
            <>
              <ChevronRight className="size-3 text-muted-foreground/50" />
              <span className="font-semibold text-foreground">overview</span>
            </>
          ) : (
            pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`

              return (
                <span key={segment} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3 text-muted-foreground/50" />
                  {isLast ? (
                    <span className="font-semibold text-foreground">
                      {segment}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="transition-colors hover:text-foreground"
                    >
                      {segment}
                    </Link>
                  )}
                </span>
              )
            })
          )}
        </nav>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="group inline-flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted/80 hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          title="Search CMS navigation & actions (Ctrl+K or Cmd+K)"
          aria-label="Open command palette"
        >
          <Search className="size-3.5 transition-colors group-hover:text-foreground" />
          <span className="hidden lg:inline">Search actions...</span>
          <kbd className="hidden rounded border border-border/80 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground group-hover:border-foreground/20 sm:inline-block">
            Ctrl K
          </kbd>
        </button>

        <div className="hidden sm:block">
          <RevalidationButton />
        </div>

        <a
          href={portfolioUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open live portfolio website in new tab"
          className="group inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted/80 hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
        >
          <span className="hidden sm:inline">Live Site</span>
          <ExternalLink className="size-3.5 opacity-70 transition-transform group-hover:translate-x-0.5" />
        </a>

        <ThemeToggle />
      </div>
    </header>
  )
}
