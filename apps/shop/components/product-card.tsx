import Image from "next/image"
import Link from "next/link"
import {
  Download,
  Users,
  ArrowRight,
  ExternalLink,
  Star,
  Layers,
  Code2,
  Cpu,
  LayoutGrid,
} from "lucide-react"
import { AddToCartButton } from "./add-to-cart-button"
import { PriceDisplay } from "./price-display"
import type { ShopProduct } from "../lib/queries"
import { cn } from "@workspace/ui/lib/utils"

interface ProductCardProps {
  product: ShopProduct
  className?: string
}

function getCategoryMeta(category: string) {
  switch (category) {
    case "STARTER_KIT":
      return { label: "Starter Kit", icon: Code2 }
    case "UI_SYSTEM":
      return { label: "UI System", icon: LayoutGrid }
    case "BACKEND":
      return { label: "Backend", icon: Cpu }
    case "CONSULTATION":
      return { label: "Consultation", icon: Users }
    default:
      return { label: "Digital Asset", icon: Layers }
  }
}

export function ProductCard({ product, className }: ProductCardProps) {
  const isDigital = product.productType === "DIGITAL_DOWNLOAD"
  const categoryMeta = getCategoryMeta(product.category)
  const CategoryIcon = categoryMeta.icon

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/[0.015] p-6 transition-hover-lift hover:border-foreground/30 hover:bg-foreground/[0.025] hover:shadow-2xl sm:p-8",
        className
      )}
    >
      <div className="space-y-6">
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-foreground/8 bg-muted">
          {product.coverImageUrl ? (
            <Image
              src={product.coverImageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px"
              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted/40 text-muted-foreground">
              <Layers className="size-8 stroke-[1.25]" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-foreground/15 bg-background/85 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-foreground uppercase backdrop-blur-md">
              {isDigital ? (
                <>
                  <Download className="size-3 text-muted-foreground" />
                  <span>Digital</span>
                </>
              ) : (
                <>
                  <Users className="size-3 text-muted-foreground" />
                  <span>Advisory</span>
                </>
              )}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-foreground/15 bg-background/85 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase backdrop-blur-md">
              <CategoryIcon className="size-3" />
              <span>{categoryMeta.label}</span>
            </span>
          </div>

          {product.demoUrl && (
            <a
              href={product.demoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Preview live demo for ${product.title}`}
              className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full border border-foreground/15 bg-background/85 text-muted-foreground backdrop-blur-md transition-hover-lift hover:scale-110 hover:bg-foreground hover:text-background"
            >
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Star className="size-3 text-foreground fill-foreground" />
              <span className="font-medium text-foreground">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-foreground/40">
                ({product.reviewCount})
              </span>
            </div>

            <div className="text-right">
              <PriceDisplay
                amount={product.price}
                className="font-mono text-base font-light tracking-tight text-foreground sm:text-lg"
              />
            </div>
          </div>

          <h2 className="text-xl font-medium tracking-tight text-foreground transition-colors-luxury group-hover:text-foreground/80 sm:text-2xl">
            <Link
              href={`/product/${product.slug}`}
              className="focus:outline-hidden"
            >
              {product.title}
            </Link>
          </h2>

          <p className="line-clamp-2 text-xs font-light leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.techStack && product.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-foreground/8 bg-foreground/[0.02] px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
              {product.techStack.length > 4 && (
                <span className="rounded-md border border-foreground/8 bg-foreground/[0.02] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  +{product.techStack.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-foreground/6 pt-4">
        <AddToCartButton
          product={{
            id: product.id,
            slug: product.slug,
            title: product.title,
            coverImageUrl: product.coverImageUrl,
            productType: product.productType,
            price: product.price,
            currency: product.currency,
          }}
          size="sm"
          variant="outline"
          label="Add to Bag"
        />

        <Link
          href={`/product/${product.slug}`}
          className="group/link inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors-luxury hover:text-foreground"
        >
          <span>Inspect Architecture</span>
          <ArrowRight className="size-3.5 transition-transform duration-300 ease-luxury group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
