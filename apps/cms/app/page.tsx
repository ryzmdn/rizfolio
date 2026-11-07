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
import { CmsPageShell } from "@/components/cms-page-shell"
import { RevalidationButton } from "@/components/revalidation-button"
import { getCachedCmsDashboardSummary } from "@/lib/actions/overview-actions"
import { CountUp } from "@workspace/ui/components/animations"

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
    },
    {
      title: "Blog Articles",
      value: s.postsTotal,
      detail: `${s.postsPublished} published articles`,
      href: "/blog",
      icon: FileText,
    },
    {
      title: "Digital Products",
      value: s.productsTotal,
      detail: `${s.productsActive} active in store`,
      href: "/shop",
      icon: ShoppingBag,
    },
    {
      title: "Orders Received",
      value: s.ordersTotal,
      detail: `${s.ordersPaid} settled orders`,
      href: "/shop",
      icon: Zap,
    },
    {
      title: "Docs & Repos",
      value: s.reposTotal,
      detail: `${s.reposPublic} public repositories`,
      href: "/docs",
      icon: BookOpen,
    },
    {
      title: "Changelog Releases",
      value: s.changelogsTotal,
      detail: `${s.changelogsPublished} published releases`,
      href: "/changelog",
      icon: History,
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
      <div className="space-y-12">
        <section aria-label="Ecosystem Metrics">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col justify-between rounded-3xl border border-foreground/8 bg-card/40 p-6 sm:p-7 backdrop-blur-xl transition-hover-lift hover:border-foreground/30 hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      {item.title}
                    </span>
                    <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03] text-muted-foreground transition-colors-luxury group-hover:text-foreground">
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <div className="mt-8 space-y-2">
                    <div className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-foreground tabular-nums">
                      <CountUp value={item.value} />
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {item.detail}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 rounded-3xl border border-foreground/8 bg-card/40 p-6 sm:p-7 backdrop-blur-xl lg:col-span-7">
            <div className="flex items-center justify-between border-b border-foreground/8 pb-4">
              <h2 className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Aksi Cepat & Navigasi Modul
              </h2>
              <span className="font-mono text-[11px] text-muted-foreground">
                6 pintasan aktif
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex flex-col justify-between rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-4 transition-all hover:border-foreground/25 hover:bg-foreground/[0.04]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-background/60 text-foreground shadow-xs">
                        <Icon className="size-4" />
                      </div>
                      <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                    </div>

                    <div className="mt-4 space-y-1">
                      <div className="font-serif text-sm font-normal text-foreground group-hover:underline">
                        {link.title}
                      </div>
                      <div className="line-clamp-1 font-sans text-xs font-light text-muted-foreground">
                        {link.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-foreground/8 bg-card/40 p-6 sm:p-7 backdrop-blur-xl lg:col-span-5">
            <div className="flex items-center justify-between border-b border-foreground/8 pb-4">
              <div className="flex items-center gap-2">
                <Server className="size-4 text-foreground" />
                <h2 className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Status Infrastruktur
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-0.5 font-mono text-[10px] text-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Operational
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-foreground/8 bg-background/40 p-4">
                <div className="flex items-center gap-3">
                  <Database className="size-4 text-muted-foreground" />
                  <div>
                    <p className="font-serif text-xs font-medium text-foreground">
                      PostgreSQL & Drizzle ORM
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Supabase Transaction Pooler
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-foreground/8 bg-background/40 p-4">
                <div className="flex items-center gap-3">
                  <Activity className="size-4 text-muted-foreground" />
                  <div>
                    <p className="font-serif text-xs font-medium text-foreground">
                      Transactions Audit Ledger
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Continuous Event Logging
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Tracking
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-foreground/8 bg-background/40 p-4">
                <div className="flex items-center gap-3">
                  <Image className="size-4 text-muted-foreground" />
                  <div>
                    <p className="font-serif text-xs font-medium text-foreground">
                      Storage CDN (3 Buckets)
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      avatars &bull; projects &bull; assets
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Ready
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-foreground/8 bg-background/40 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  <div>
                    <p className="font-serif text-xs font-medium text-foreground">
                      Owner Session Security
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      HttpOnly Cookie & Guard
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Active
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-foreground/8 bg-card/40 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-foreground/8 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="font-serif text-xl sm:text-2xl font-light tracking-tight text-foreground">
                Recent Master Transactions
              </h2>
              <p className="font-sans text-xs font-light text-muted-foreground">
                Audit trail aktivitas dan mutasi data sistem terbaru di seluruh
                ekosistem.
              </p>
            </div>
            <Link
              href="/transactions"
              className="group inline-flex items-center gap-1.5 font-mono text-xs text-foreground transition-colors hover:underline"
            >
              <span>Buka Audit Ledger Lengkap</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="divide-y divide-foreground/5">
            {recentTransactions.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-muted-foreground">
                Belum ada transaksi tercatat pada master ledger.
              </div>
            ) : (
              recentTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="group flex flex-col gap-3 py-4 transition-colors hover:bg-foreground/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-3 rounded-2xl"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[11px] font-medium text-foreground">
                      {trx.trxNumber}
                    </span>
                    <div>
                      <p className="font-serif text-sm font-normal text-foreground">
                        {trx.actionType}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {trx.domain} &bull; {trx.entityType}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                    {trx.amount && trx.amount > 0 ? (
                      <span className="font-mono text-xs font-medium text-foreground">
                        Rp {trx.amount.toLocaleString("id-ID")}
                      </span>
                    ) : null}

                    <span className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {trx.status}
                    </span>

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
