"use client"

import { useActionState, useEffect } from "react"
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react"
import { loginAdmin } from "../../lib/auth-actions"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null)

  useEffect(() => {
    if (state?.success) {
      window.location.href = "/"
    }
  }, [state?.success])

  const isSuccess = Boolean(state?.success)

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-3 text-center">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/[0.04] text-foreground shadow-xs">
            <ShieldCheck className="size-7" />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3.5 py-0.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase backdrop-blur-md">
              <span>[ RESTRICTED // OWNER ONLY ]</span>
            </div>
            <h1 className="font-serif text-3xl font-light tracking-tight text-foreground">
              Mission Control
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              Restricted Area: Owner Credentials Required
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-foreground/10 bg-card/60 p-8 shadow-2xl backdrop-blur-xl sm:p-9">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
              <CheckCircle2 className="size-10 animate-pulse text-emerald-500" />
              <div className="space-y-1">
                <p className="font-serif text-base font-medium text-foreground">
                  Autentikasi Berhasil
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  Mengarahkan ke Dashboard Overview...
                </p>
              </div>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 font-mono text-xs text-destructive">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                  <span className="leading-relaxed">{state.error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="font-mono text-xs text-foreground"
                >
                  Email Kredensial
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="owner@example.com"
                    className="w-full rounded-full border border-foreground/10 bg-background/60 py-2.5 pr-4 pl-10 font-mono text-xs text-foreground transition-all placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="font-mono text-xs text-foreground"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    className="w-full rounded-full border border-foreground/10 bg-background/60 py-2.5 pr-4 pl-10 font-mono text-xs text-foreground transition-all placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-foreground bg-foreground py-3 font-mono text-xs font-medium text-background shadow-xs transition-all hover:bg-foreground/90 focus:outline-hidden disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Memverifikasi Sesi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-1 text-center font-mono text-[11px] text-muted-foreground/70">
          <p>Rizfolio Defense-in-Depth Security Protocol</p>
          <p>Rate limiting and session audit trail active.</p>
        </div>
      </div>
    </div>
  )
}
