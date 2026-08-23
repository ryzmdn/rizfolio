"use client"

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
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { logoutAdmin } from "../lib/auth-actions"

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

export function CmsSidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/80 bg-card md:flex">
      <div className="flex h-14 items-center gap-2.5 border-b border-border/80 px-5">
        <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
          <ShieldCheck className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-tight text-foreground">
            Personal CMS
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            Rizfolio Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 border-t border-border/80 p-3">
        {userEmail && (
          <div className="truncate px-3 py-1 font-mono text-[11px] text-muted-foreground">
            {userEmail}
          </div>
        )}

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            <span>Keluar (Logout)</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
