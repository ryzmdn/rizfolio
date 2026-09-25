import Link from "next/link"
import { FileQuestion, ArrowLeft } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"

export default function OrderNotFound() {
  return (
    <Container className="max-w-2xl py-20 text-center">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/40 p-8 py-16 backdrop-blur-md sm:p-12">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
          <FileQuestion className="size-8" />
        </div>

        <span className="mt-4 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          Order Unverified
        </span>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Order Receipt Not Found
        </h1>

        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          We could not locate an active digital purchase or license fulfillment
          record matching this reference number. Please check your order ID or
          contact engineering support.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Store Catalog</span>
          </Link>
        </div>
      </div>
    </Container>
  )
}
