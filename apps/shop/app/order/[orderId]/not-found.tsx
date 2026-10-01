import Link from "next/link"
import { FileQuestion, ArrowLeft } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"

export default function OrderNotFound() {
  return (
    <Container className="max-w-2xl py-20 text-center">
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-card/40 p-6 py-14 sm:p-10">
        <div className="flex size-12 items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground">
          <FileQuestion className="size-6" />
        </div>

        <span className="mt-3 font-mono text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
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

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Store Catalog</span>
          </Link>
        </div>
      </div>
    </Container>
  )
}
