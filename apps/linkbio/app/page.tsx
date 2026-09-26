import Image from "next/image"
import Link from "next/link"
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
  Globe,
  FileText,
  ShoppingBag,
  BookOpen,
  History,
  Mail,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { db } from "@workspace/db"
import { profile } from "@workspace/db/schema"
import { unstable_cache } from "next/cache"

export const revalidate = 3600

const portfolioUrl =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"
const blogUrl =
  process.env.NEXT_PUBLIC_BLOG_URL || "https://blog.rizkyramadhan.dev"
const shopUrl =
  process.env.NEXT_PUBLIC_SHOP_URL || "https://shop.rizkyramadhan.dev"
const docsUrl =
  process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.rizkyramadhan.dev"
const changelogUrl =
  process.env.NEXT_PUBLIC_CHANGELOG_URL || "https://changelog.rizkyramadhan.dev"

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

const ECOSYSTEM_LINKS = [
  {
    title: "Personal Portfolio",
    description: "Full case studies, career journey, and technical solutions",
    href: portfolioUrl,
    icon: Globe,
    badge: "Main",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
  {
    title: "Engineering Blog",
    description: "Deep dives on full-stack architecture, Next.js, and scaling",
    href: blogUrl,
    icon: FileText,
    badge: "Articles",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    title: "Digital Store & UI Kits",
    description: "Production boilerplates, UI templates, and dev tools",
    href: shopUrl,
    icon: ShoppingBag,
    badge: "Shop",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    title: "Documentation & Code Explorer",
    description: "Open-source repositories, experiments, and tech docs",
    href: docsUrl,
    icon: BookOpen,
    badge: "Docs",
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  {
    title: "Ecosystem Changelog",
    description: "Release notes, system updates, and milestone tracking",
    href: changelogUrl,
    icon: History,
    badge: "Updates",
    badgeColor: "bg-muted text-muted-foreground border-border",
  },
]

const getBioProfile = unstable_cache(
  async () => {
    try {
      const [data] = await db.select().from(profile).limit(1)
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
  const profileData = await getBioProfile()

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
    <main className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-xl space-y-8">
        {/* Cover Banner */}
        <div className="relative h-44 w-full overflow-hidden rounded-2xl sm:h-52 bg-gradient-to-tr from-muted via-card to-secondary border border-border/80 shadow-xs">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="relative -mt-16 sm:-mt-20 px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-full ring-4 ring-background shadow-lg bg-card">
              <Image
                src={avatarUrl}
                alt={name}
                fill
                priority
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

        {/* Social Links Bar */}
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

        {/* Ecosystem Applications List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Monorepo Ecosystem
            </span>
            <span className="font-mono text-[11px] text-muted-foreground/60">
              5 Live Apps
            </span>
          </div>

          <div className="space-y-2.5">
            {ECOSYSTEM_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 transition-all hover:border-foreground/30 hover:bg-card/90 hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted/30 text-foreground transition-colors group-hover:border-foreground/30">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {link.title}
                        </span>
                        <span
                          className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-medium ${link.badgeColor}`}
                        >
                          {link.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground shrink-0" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 pb-12 text-center">
          <p className="font-mono text-[11px] text-muted-foreground/70">
            Powered by Rizfolio Dynamic Architecture &bull; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  )
}
