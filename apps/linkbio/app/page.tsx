import Image from "next/image"
import {
  GitHub,
  LinkedIn,
  Behance,
  Dribbble,
  Twitter,
  Instagram,
} from "@workspace/ui/constants/icons"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import {
  Mail,
} from "lucide-react"
import { db } from "@workspace/db"
import { profile } from "@workspace/db/schema"
import { unstable_cache } from "next/cache"

import { getDynamicBioLinks } from "@/lib/queries"
import { BioLinkCard } from "@/components/bio-link-card"

export const revalidate = 60

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com/ryzmdn",
    icon: GitHub,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/ryzmdn",
    icon: LinkedIn,
  },
  {
    name: "Behance",
    href: "https://behance.net/ryzmdn",
    icon: Behance,
  },
  {
    name: "Dribbble",
    href: "https://dribbble.com/ryzmdn",
    icon: Dribbble,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/ryzmdn",
    icon: Twitter,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/ryzmdn",
    icon: Instagram,
  },
]

const getBioProfile = unstable_cache(
  async () => {
    try {
      const [data] = await db
        .select({
          fullName: profile.fullName,
          headline: profile.headline,
          bio: profile.bio,
          socialLinks: profile.socialLinks,
        })
        .from(profile)
        .limit(1)
      return data || null
    } catch {
      return null
    }
  },
  ["linkbio-profile-data"],
  {
    revalidate: 3600,
    tags: ["linkbio", "portfolio"],
  }
)

export default async function LinkBioPage() {
  const [profileData, dynamicLinks] = await Promise.all([
    getBioProfile(),
    getDynamicBioLinks(),
  ])

  const socialLinks =
    (profileData?.socialLinks as Record<string, string> | null) || {}
  const name = profileData?.fullName || "Rizky Ramadhan"
  const headline = profileData?.headline || "Software Engineer & System Architect"
  const bio =
    profileData?.bio ||
    "Building scalable web applications, open-source development tools, and performant design systems across the modern web ecosystem."
  const avatarUrl =
    socialLinks?.avatarUrl ||
    "https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background py-10 px-4 sm:px-6 outline-none">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="relative h-44 w-full overflow-hidden rounded-2xl sm:h-52 bg-linear-to-tr from-muted via-card to-secondary border border-border/80 shadow-xs">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div>
        </div>

        <div className="relative -mt-16 sm:-mt-20 px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-full ring-4 ring-background shadow-lg bg-card">
              <Image
                src={avatarUrl}
                alt={name}
                fill
                priority
                sizes="(max-width: 640px) 96px, 112px"
                className="object-cover"
              />
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@rizkyramadhan.dev"}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
              >
                <Mail className="size-3.5" />
                <span>Contact Email</span>
              </a>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{headline}</p>
            <p className="text-xs leading-relaxed text-muted-foreground/90 pt-1">
              {bio}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card/60 p-2.5 backdrop-blur-xs">
          {SOCIAL_LINKS.map((soc) => {
            const Icon = soc.icon
            return (
              <a
                key={soc.name}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                title={soc.name}
                className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            )
          })}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Monorepo Ecosystem &amp; Resources
            </span>
            <span className="font-mono text-[11px] text-muted-foreground/60">
              {dynamicLinks.length} Active Links
            </span>
          </div>

          <div className="space-y-2.5">
            {dynamicLinks.map((link) => (
              <BioLinkCard key={link.id} link={link} />
            ))}
          </div>
        </div>

        <footer className="pt-6 pb-12 text-center">
          <p className="font-mono text-[11px] text-muted-foreground/70">
            Powered by Rizfolio Dynamic Architecture &bull; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  )
}
