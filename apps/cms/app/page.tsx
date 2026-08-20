import { Container } from "@workspace/ui/components/layouts/container"
import { ShieldCheck } from "lucide-react"

export default function CMSPage() {
  return (
    <Container className="py-20">
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          <span>Admin Portal</span>
        </div>
        <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          Personal CMS
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Central management console for portfolio, blog, shop, archive, and
          changelog.
        </p>
      </div>
    </Container>
  )
}
