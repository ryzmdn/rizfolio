import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import {
  getProductBySlug,
  getRelatedProducts,
  formatPrice,
} from "@/lib/queries"
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ShieldCheck,
  Zap,
  FileCode,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Lock,
} from "lucide-react"
import type { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
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
  const [product, relatedProducts] = await Promise.all([
    getProductBySlug(slug),
    getRelatedProducts(slug, 3),
  ])

  if (!product) {
    notFound()
  }

  const isDigital = product.productType === "DIGITAL_DOWNLOAD"
  const gallery =
    product.galleryUrls && product.galleryUrls.length > 0
      ? product.galleryUrls
      : product.coverImageUrl
        ? [product.coverImageUrl]
        : []

  return (
    <Container className="max-w-6xl py-12 md:py-20">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        <span>Back to Store Catalog</span>
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-8 lg:col-span-7">
          {gallery.length > 0 && (
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-xs">
              <Image
                src={gallery[0] || ""}
                alt={product.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {gallery.slice(1).map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-muted"
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.title} preview ${idx + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-6 border-t border-border/60 pt-4">
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              Product Overview & Specifications
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground sm:text-base">
              {product.description}
            </p>
          </div>

          {product.files && product.files.length > 0 && (
            <div className="space-y-4 rounded-xl border border-border/60 bg-card/40 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <FileCode className="size-4 text-primary" />
                <span>Included Digital Assets & Packages</span>
              </div>
              <ul className="divide-y divide-border/40 text-xs">
                {product.files.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="font-mono text-muted-foreground">
                      {file.fileName}
                    </span>
                    <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
                      {formatBytes(file.fileSizeBytes)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/30 p-4">
              <Zap className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-foreground">
                  Instant Fulfillment
                </h3>
                <p className="text-xs text-muted-foreground">
                  Download tokens are automatically provisioned upon completed
                  checkout.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/30 p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-foreground">
                  Type-Safe & Tested
                </h3>
                <p className="text-xs text-muted-foreground">
                  Written in strict TypeScript with zero runtime syntax errors.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6 rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {isDigital ? (
                  <>
                    <Download className="size-3" />
                    <span>Digital Download</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3" />
                    <span>Service Consultation</span>
                  </>
                )}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                <CheckCircle2 className="size-3.5" />
                <span>In Stock & Ready</span>
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl leading-tight font-medium tracking-tight text-foreground sm:text-3xl">
                {product.title}
              </h1>
              <div className="pt-2">
                <span className="text-3xl font-semibold text-foreground">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  One-time payment
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
                <span>Full source code with MIT / Commercial license</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
                <span>Lifetime access and free future revision downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
                <span>Direct email engineering support</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <a
                href={`mailto:hello@rizkyramadhan.dev?subject=Order Inquiry: ${encodeURIComponent(product.title)}`}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              >
                {isDigital ? (
                  <>
                    <Download className="size-4" />
                    <span>Get Instant Access</span>
                  </>
                ) : (
                  <>
                    <Clock className="size-4" />
                    <span>Book Consultation Session</span>
                  </>
                )}
              </a>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-muted-foreground">
                <Lock className="size-3" />
                <span>
                  Secure encrypted inquiry and direct order fulfillment
                </span>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-border/40 bg-muted/40 p-4 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Architecture</span>
                <span className="font-medium text-foreground">
                  Next.js 16 + Tailwind v4
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Delivery Format</span>
                <span className="font-medium text-foreground">
                  {isDigital ? "Secure ZIP Archive" : "Video Call / Report"}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Updated</span>
                <span className="font-medium text-foreground">August 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-24 space-y-8 border-t border-border pt-16">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              More Engineering Assets & Services
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="group flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:border-border hover:bg-card"
              >
                <div className="space-y-3">
                  {rel.coverImageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={rel.coverImageUrl}
                        alt={rel.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {rel.productType === "DIGITAL_DOWNLOAD"
                        ? "Digital Download"
                        : "Service"}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(rel.price, rel.currency)}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    <Link href={`/product/${rel.slug}`}>{rel.title}</Link>
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-end border-t border-border/40 pt-3">
                  <Link
                    href={`/product/${rel.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <span>View Product</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  )
}
