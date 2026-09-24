"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  Search,
  ExternalLink,
  ChevronDown,
  Globe,
  FileText,
  BookOpen,
  ShoppingBag,
  History,
  LayoutTemplate,
} from "lucide-react"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"

interface CmsHeaderProps {
  onOpenMobile?: () => void
  onOpenCommand?: () => void
}

const ECOSYSTEM_APPS = [
  {
    name: "Portfolio Site",
    port: "3000",
    url: process.env.NEXT_PUBLIC_PORTFOLIO_URL || "http://localhost:3000",
    icon: LayoutTemplate,
  },
  {
    name: "Blog Platform",
    port: "3001",
    url: process.env.NEXT_PUBLIC_BLOG_URL || "http://localhost:3001",
    icon: FileText,
  },
  {
    name: "Documentation",
    port: "3002",
    url: process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:3002",
    icon: BookOpen,
  },
  {
    name: "Shop & Store",
    port: "3003",
    url: process.env.NEXT_PUBLIC_SHOP_URL || "http://localhost:3003",
    icon: ShoppingBag,
  },
  {
    name: "Changelog",
    port: "3005",
    url: process.env.NEXT_PUBLIC_CHANGELOG_URL || "http://localhost:3005",
    icon: History,
  },
]

export function CmsHeader({ onOpenMobile, onOpenCommand }: CmsHeaderProps) {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="flex size-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Buka navigasi mobile"
        >
          <Menu className="size-4" />
        </button>

        <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Link
            href="/"
            className="rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground"
          >
            cms
          </Link>
          {pathSegments.map((segment, index) => (
            <span key={segment} className="flex items-center gap-1.5">
              <span>/</span>
              <span
                className={
                  index === pathSegments.length - 1
                    ? "rounded bg-muted/60 px-1.5 py-0.5 font-semibold text-foreground"
                    : "text-muted-foreground"
                }
              >
                {segment}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenCommand}
          className="hidden items-center gap-2 rounded-lg border border-border/80 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted/60 hover:text-foreground sm:inline-flex"
        >
          <Search className="size-3.5" />
          <span>Cari aksi atau menu...</span>
          <kbd className="rounded border border-border/80 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground shadow-2xs">
            Cmd K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onOpenCommand}
          className="flex size-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
          aria-label="Cari perintah"
        >
          <Search className="size-3.5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "gap-1.5 text-xs text-muted-foreground hover:text-foreground",
            })}
          >
            <Globe className="size-3.5" />
            <span className="hidden sm:inline">Live Apps</span>
            <ChevronDown className="size-3 opacity-60" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[11px] font-semibold text-foreground">
                Aplikasi Monorepo
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {ECOSYSTEM_APPS.map((app) => {
                const Icon = app.icon
                return (
                  <DropdownMenuItem
                    key={app.name}
                    onClick={() =>
                      window.open(app.url, "_blank", "noopener,noreferrer")
                    }
                    className="flex w-full cursor-pointer items-center justify-between p-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-3.5 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {app.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          port :{app.port}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="size-3 text-muted-foreground" />
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        />
      </div>
    </header>
  )
}
