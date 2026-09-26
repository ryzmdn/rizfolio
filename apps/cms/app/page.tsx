import Link from "next/link"
import {
  FileText,
  ShoppingBag,
  BookOpen,
  History,
  User,
  Image,
  ArrowUpRight,
  Database,
  ShieldCheck,
  Activity,
  ArrowRight,
  Server,
  Zap,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { CmsPageShell } from "@/components/cms-page-shell"
import { RevalidationButton } from "@/components/revalidation-button"
import { getCachedCmsDashboardSummary } from "@/lib/actions/overview-actions"

export const dynamic = "force-dynamic"

export default async function OverviewDashboard() {
  const { stats: s, recentTransactions } = await getCachedCmsDashboardSummary()

  const stats = [
    {
      title: "Master Transactions",
      value: s.trxTotal,
      detail: `${s.trxSuccessRate}% success rate`,
      href: "/transactions",
      icon: Activity,
      accent: "text-foreground",
    },
    {
      title: "Blog Articles",
      value: s.postsTotal,
      detail: `${s.postsPublished} published articles`,
      href: "/blog",
      icon: FileText,
      accent: "text-blue-500",
    },
    {
      title: "Digital Products",
      value: s.productsTotal,
      detail: `${s.productsActive} active in store`,
      href: "/shop",
      icon: ShoppingBag,
      accent: "text-emerald-500",
    },
    {
      title: "Orders Received",
      value: s.ordersTotal,
      detail: `${s.ordersPaid} settled orders`,
      href: "/shop",
      icon: Zap,
      accent: "text-amber-500",
    },
    {
      title: "Docs & Repos",
      value: s.reposTotal,
      detail: `${s.reposPublic} public repositories`,
      href: "/docs",
      icon: BookOpen,
      accent: "text-purple-500",
    },
    {
      title: "Changelog Releases",
      value: s.changelogsTotal,
      detail: `${s.changelogsPublished} published releases`,
      href: "/changelog",
      icon: History,
      accent: "text-rose-500",
    },
  ]

  const quickLinks = [
    {
      title: "Audit Ledger Transaksi",
      description: "Pantau catatan transaksi dan event log sistem",
      href: "/transactions",
      icon: Activity,
    },
    {
      title: "Profil & Portofolio",
      description: "Sunting pengalaman, bio, dan studi kasus",
      href: "/portfolio",
      icon: User,
    },
    {
      title: "Tulis Artikel Baru",
      description: "Buat postingan blog teknis dan tag kategori",
      href: "/blog",
      icon: FileText,
    },
    {
      title: "Katalog Toko Digital",
      description: "Atur produk digital, kupon, dan unduhan lisensi",
      href: "/shop",
      icon: ShoppingBag,
    },
    {
      title: "Repositori & Docs",
      description: "Kelola rilis open-source dan struktur dokumen",
      href: "/docs",
      icon: BookOpen,
    },
    {
      title: "Media Storage CDN",
      description: "Akses bucket Supabase dan kelola aset visual",
      href: "/media",
      icon: Image,
    },
  ]

  return (
    <CmsPageShell
      title="System Overview"
      description="Pusat pemantauan status konten, transaksi terpadu, dan operasional ekosistem monorepo."
      actions={<RevalidationButton />}
    >
      <div className="space-y-10">
        {/* Metric Cards Grid */}
        <section aria-label="Ecosystem Metrics">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs backdrop-blur-xs transition-all hover:border-foreground/30 hover:bg-card hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {item.title}
                    </span>
                    <div className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-muted/40 transition-colors group-hover:bg-muted">
                      <Icon className={`size-3.5 ${item.accent}`} />
                    </div>
                  </div>

                  <div className="mt-6 space-y-1">
                    <div className="font-mono text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                      {item.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.detail}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Quick Links & Infrastructure Status */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Quick Actions */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs backdrop-blur-xs lg:col-span-7">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-sm font-bold tracking-tight text-foreground uppercase text-muted-foreground/80">
                Aksi Cepat & Navigasi Modul
              </h2>
              <span className="font-mono text-[11px] text-muted-foreground">
                6 pintasan aktif
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-3.5 transition-all hover:border-foreground/30 hover:bg-muted/60"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground shadow-xs">
                        <Icon className="size-3.5" />
                      </div>
                      <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                    </div>

                    <div className="mt-3 space-y-0.5">
                      <div className="text-xs font-bold text-foreground">
                        {link.title}
                      </div>
                      <div className="line-clamp-1 text-[11px] text-muted-foreground">
                        {link.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs backdrop-blur-xs lg:col-span-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Server className="size-4 text-foreground" />
                <h2 className="text-sm font-bold tracking-tight text-foreground uppercase text-muted-foreground/80">
                  Status Infrastruktur
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Semua Operasional
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3.5">
                <div className="flex items-center gap-2.5">
                  <Database className="size-4 text-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      PostgreSQL & Drizzle ORM
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Supabase Transaction Pooler
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3.5">
                <div className="flex items-center gap-2.5">
                  <Activity className="size-4 text-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Transactions Audit Ledger
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Continuous Event Logging
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  Tracking
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3.5">
                <div className="flex items-center gap-2.5">
                  <Image className="size-4 text-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Storage CDN (3 Buckets)
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      avatars &bull; projects &bull; assets
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  Ready
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3.5">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Owner Session Security
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      HttpOnly Cookie & Defense Guard
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Master Transactions & Audit Feed */}
        <section className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs backdrop-blur-xs">
          <div className="flex flex-col gap-2 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Recent Master Transactions
              </h2>
              <p className="text-xs text-muted-foreground">
                Audit trail aktivitas dan mutasi data sistem terbaru di seluruh ekosistem.
              </p>
            </div>
            <Link
              href="/transactions"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-primary"
            >
              <span>Buka Audit Ledger Lengkap</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/50">
            {recentTransactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Belum ada transaksi tercatat pada master ledger.
              </div>
            ) : (
              recentTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="group flex flex-col gap-3 py-3.5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:px-2 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                      {trx.trxNumber}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {trx.actionType}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {trx.domain} &bull; {trx.entityType}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                    {trx.amount && trx.amount > 0 ? (
                      <span className="font-mono text-xs font-bold text-foreground">
                        Rp {trx.amount.toLocaleString("id-ID")}
                      </span>
                    ) : null}

                    <Badge
                      variant="outline"
                      className="rounded-md border-border/70 px-2 py-0.5 font-mono text-[10px] font-semibold"
                    >
                      {trx.status}
                    </Badge>

                    <span className="font-mono text-[11px] text-muted-foreground">
                      {new Date(trx.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </CmsPageShell>
  )
}
