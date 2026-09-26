"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  User,
  FileText,
  ShoppingBag,
  BookOpen,
  History,
  Image,
  Settings,
  LogOut,
  Activity,
  ShieldCheck,
  X,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { logoutAdmin } from "@/lib/auth-actions"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Core",
    items: [
      { href: "/", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/transactions", label: "Master Transactions", icon: Activity },
    ],
  },
  {
    title: "Applications",
    items: [
      { href: "/portfolio", label: "Portfolio Manager", icon: User },
      { href: "/blog", label: "Blog Articles", icon: FileText },
      { href: "/shop", label: "Digital Shop", icon: ShoppingBag },
      { href: "/docs", label: "Docs & Repos", icon: BookOpen },
      { href: "/changelog", label: "Changelog Releases", icon: History },
    ],
  },
  {
    title: "System & Assets",
    items: [
      { href: "/media", label: "Media Library", icon: Image },
      { href: "/settings", label: "Settings & Health", icon: Settings },
    ],
  },
]

interface CmsSidebarProps {
  userEmail?: string
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function CmsSidebar({
  userEmail,
  isMobile = false,
  isOpen = false,
  onClose,
}: CmsSidebarProps) {
  const pathname = usePathname()

  // Handle escape key for mobile drawer
  useEffect(() => {
    if (!isMobile || !isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isMobile, isOpen, onClose])

  const content = (
    <div className="flex h-full flex-col justify-between bg-card">
      <div className="flex flex-col">
        {/* Workspace Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/80 px-5">
          <Link
            href="/"
            onClick={() => isMobile && onClose?.()}
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background shadow-xs transition-transform group-hover:scale-105">
              <ShieldCheck className="size-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-tight text-foreground">
                  Rizfolio CMS
                </span>
                <span className="size-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                Mission Control
              </span>
            </div>
          </Link>

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation drawer"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Grouped Navigation */}
        <nav
          className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
          aria-label="CMS Main Navigation"
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-muted-foreground/70 uppercase">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href)
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => isMobile && onClose?.()}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-primary/20",
                        isActive
                          ? "bg-foreground text-background font-semibold shadow-xs"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "size-4 shrink-0 transition-colors",
                            isActive
                              ? "text-background"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 font-mono text-[10px]",
                            isActive
                              ? "bg-background/20 text-background"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile & Logout Area */}
      <div className="border-t border-border/80 p-3 space-y-2">
        <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 p-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground text-[11px] font-bold text-background">
            RR
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">
              Rizky Ramadhan
            </p>
            <p className="truncate font-mono text-[10px] text-muted-foreground">
              {userEmail || "owner@rizkyramadhan.dev"}
            </p>
          </div>
        </div>

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/70 bg-card py-2 text-xs font-medium text-destructive transition-all hover:bg-destructive/10 hover:border-destructive/30 focus:outline-hidden focus:ring-2 focus:ring-destructive/20"
          >
            <LogOut className="size-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </form>
      </div>
    </div>
  )

  if (isMobile) {
    if (!isOpen) return null

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className="fixed inset-0 z-50 md:hidden"
      >
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
        />
        <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-border/80 shadow-2xl animate-in slide-in-from-left duration-200">
          {content}
        </div>
      </div>
    )
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border/80 bg-card md:flex md:flex-col">
      {content}
    </aside>
  )
}
