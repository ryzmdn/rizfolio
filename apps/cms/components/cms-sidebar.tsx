"use client"

import { useEffect } from "react"
import Link from "next/link"
import NextImage from "next/image"
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
  Inbox,
  Link2,
  MessageSquare,
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
      { href: "/inbox", label: "Inbox & Inquiries", icon: Inbox },
    ],
  },
  {
    title: "Applications",
    items: [
      { href: "/portfolio", label: "Portfolio Manager", icon: User },
      { href: "/blog", label: "Blog Articles", icon: FileText },
      { href: "/comments", label: "Blog Comments", icon: MessageSquare },
      { href: "/shop", label: "Digital Shop", icon: ShoppingBag },
      { href: "/docs", label: "Docs & Repos", icon: BookOpen },
      { href: "/changelog", label: "Changelog Releases", icon: History },
      { href: "/linkbio", label: "Linkbio Manager", icon: Link2 },
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

function getInitials(name?: string, fallback = "RR"): string {
  if (!name || !name.trim()) return fallback
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return (parts[0]?.slice(0, 2) || fallback).toUpperCase()
  }
  const first = parts[0]?.[0] || ""
  const last = parts[parts.length - 1]?.[0] || ""
  return (first + last).toUpperCase() || fallback
}

interface CmsSidebarProps {
  userEmail?: string
  userName?: string
  userRole?: string
  userAvatar?: string
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function CmsSidebar({
  userEmail,
  userName,
  userRole,
  userAvatar,
  isMobile = false,
  isOpen = false,
  onClose,
}: CmsSidebarProps) {
  const pathname = usePathname()

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
    <div className="flex h-full flex-col justify-between bg-card/40 backdrop-blur-xl">
      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between border-b border-foreground/8 px-6">
          <Link
            href="/"
            onClick={() => isMobile && setTimeout(() => onClose?.(), 50)}
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-foreground text-background shadow-xs transition-transform group-hover:scale-105">
              <ShieldCheck className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-semibold tracking-tight text-foreground">
                [ CMS // EXECUTIVE ]
              </span>
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
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <nav
          className="flex-1 space-y-6 overflow-y-auto px-4 py-6"
          aria-label="CMS Main Navigation"
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1.5 font-mono text-[10px] font-medium tracking-widest text-muted-foreground/70 uppercase">
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
                      onClick={() =>
                        isMobile && setTimeout(() => onClose?.(), 50)
                      }
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3.5 py-2 font-mono text-xs font-medium transition-all focus:outline-hidden",
                        isActive
                          ? "bg-foreground text-background shadow-xs"
                          : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
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
                            "py-0.2 rounded-full px-2 font-mono text-[10px]",
                            isActive
                              ? "bg-background/20 text-background"
                              : "bg-foreground/5 text-muted-foreground"
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

      <div className="space-y-3 border-t border-foreground/8 p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-2.5">
          {userAvatar ? (
            <NextImage
              src={userAvatar}
              alt={userName || "Owner Avatar"}
              width={32}
              height={32}
              unoptimized
              className="size-8 shrink-0 rounded-xl border border-foreground/10 object-cover"
            />
          ) : (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-foreground font-mono text-[11px] font-medium text-background shadow-xs">
              {getInitials(userName || "Rizky Ramadhan")}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="truncate font-serif text-xs font-medium text-foreground">
                {userName || "Rizky Ramadhan"}
              </p>
              {userRole && (
                <span className="py-0.2 shrink-0 rounded-full border border-foreground/10 bg-foreground/[0.04] px-1.5 font-mono text-[9px] text-muted-foreground">
                  {userRole}
                </span>
              )}
            </div>
            <p className="truncate font-mono text-[10px] text-muted-foreground">
              {userEmail || "owner@rizkyramadhan.dev"}
            </p>
          </div>
        </div>

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="hover:text-destructive-foreground flex w-full items-center justify-center gap-2 rounded-full border border-foreground/10 bg-background/60 py-2 font-mono text-xs text-muted-foreground transition-all hover:border-destructive/30 hover:bg-destructive focus:outline-hidden"
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
          className="fixed inset-0 animate-in bg-background/80 backdrop-blur-md transition-opacity duration-200 fade-in"
          onClick={onClose}
        />
        <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] animate-in border-r border-foreground/8 shadow-2xl duration-200 slide-in-from-left">
          {content}
        </div>
      </div>
    )
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-foreground/8 bg-card/30 md:flex md:flex-col">
      {content}
    </aside>
  )
}
