import type { Metadata } from "next"
import Link from "next/link"
import {
  ShieldCheck,
  FileCode,
  Users,
  Package,
  ArrowDownRight,
} from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"
import { getActiveProducts } from "@/lib/queries"
import { FilterBar } from "@/components/filter-bar"
import { ProductCard } from "@/components/product-card"
import { StoreFaq } from "@/components/store-faq"
import { FAQ_ITEMS } from "@/data/faq"
import {
  SEO_CONFIG,
  getBaseUrl,
  createWebSiteJsonLd,
  createFaqJsonLd,
} from "@workspace/ui/lib/seo"

export const revalidate = 3600

const shopUrl = getBaseUrl("shop")

export const metadata: Metadata = {
  title: SEO_CONFIG.sites.shop.defaultTitle,
  description: SEO_CONFIG.sites.shop.description,
  alternates: {
    canonical: shopUrl,
  },
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
      value: "06+",
      label: "Curated Systems",
      description: "Monorepos, design systems, and backend engines",
    },
    {
      value: "5.0/5.0",
      label: "Architect Rating",
      description: "Feedback from verified engineering teams",
    },
    {
      value: "Instant",
      label: "Digital Delivery",
      description: "Immediate repository access and license provisioning",
    },
  ]

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Enterprise Architecture",
      description:
        "Built strictly with Next.js 16, React 19 Server Components, and Turborepo with zero legacy code or technical debt.",
    },
    {
      icon: FileCode,
      title: "Perpetual Commercial Rights",
      description:
        "Standard and Extended commercial licenses with full unminified source code, lifetime revisions, and clear rights.",
    },
    {
      icon: Users,
      title: "Lead Engineering Advisory",
      description:
        "Direct email architecture support and dedicated 1-on-1 system review sessions for mission-critical builds.",
    },
  ]

  const websiteJsonLd = createWebSiteJsonLd({
    siteKey: "shop",
    url: shopUrl,
  })

  const faqJsonLd = createFaqJsonLd(FAQ_ITEMS)

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${shopUrl}/#collection`,
    name: SEO_CONFIG.sites.shop.name,
    description: SEO_CONFIG.sites.shop.description,
    url: shopUrl,
    hasPart: products.slice(0, 10).map((prod) => ({
      "@type": "Product",
      name: prod.title,
      description: prod.description,
      url: `${shopUrl}/product/${prod.slug}`,
      offers: {
        "@type": "Offer",
        price: prod.price.toString(),
        priceCurrency: prod.currency,
        availability: "https://schema.org/InStock",
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <div className="space-y-24 pt-16 pb-24 sm:space-y-32">
        <section className="space-y-16">
          <Container className="space-y-8">
            <div className="flex flex-col gap-6 border-b border-foreground/6 pb-8 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
                  [ DIGITAL BOUTIQUE & ARCHITECTURAL ASSETS ]
                </span>
                <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-6xl md:text-7xl">
                  Software systems engineered with{" "}
                  <span className="font-serif text-foreground/80 italic">
                    timeless precision
                  </span>
                  .
                </h1>
              </div>

              <a
                href="#catalog"
                className="group inline-flex shrink-0 items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                <span>Explore Catalog</span>
                <ArrowDownRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </div>

            <p className="max-w-3xl text-base leading-relaxed font-light text-muted-foreground sm:text-lg">
              Production-hardened monorepo infrastructures, Tailwind CSS v4
              design systems, and specialized senior engineering advisory
              designed to accelerate high-stakes digital ventures.
            </p>
          </Container>

          <Container>
            <div className="grid grid-cols-2 gap-8 border-y border-foreground/6 py-8 sm:grid-cols-4 sm:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <span className="font-mono text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                    {stat.value}
                  </span>
                  <p className="font-mono text-xs font-medium tracking-tight text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-[11px] leading-snug font-light text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
              {pillars.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.title}
                    className="flex flex-col justify-between rounded-3xl border border-foreground/10 bg-foreground/[0.015] p-8 transition-colors hover:border-foreground/25 sm:p-10"
                  >
                    <div className="space-y-4">
                      <div className="flex size-9 items-center justify-center rounded-xl border border-foreground/15 bg-foreground/[0.02] text-foreground">
                        <Icon className="size-4 stroke-[1.5]" />
                      </div>
                      <h2 className="text-lg font-medium tracking-tight text-foreground">
                        {pillar.title}
                      </h2>
                      <p className="text-xs leading-relaxed font-light text-muted-foreground sm:text-sm">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        <section id="catalog" className="scroll-mt-24 space-y-10">
          <Container className="space-y-8">
            <div className="flex flex-col gap-2 border-b border-foreground/6 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  ACTIVE INVENTORY
                </span>
                <h2 className="text-2xl font-light tracking-tight text-foreground sm:text-3xl">
                  Architectural Catalog
                </h2>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Showing {products.length} Verified Systems
              </p>
            </div>

            <FilterBar totalCount={products.length} />

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-foreground/10 bg-foreground/[0.01] p-12 py-24 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-foreground/15 bg-foreground/[0.02] text-muted-foreground">
                  <Package className="size-6 stroke-[1.25]" />
                </div>
                <h3 className="mt-4 text-base font-medium text-foreground">
                  No architectures matched your parameters
                </h3>
                <p className="mt-1 max-w-sm text-xs font-light text-muted-foreground">
                  No software architectures or consultation packages matched
                  your current filter criteria.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center rounded-full bg-foreground px-6 py-2.5 font-mono text-xs tracking-wider text-background uppercase transition-opacity hover:opacity-90"
                >
                  <span>Reset Filters</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </Container>
        </section>

        <section
          id="faq"
          className="scroll-mt-24 border-t border-foreground/6 pt-16"
        >
          <Container>
            <StoreFaq />
          </Container>
        </section>
      </div>
    </>
  )
}
