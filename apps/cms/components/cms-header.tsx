"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, ExternalLink, ChevronRight, Home } from "lucide-react"
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-foreground/8 bg-background/80 px-5 backdrop-blur-xl transition-colors sm:px-8 md:px-10">
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile menu"
          className="inline-flex rounded-full border border-foreground/10 bg-foreground/[0.03] p-2 text-muted-foreground transition-all hover:bg-foreground hover:text-background md:hidden"
        >
          <Menu className="size-4" />
        </button>

        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
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
            <span className="flex items-center gap-2">
              <ChevronRight className="size-3 text-foreground/20" />
              <span className="font-semibold text-foreground">overview</span>
            </span>
          ) : (
            pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`

              return (
                <span key={segment} className="flex items-center gap-2">
                  <ChevronRight className="size-3 text-foreground/20" />
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

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="group inline-flex items-center gap-2.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background focus:outline-hidden"
          title="Search CMS navigation & actions (Ctrl+K or Cmd+K)"
          aria-label="Open command palette"
        >
          <Search className="size-3.5 transition-colors" />
          <span className="hidden lg:inline">Search actions...</span>
          <kbd className="py-0.2 hidden rounded-full border border-foreground/10 bg-foreground/[0.04] px-2 font-mono text-[10px] text-muted-foreground group-hover:text-background sm:inline-block">
            ⌘K
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
          className="group inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
        >
          <span className="hidden sm:inline">Live Site</span>
          <ExternalLink className="size-3.5 opacity-70 transition-transform group-hover:translate-x-0.5" />
        </a>

        <ThemeToggle />
      </div>
    </header>
  )
}
