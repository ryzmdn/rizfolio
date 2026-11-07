import Image from "next/image"
import { GitHub, LinkedIn } from "@workspace/ui/constants/icons"
import { ArrowUpRight } from "lucide-react"

export function AuthorBio() {
  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"

  return (
    <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-8 sm:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-foreground/15 bg-foreground/5">
            <Image
              src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
              alt="Rizky Ramadhan"
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
              [ AUTHOR // COLOPHON ]
            </span>
            <h3 className="font-serif text-lg font-light tracking-tight text-foreground sm:text-xl">
              Rizky Ramadhan
            </h3>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Multidisciplinary Digital Builder
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/3 px-3.5 py-1.5 text-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="size-3" />
          </a>
          <a
            href="https://github.com/ryzmdn"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/3 px-3.5 py-1.5 text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
          >
            <GitHub className="size-3" />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/ryzmdn"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/3 px-3.5 py-1.5 text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
          >
            <LinkedIn className="size-3" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      <p className="mt-6 text-xs font-light leading-relaxed text-muted-foreground sm:text-sm">
        Architecting resilient digital systems at the intersection of robust full-stack engineering, accessible interface design, and observable cloud infrastructure.
      </p>
    </div>
  )
}
