import Link from "next/link"
import {
  ShieldAlert,
  LayoutDashboard,
  Activity,
  User,
  FileText,
  ShoppingBag,
  BookOpen,
  History,
  Image,
  Settings,
  Inbox,
  Link2,
  MessageSquare,
  ArrowRight,
} from "lucide-react"

const MODULE_DIRECTORIES = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: Activity },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/portfolio", label: "Portfolio", icon: User },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/comments", label: "Comments", icon: MessageSquare },
  { href: "/shop", label: "Digital Shop", icon: ShoppingBag },
  { href: "/docs", label: "Docs & Repos", icon: BookOpen },
  { href: "/changelog", label: "Changelog", icon: History },
  { href: "/linkbio", label: "Linkbio", icon: Link2 },
  { href: "/media", label: "Media Library", icon: Image },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-xl space-y-8 rounded-3xl border border-foreground/10 bg-card/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/[0.04] text-foreground">
          <ShieldAlert className="size-7" />
        </div>

        <div className="space-y-2.5">
          <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Error : 404 Not Found
          </span>
          <h1 className="font-serif text-2xl font-light tracking-tight text-foreground sm:text-3xl">
            Modul Tidak Ditemukan
          </h1>
          <p className="font-mono text-xs leading-relaxed text-muted-foreground">
            Halaman atau entitas administrasi yang Anda tuju tidak terdaftar
            atau telah dipindahkan dalam ekosistem CMS. Silakan pilih modul resmi
            di bawah:
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {MODULE_DIRECTORIES.map((mod) => {
            const Icon = mod.icon
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-3 text-center transition-all hover:border-foreground/25 hover:bg-foreground/[0.05]"
              >
                <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-background/60 text-muted-foreground transition-colors group-hover:text-foreground">
                  <Icon className="size-4" />
                </div>
                <span className="font-mono text-[11px] font-medium text-foreground">
                  {mod.label}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-mono text-xs font-medium text-background shadow-xs transition-opacity hover:opacity-90"
          >
            <LayoutDashboard className="size-3.5" />
            <span>Kembali ke Overview Utama</span>
          </Link>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/60 px-5 py-2.5 font-mono text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.04]"
          >
            <span>Buka Audit Ledger</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
