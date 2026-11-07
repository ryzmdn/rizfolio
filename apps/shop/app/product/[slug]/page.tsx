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
  ChevronRight,
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
import {
  SEO_CONFIG,
  getBaseUrl,
  createBreadcrumbJsonLd,
} from "@workspace/ui/lib/seo"

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

  const baseUrl = getBaseUrl("shop")
  const productUrl = `${baseUrl}/product/${slug}`
  const title = product.title
  const description = product.description
  const coverImage = product.coverImageUrl || SEO_CONFIG.author.avatar

  return {
    title: `${title} | Rizfolio Store`,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: productUrl,
      images: [{ url: coverImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImage],
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

  const baseUrl = getBaseUrl("shop")
  const productUrl = `${baseUrl}/product/${product.slug}`

  const gallery =
    product.galleryUrls && product.galleryUrls.length > 0
      ? product.galleryUrls
      : product.coverImageUrl
        ? [product.coverImageUrl]
        : []

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.coverImageUrl || SEO_CONFIG.author.avatar,
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
      url: productUrl,
      seller: {
        "@type": "Person",
        name: SEO_CONFIG.author.name,
        url: SEO_CONFIG.author.url,
      },
    },
    ...(product.rating && product.reviewCount && product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  }

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Store Catalog", url: baseUrl },
    ...(product.category
      ? [
          {
            name: product.category,
            url: `${baseUrl}/?category=${product.category}`,
          },
        ]
      : []),
    { name: product.title, url: productUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Container className="max-w-6xl py-12 md:py-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            <span>Archive Catalog</span>
          </Link>
          {product.category && (
            <>
              <ChevronRight className="size-3 opacity-40" />
              <Link
                href={`/?category=${product.category}`}
                className="transition-colors hover:text-foreground"
              >
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="size-3 opacity-40" />
          <span className="truncate font-medium text-foreground">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-12 lg:col-span-7">
            <ImageGallery images={gallery} title={product.title} />

            <div className="space-y-4 border-b border-foreground/6 pb-8">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                SYSTEM SPECIFICATION
              </span>
              <h1 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                {product.title}
              </h1>
              <p className="text-sm leading-relaxed font-light whitespace-pre-line text-muted-foreground">
                {product.description}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="space-y-4 rounded-3xl border border-foreground/10 bg-foreground/[0.015] p-6 sm:p-8">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  DELIVERABLES & ARCHITECTURAL CAPABILITIES
                </span>
                <ul className="grid grid-cols-1 gap-3 pt-1 text-xs font-light text-foreground/90 sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-foreground/40" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.files && product.files.length > 0 && (
              <div className="space-y-3 rounded-3xl border border-foreground/10 bg-foreground/[0.015] p-6 sm:p-8">
                <div className="flex items-center gap-2 font-mono text-xs text-foreground uppercase">
                  <FileCode className="size-4 text-muted-foreground" />
                  <span>INCLUDED SOURCE PACKAGES</span>
                </div>
                <ul className="divide-y divide-foreground/6 font-mono text-xs">
                  {product.files.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between py-3"
                    >
                      <span className="text-foreground/90">
                        {file.fileName}
                      </span>
                      <span className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-2.5 py-0.5 text-[10px] text-muted-foreground">
                        {formatBytes(file.fileSizeBytes)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-foreground/8 bg-foreground/[0.01] p-5">
                <Download className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="space-y-1">
                  <h4 className="font-mono text-xs font-medium text-foreground uppercase">
                    Instant Fulfillment
                  </h4>
                  <p className="text-[11px] leading-relaxed font-light text-muted-foreground">
                    Deterministic cryptographic download token generated
                    immediately upon verified payment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-foreground/8 bg-foreground/[0.01] p-5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="space-y-1">
                  <h4 className="font-mono text-xs font-medium text-foreground uppercase">
                    Production Verified
                  </h4>
                  <p className="text-[11px] leading-relaxed font-light text-muted-foreground">
                    Strict TypeScript compilation, Next.js 16 compiler tested,
                    zero runtime type errors.
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
          <div className="mt-24 space-y-8 border-t border-foreground/6 pt-16">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                [ COMPLEMENTARY ARCHITECTURES ]
              </span>
              <Link
                href="/"
                className="font-mono text-xs text-muted-foreground uppercase hover:text-foreground"
              >
                View Full Catalog &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="group flex flex-col justify-between rounded-3xl border border-foreground/10 bg-foreground/[0.01] p-6 transition-all hover:border-foreground/30 hover:bg-foreground/[0.02]"
                >
                  <div className="space-y-4">
                    {rel.coverImageUrl && (
                      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-foreground/8 bg-muted">
                        <Image
                          src={rel.coverImageUrl}
                          alt={rel.title}
                          fill
                          sizes="300px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-muted-foreground uppercase">
                        {rel.productType === "DIGITAL_DOWNLOAD"
                          ? "Digital Download"
                          : "Advisory"}
                      </span>
                      <span className="font-mono font-medium text-foreground">
                        {formatPrice(rel.price, rel.currency)}
                      </span>
                    </div>

                    <h3 className="text-base font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground/80">
                      <Link href={`/product/${rel.slug}`}>{rel.title}</Link>
                    </h3>
                  </div>

                  <div className="mt-6 flex items-center justify-end border-t border-foreground/6 pt-3">
                    <Link
                      href={`/product/${rel.slug}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
                    >
                      <span>Inspect</span>
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
