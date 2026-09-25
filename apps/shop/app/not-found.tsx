import Link from "next/link"
import { Package, ArrowRight, Home, ShoppingBag } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"

export default function ShopNotFound() {
  return (
    <Container className="max-w-2xl py-20 text-center">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/40 p-8 py-16 backdrop-blur-md sm:p-12">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
          <Package className="size-8" />
        </div>

        <span className="mt-4 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          404 Error
        </span>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Page Not Found
        </h1>

        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          The software architecture page, digital catalog route, or resource
          you are looking for does not exist or has been relocated.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <Home className="size-3.5" />
            <span>Explore Store Catalog</span>
          </Link>

          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingBag className="size-3.5" />
            <span>View Shopping Cart</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </Container>
  )
}
