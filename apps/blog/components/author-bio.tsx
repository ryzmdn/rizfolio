import Image from "next/image"
import { GitHub, LinkedIn } from "@workspace/ui/constants/icons"
import { ArrowUpRight } from "lucide-react"

export function AuthorBio() {
  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"

  return (
    <div className="border-t border-border/40 pt-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-border/60">
            <Image
              src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
              alt="Rizky Ramadhan"
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Rizky Ramadhan
            </h3>
            <p className="text-xs text-muted-foreground">
              Multidisciplinary Digital Builder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-foreground underline underline-offset-2 hover:text-muted-foreground"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="size-3" />
          </a>
          <span className="text-border">·</span>
          <a
            href="https://github.com/ryzmdn"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <GitHub className="size-3.5" />
            <span>GitHub</span>
          </a>
          <span className="text-border">·</span>
          <a
            href="https://linkedin.com/in/ryzmdn"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <LinkedIn className="size-3.5" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      <p className="mt-4 text-sm/relaxed text-muted-foreground">
        Architecting resilient digital systems at the intersection of robust full-stack engineering, accessible interface design, and observable cloud infrastructure.
      </p>
    </div>
  )
}
