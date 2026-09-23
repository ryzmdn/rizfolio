import Image from "next/image"
import { GitHub, LinkedIn } from "@workspace/ui/constants/icons"
import { ArrowUpRight } from "lucide-react"

export function AuthorBio() {
  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-8 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-x-4">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
            <Image
              src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
              alt="Rizky Ramadhan"
              fill
              className="size-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              Rizky Ramadhan
            </h3>
            <p className="text-xs text-muted-foreground">
              Multidisciplinary Digital Builder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-3 text-xs">
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-x-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="size-3" />
          </a>
          <span className="text-muted-foreground/40">&bull;</span>
          <a
            href="https://github.com/ryzmdn"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-x-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <GitHub className="size-3" />
            <span>GitHub</span>
          </a>
          <span className="text-muted-foreground/40">&bull;</span>
          <a
            href="https://linkedin.com/in/ryzmdn"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-x-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <LinkedIn className="size-3" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      <p className="text-xs/relaxed text-muted-foreground">
        Architecting resilient digital systems at the intersection of robust full-stack engineering, accessible interface design, and observable cloud infrastructure.
      </p>
    </div>
  )
}
