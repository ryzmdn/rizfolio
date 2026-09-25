import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowLeft,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"
import {
  getProductBySlug,
  getRelatedProducts,
  getAllProductSlugs,
  getProductReviews,
} from "@/lib/queries"
import { formatPrice } from "@/lib/utils"
import { ImageGallery } from "@/components/image-gallery"
import { ProductPurchaseCard } from "@/components/product-purchase-card"
import { ReviewsSection } from "@/components/reviews-section"
import { StickyBuyBar } from "@/components/sticky-buy-bar"
import { ProductFaq } from "@/components/product-faq"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found — Rizfolio Store",
    }
  }

  const title = product.title
  const description = product.description

  return {
    title: `${title} — Rizfolio Store`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: product.coverImageUrl ? [{ url: product.coverImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.coverImageUrl ? [product.coverImageUrl] : [],
    },
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const [product, relatedProducts, reviews] = await Promise.all([
    getProductBySlug(slug),
    getRelatedProducts(slug, 3),
    getProductReviews(slug),
  ])

  if (!product) {
    notFound()
  }

  const gallery =
    product.galleryUrls && product.galleryUrls.length > 0
      ? product.galleryUrls
      : product.coverImageUrl
        ? [product.coverImageUrl]
        : []

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.coverImageUrl,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Person",
        name: "Rizky Ramadhan",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="max-w-6xl py-10 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Store Catalog</span>
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-10 lg:col-span-7">
            <ImageGallery images={gallery} title={product.title} />

            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Architecture & System Overview
              </h2>
              <p className="text-xs leading-relaxed whitespace-pre-line text-muted-foreground sm:text-sm">
                {product.description}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="space-y-4 rounded-3xl border border-border/70 bg-card/40 p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">
                    Key Features & Technical Capabilities
                  </h3>
                </div>
                <ul className="grid grid-cols-1 gap-3 pt-1 text-xs text-muted-foreground sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.files && product.files.length > 0 && (
              <div className="space-y-4 rounded-3xl border border-border/70 bg-card/40 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileCode className="size-4 text-primary" />
                  <span>Included Digital Packages</span>
                </div>
                <ul className="divide-y divide-border/60 text-xs">
                  {product.files.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between py-3"
                    >
                      <span className="font-mono text-foreground">
                        {file.fileName}
                      </span>
                      <span className="rounded-lg bg-muted px-2.5 py-1 font-mono text-[11px] font-medium text-muted-foreground">
                        {formatBytes(file.fileSizeBytes)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-card/30 p-5">
                <Zap className="mt-0.5 size-5 shrink-0 text-primary" />
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-foreground">
                    Instant Digital Delivery
                  </h4>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Automated download token and license key generated
                    immediately upon transaction completion.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-card/30 p-5">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-foreground">
                    Verified TypeScript Codebase
                  </h4>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Tested with Next.js 16 and React 19 compiler with zero
                    runtime type discrepancies.
                  </p>
                </div>
              </div>
            </div>

            {product.faq && product.faq.length > 0 && (
              <ProductFaq faq={product.faq} />
            )}

            <ReviewsSection
              productSlug={product.slug}
              initialReviews={reviews}
              averageRating={product.rating}
              reviewCount={product.reviewCount}
            />
          </div>

          <div className="lg:col-span-5">
            <ProductPurchaseCard product={product} />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-8 border-t border-border/80 pt-16">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Related Software Architectures
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card/40 p-5 transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="space-y-3">
                    {rel.coverImageUrl && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-muted">
                        <Image
                          src={rel.coverImageUrl}
                          alt={rel.title}
                          fill
                          sizes="300px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {rel.productType === "DIGITAL_DOWNLOAD"
                          ? "Digital Download"
                          : "1-on-1 Service"}
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {formatPrice(rel.price, rel.currency)}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      <Link href={`/product/${rel.slug}`}>{rel.title}</Link>
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-end border-t border-border/50 pt-3">
                    <Link
                      href={`/product/${rel.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <span>Explore</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>

      <StickyBuyBar product={product} />
    </>
  )
}
