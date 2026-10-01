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
import { formatPrice } from "../lib/utils"
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
        "group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border/70 bg-card transition-colors hover:border-foreground/30",
        className
      )}
    >
      <div className="space-y-3.5 p-4 sm:p-5">
        <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border/60 bg-muted/40">
          {product.coverImageUrl ? (
            <Image
              src={product.coverImageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-102"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/40 text-muted-foreground">
              <Layers className="size-8" />
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-background/95 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-xs">
              {isDigital ? (
                <>
                  <Download className="size-3 text-muted-foreground" />
                  <span>Digital</span>
                </>
              ) : (
                <>
                  <Users className="size-3 text-muted-foreground" />
                  <span>Consultation</span>
                </>
              )}
            </span>

            <span className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-background/95 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-xs">
              <CategoryIcon className="size-3 text-muted-foreground" />
              <span>{categoryMeta.label}</span>
            </span>
          </div>

          {product.demoUrl && (
            <a
              href={product.demoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Preview live demo for ${product.title}`}
              className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/95 text-muted-foreground shadow-xs transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-500 dark:text-amber-400">
              <Star className="size-3.5 fill-current" />
            </div>
            <span className="font-mono text-xs font-semibold text-foreground">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          <div className="text-right">
            <PriceDisplay
              amount={product.price}
              className="font-mono text-sm font-bold text-foreground sm:text-base"
            />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground/80 sm:text-base">
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

        {product.techStack && product.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {product.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {product.techStack.length > 4 && (
              <span className="rounded-md border border-border/60 bg-muted/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                +{product.techStack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border/60 bg-muted/15 px-4 py-2.5">
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
          label="Add to Cart"
        />

        <Link
          href={`/product/${product.slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>View Details</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
