import type { Metadata } from "next"
import Link from "next/link"
import {
  ShieldCheck,
  FileCode,
  Users,
  Package,
} from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"
import { getActiveProducts } from "@/lib/queries"
import { FilterBar } from "@/components/filter-bar"
import { ProductCard } from "@/components/product-card"
import { StoreFaq } from "@/components/store-faq"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Digital Tools & Engineering Starter Kits | Rizfolio Store",
  description:
    "Explore production-tested software architectures, Next.js 16 starter kits, Tailwind v4 UI systems, and specialized senior engineering consultations.",
}

interface ShopPageProps {
  searchParams: Promise<{
    type?: string
    category?: string
    q?: string
    sortBy?: "featured" | "rating" | "price-low" | "price-high" | "newest"
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function ShopHomePage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams
  const type = resolvedParams?.type
  const category = resolvedParams?.category
  const q = resolvedParams?.q
  const sortBy = resolvedParams?.sortBy
  const minPrice = resolvedParams?.minPrice
    ? Number(resolvedParams.minPrice)
    : undefined
  const maxPrice = resolvedParams?.maxPrice
    ? Number(resolvedParams.maxPrice)
    : undefined

  const products = await getActiveProducts({
    productType: type,
    category,
    query: q,
    sortBy,
    minPrice,
    maxPrice,
  })

  const stats = [
    {
      value: "100%",
      label: "Production-Tested",
      description: "Strict TypeScript with zero runtime type errors",
    },
    {
      value: "6+",
      label: "Curated Architectures",
      description: "Monorepos, design systems, and backend pools",
    },
    {
      value: "4.9/5.0",
      label: "Verified Rating",
      description: "Feedback from working software engineers",
    },
    {
      value: "Instant",
      label: "Digital Fulfillment",
      description: "Immediate zip access and license provisioning",
    },
  ]

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Enterprise Architecture",
      description:
        "Built strictly on Next.js 16, React 19 Server Components, and Turborepo with zero legacy code or technical debt.",
    },
    {
      icon: FileCode,
      title: "Full Commercial Ownership",
      description:
        "Standard and Extended commercial licenses with full unminified source code, lifetime revisions, and clear rights.",
    },
    {
      icon: Users,
      title: "Senior Engineering Advisory",
      description:
        "Direct email engineering support and dedicated 1-on-1 architecture review sessions on Google Meet.",
    },
  ]

  return (
    <div className="space-y-14 pb-20 pt-8 sm:space-y-16">
      <section className="space-y-10">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-muted/30 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <span>Curated Software & Engineering Assets</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl sm:leading-tight">
              Digital Tools & Engineering Starter Kits
            </h1>

            <p className="mx-auto max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Production-tested monorepo architectures, Tailwind CSS v4 design
              systems, and specialized senior engineering consultation sessions
              engineered to accelerate real-world digital builds.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <a
                href="#catalog"
                className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                <span>Explore Catalog</span>
              </a>

              <a
                href="#faq"
                className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/60"
              >
                <span>View Licensing FAQ</span>
              </a>
            </div>
          </div>
        </Container>

        <Container>
          <div className="grid grid-cols-2 divide-y divide-border/60 border-y border-border/60 py-6 sm:grid-cols-4 sm:divide-y-0 sm:divide-x sm:py-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col p-4 text-center sm:text-left"
              >
                <span className="font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs font-semibold text-foreground">
                  {stat.label}
                </span>
                <span className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card/40 p-5 transition-colors hover:border-foreground/30"
                >
                  <div className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-muted/30 text-foreground">
                    <Icon className="size-4" />
                  </div>
                  <h2 className="text-xs font-semibold text-foreground sm:text-sm">
                    {pillar.title}
                  </h2>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="catalog" className="scroll-mt-20 space-y-6">
        <Container className="space-y-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between border-b border-border/50 pb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Storefront Catalog
              </h2>
              <p className="text-xs text-muted-foreground">
                Filter by architecture category, search by tech stack, and sort
                by pricing or reviews.
              </p>
            </div>
          </div>

          <FilterBar totalCount={products.length} />

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/10 p-8 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-md border border-border/70 bg-muted/30 text-muted-foreground">
                <Package className="size-6" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                No products found
              </h3>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                No software architectures or consultation packages matched your
                current search query or filter selection.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <span>Reset all filters</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <section id="faq" className="scroll-mt-20">
        <Container>
          <StoreFaq />
        </Container>
      </section>
    </div>
  )
}
