import Link from "next/link"
import { ArrowLeft, LayoutDashboard, ShieldAlert } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/80 bg-card/60 p-8 shadow-xl backdrop-blur-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/60 text-muted-foreground">
          <ShieldAlert className="size-6 text-foreground" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Error : 404 Not Found
          </span>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            Modul Tidak Ditemukan
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Halaman atau entitas administrasi yang Anda tuju tidak terdaftar atau telah dipindahkan dalam ekosistem CMS.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90"
          >
            <LayoutDashboard className="size-3.5" />
            <span>Kembali ke Overview</span>
          </Link>

          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" />
            <span>Audit Ledger</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
