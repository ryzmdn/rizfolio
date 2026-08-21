import Link from "next/link"
import {
  FileText,
  ShoppingBag,
  FolderGit2,
  History,
  User,
  Image,
  ArrowUpRight,
  Database,
  ShieldCheck,
} from "lucide-react"
import { CmsPageShell } from "../components/cms-page-shell"
import { RevalidationButton } from "../components/revalidation-button"
import { getPosts } from "../lib/actions/blog-actions"
import { getProducts, getOrders } from "../lib/actions/shop-actions"
import { getAdminRepositories } from "../lib/actions/archive-actions"
import { getChangelogs } from "../lib/actions/changelog-actions"

export const dynamic = "force-dynamic"

export default async function OverviewDashboard() {
  const [posts, products, orders, repos, changelogs] = await Promise.all([
    getPosts(),
    getProducts(),
    getOrders(),
    getAdminRepositories(),
    getChangelogs(),
  ])

  const stats = [
    {
      title: "Blog Articles",
      value: posts.length,
      published: posts.filter((p) => p.status === "PUBLISHED").length,
      href: "/blog",
      icon: FileText,
    },
    {
      title: "Digital Products",
      value: products.length,
      published: products.filter((p) => p.isActive).length,
      href: "/shop",
      icon: ShoppingBag,
    },
    {
      title: "Orders Received",
      value: orders.length,
      published: orders.filter((o) => o.status === "PAID").length,
      href: "/shop",
      icon: ShoppingBag,
    },
    {
      title: "Repositories",
      value: repos.length,
      published: repos.filter((r) => r.isPublic).length,
      href: "/archive",
      icon: FolderGit2,
    },
    {
      title: "Changelog Releases",
      value: changelogs.length,
      published: changelogs.filter((c) => c.isPublished).length,
      href: "/changelog",
      icon: History,
    },
  ]

  const quickLinks = [
    { title: "Kelola Profil & Portofolio", href: "/portfolio", icon: User },
    { title: "Tulis Artikel Baru", href: "/blog", icon: FileText },
    { title: "Tambah Produk Toko", href: "/shop", icon: ShoppingBag },
    { title: "Unggah Repositori Kode", href: "/archive", icon: FolderGit2 },
    { title: "Media Library (Storage)", href: "/media", icon: Image },
  ]

  return (
    <CmsPageShell
      title="System Overview"
      description="Pusat pemantauan status konten dan ekosistem website."
      actions={<RevalidationButton />}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-foreground/30 hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.title}
                  </span>
                  <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
                <div className="mt-4 space-y-1">
                  <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                    {item.value}
                  </span>
                  <div className="text-[11px] text-muted-foreground">
                    {item.published} published / active
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-border/80 bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">
              Aksi Cepat
            </h2>
            <div className="divide-y divide-border/40 text-xs">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between py-3 transition-colors hover:text-primary"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                      <span className="font-medium text-foreground/90 group-hover:text-foreground">
                        {link.title}
                      </span>
                    </div>
                    <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-border/80 bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">
              Status Infrastruktur
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-2.5">
                  <Database className="size-4 text-foreground/80" />
                  <span className="font-medium text-foreground">
                    Supabase PostgreSQL & Drizzle
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                  <span className="size-1.5 animate-pulse rounded-full bg-success" />
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-2.5">
                  <Image className="size-4 text-foreground/80" />
                  <span className="font-medium text-foreground">
                    Supabase Storage (Buckets)
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                  <span className="size-1.5 rounded-full bg-success" />
                  Ready
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-foreground/80" />
                  <span className="font-medium text-foreground">
                    Owner Session Guard
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CmsPageShell>
  )
}
