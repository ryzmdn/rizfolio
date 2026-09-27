import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-sm space-y-4">
        <p className="font-mono text-xs tracking-widest text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Page Not Found
        </h1>
        <p className="text-sm text-muted-foreground">
          The link profile or page you were looking for does not exist or has moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Links</span>
        </Link>
      </div>
    </div>
  )
}
