"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  Loader2,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { logoutAdmin } from "@/lib/auth-actions"

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/transactions", label: "Transactions", icon: Activity },
  { href: "/portfolio", label: "Portfolio", icon: User },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/docs", label: "Docs", icon: BookOpen },
  { href: "/changelog", label: "Changelog", icon: History },
  { href: "/media", label: "Media Library", icon: Image },
  { href: "/settings", label: "Settings", icon: Settings },
]

interface CmsSidebarProps {
  userEmail?: string
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export function CmsSidebar({
  userEmail,
  mobileOpen = false,
  onCloseMobile,
}: CmsSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  function handleNavigation(href: string, isMobile: boolean) {
    if (isPending) return
    if (isMobile && onCloseMobile) {
      onCloseMobile()
    }
    if (pathname === href) return

    setPendingHref(href)
    startTransition(() => {
      router.push(href)
    })
  }

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b border-border/80 px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
            <ShieldCheck className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-tight text-foreground">
              Personal CMS
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>Rizfolio Admin</span>
            </div>
          </div>
        </div>

        {isMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex size-7 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Tutup menu navigasi"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          const isTargetPending =
            isPending && pendingHref === item.href && pathname !== item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              onClick={(e) => {
                e.preventDefault()
                handleNavigation(item.href, isMobile)
              }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isTargetPending && "opacity-75"
              )}
            >
              {isTargetPending ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
              ) : (
                <Icon className="size-4 shrink-0" />
              )}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-3 border-t border-border/80 p-3">
        {userEmail && (
          <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-semibold text-primary">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate font-mono text-[11px] font-medium text-foreground">
                {userEmail}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-mono">
                Owner Access
              </span>
            </div>
          </div>
        )}

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Keluar (Logout)</span>
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/80 bg-card md:flex">
        {sidebarContent(false)}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150"
            onClick={onCloseMobile}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/80 bg-card p-0 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  )
}
