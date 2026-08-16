import { Container } from "@workspace/ui/components/layouts"
import { personalInfo } from "@/data"
import Image from "next/image"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

export function HeroSection() {
  return (
    <Container className="flow-root space-y-8 py-20 md:py-28">
      <div className="relative flex gap-x-6 max-sm:flex-col max-sm:gap-y-3 sm:items-center">
        <div className="shrink-0 size-24 rounded-full bg-foreground/10 p-1.5 ring-1 ring-border ring-inset sm:size-28">
          <div className="relative size-full overflow-hidden rounded-full">
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.name}
              fill
              loading="lazy"
              decoding="sync"
              className="size-full object-cover shadow-xl ring-1 ring-border"
            />
          </div>
        </div>

        <div className="w-full">
          <h1 className="text-2xl/relaxed font-medium text-primary">
            {personalInfo.name}
          </h1>
          <p className="text-muted-foreground">{personalInfo.role}</p>
        </div>

        <div className="absolute top-0 right-0 flex items-center gap-x-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
          </span>
          <p className="text-sm/6 text-accent-foreground">Available for Work</p>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <h2 className="text-3xl/snug font-medium text-primary md:text-4xl/snug">
          {personalInfo.headline}
        </h2>
        <p className="max-sm:text-sm/6 leading-7 text-muted-foreground">
          {personalInfo.subheadline}
        </p>
      </div>

      <div className="flex gap-y-3 gap-x-4 max-sm:flex-col">
        <Link
          href="/#case-studies"
          className={cn(
            buttonVariants({ size: "lg" }),
            "rounded-xl px-4 py-5.5"
          )}
        >
          See my Projects
        </Link>
        <Link
          href="/#connect"
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "rounded-xl px-4 py-5.5"
          )}
        >
          Let&apos;s Connect
        </Link>
      </div>
    </Container>
  )
}
