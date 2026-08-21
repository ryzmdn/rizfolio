import { Container } from "@workspace/ui/components/layouts/container"
import { getActiveProducts, formatPrice } from "@/lib/queries"
import Image from "next/image"
import Link from "next/link"
import {
  Sparkles,
  Download,
  ArrowRight,
  Layers,
  Package,
  Search,
} from "lucide-react"

interface ShopPageProps {
  searchParams: Promise<{
    type?: string
    q?: string
  }>
}

export default async function ShopHomePage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams
  const type = resolvedParams?.type
  const q = resolvedParams?.q

  const products = await getActiveProducts({
    productType: type,
    query: q,
  })

  return (
    <>
      <Container className="py-20">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            <span>Curated Software & Engineering Assets</span>
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Digital Tools & Starter Kits
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Production-tested architectures, design systems, and specialized
            consultation services crafted to accelerate your software
            engineering workflow.
          </p>
        </div>
      </Container>

      <Container className="sticky top-0 z-20 border-y border-border bg-background/50 py-4 backdrop-blur-xs">
        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Link
              href="/"
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                !type || type === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Layers className="size-3.5" />
              <span>All Products</span>
            </Link>
            <Link
              href="/?type=DIGITAL_DOWNLOAD"
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                type === "DIGITAL_DOWNLOAD"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Download className="size-3.5" />
              <span>Digital Downloads</span>
            </Link>
            <Link
              href="/?type=SERVICE"
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                type === "SERVICE"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Sparkles className="size-3.5" />
              <span>Services & Consultations</span>
            </Link>
          </div>

          <form
            action="/"
            method="GET"
            className="relative flex max-w-sm min-w-64 items-center"
          >
            {type && <input type="hidden" name="type" value={type} />}
            <Search className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Search products..."
              className="w-full rounded-lg border border-border bg-card/60 py-1.5 pr-4 pl-9 text-xs transition-all placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/50 focus:outline-hidden"
            />
          </form>
        </div>
      </Container>

      <Container className="py-16">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 py-24 text-center">
            <Package className="mb-3 size-10 text-muted-foreground/40" />
            <h2 className="text-lg font-medium text-foreground">
              No products found
            </h2>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              We couldn&apos;t find any active digital items matching your
              search or filter.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center text-xs font-medium text-primary hover:underline"
            >
              Reset all filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const isDigital = product.productType === "DIGITAL_DOWNLOAD"

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card/40 p-4 transition-all duration-200 hover:border-border hover:bg-card hover:shadow-xs"
                >
                  <div className="space-y-4">
                    {product.coverImageUrl && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={product.coverImageUrl}
                          alt={product.title}
                          fill
                          loading="lazy"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
                        {isDigital ? (
                          <>
                            <Download className="size-3" />
                            <span>Digital Download</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-3" />
                            <span>Service</span>
                          </>
                        )}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-base font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                        <Link
                          href={`/product/${product.slug}`}
                          className="focus:outline-hidden"
                        >
                          {product.title}
                        </Link>
                      </h2>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-3">
                    <span className="text-[11px] text-muted-foreground">
                      {isDigital ? "Instant Access" : "Direct Booking"}
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <span>View Details</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Container>
    </>
  )
}
