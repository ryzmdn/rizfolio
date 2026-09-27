import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowLeft,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Download,
  ArrowRight,
  Layers,
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
      title: "Product Not Found | Rizfolio Store",
    }
  }

  const title = product.title
  const description = product.description

  return {
    title: `${title} | Rizfolio Store`,
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
              <div className="space-y-4 rounded-lg border border-border/70 bg-card/40 p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-foreground">
                  Key Features & Technical Capabilities
                </h3>
                <ul className="grid grid-cols-1 gap-2.5 pt-1 text-xs text-muted-foreground sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-foreground" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.files && product.files.length > 0 && (
              <div className="space-y-3 rounded-lg border border-border/70 bg-card/40 p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileCode className="size-4 text-muted-foreground" />
                  <span>Included Digital Packages</span>
                </div>
                <ul className="divide-y divide-border/60 text-xs">
                  {product.files.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between py-2.5"
                    >
                      <span className="font-mono text-foreground">
                        {file.fileName}
                      </span>
                      <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                        {formatBytes(file.fileSizeBytes)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-4 sm:p-5">
                <Download className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
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

              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-4 sm:p-5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
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
          <div className="mt-20 space-y-8 border-t border-border/60 pt-12 sm:pt-16">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Related Software Architectures
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="group flex flex-col justify-between rounded-lg border border-border/70 bg-card/40 p-5 transition-colors hover:border-border hover:bg-card"
                >
                  <div className="space-y-3">
                    {rel.coverImageUrl && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border/60 bg-muted">
                        <Image
                          src={rel.coverImageUrl}
                          alt={rel.title}
                          fill
                          sizes="300px"
                          className="object-cover transition-transform duration-300 group-hover:scale-102"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {rel.productType === "DIGITAL_DOWNLOAD"
                          ? "Digital Download"
                          : "1-on-1 Service"}
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {formatPrice(rel.price, rel.currency)}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground">
                      <Link href={`/product/${rel.slug}`}>{rel.title}</Link>
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-end border-t border-border/50 pt-3">
                    <Link
                      href={`/product/${rel.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
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
