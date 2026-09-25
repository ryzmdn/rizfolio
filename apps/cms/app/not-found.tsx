import Link from "next/link"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/80 bg-card p-8 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted/60 text-muted-foreground">
          <FileQuestion className="h-7 w-7 text-primary" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Kesalahan 404
          </span>
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Halaman atau entitas administrasi yang Anda tuju tidak terdaftar atau telah dipindahkan.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Kembali ke Overview</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
