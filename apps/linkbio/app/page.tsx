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
    description: "Full case studies, career journey, and solutions",
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
    badgeColor: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  },
  {
    title: "Digital Store & UI Kits",
    description: "Production boilerplates, UI templates, and dev tools",
    href: shopUrl,
    icon: ShoppingBag,
    badge: "Shop",
    badgeColor: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  {
    title: "Documentation & Code Explorer",
    description: "Open-source repositories, experiments, and tech docs",
    href: docsUrl,
    icon: BookOpen,
    badge: "Docs",
    badgeColor: "bg-chart-4/10 text-chart-4 border-chart-4/20",
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

export default function LinkBioPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background p-4 text-foreground selection:bg-primary/20 selection:text-foreground sm:p-6">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-muted/40 blur-3xl" />
      </div>

      <div className="w-full max-w-lg space-y-6 pt-6 sm:pt-10">
        {/* Profile Card Header */}
        <section className="flex flex-col items-center space-y-4 text-center">
          <div className="relative">
            <div className="relative size-24 overflow-hidden rounded-full border-2 border-border/80 bg-muted shadow-md sm:size-28">
              <Image
                src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                alt="Rizky Ramadhan"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 96px, 112px"
              />
            </div>
            <div className="absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full bg-background shadow-xs">
              <span className="size-3 animate-pulse rounded-full bg-success ring-2 ring-background" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-xs">
              <Sparkles className="size-3 text-primary" />
              <span>Available for New Projects</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Rizky Ramadhan
            </h1>
            <p className="max-w-sm text-xs font-medium text-muted-foreground sm:text-sm">
              Full-Stack Engineer & Product Manager based in Jakarta (GMT+7).
            </p>
          </div>

          {/* Social Icons Bar */}
          <div className="flex items-center gap-2 pt-1">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card/60 text-muted-foreground transition-all hover:scale-105 hover:border-foreground/30 hover:bg-muted/50 hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              )
            })}
            <a
              href="mailto:hello@rizkyramadhan.dev"
              aria-label="Email Me"
              className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card/60 text-muted-foreground transition-all hover:scale-105 hover:border-foreground/30 hover:bg-muted/50 hover:text-foreground"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </section>

        {/* Links Section */}
        <section className="space-y-3 pt-2">
          {ECOSYSTEM_LINKS.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md active:translate-y-0"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60 text-foreground transition-colors group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </a>
            )
          })}
        </section>

        {/* Contact CTA Box */}
        <section className="space-y-2 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Have a project or opportunity in mind?
          </p>
          <a
            href="mailto:hello@rizkyramadhan.dev"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
          >
            <Mail className="size-3.5" />
            <span>Send Direct Message</span>
          </a>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-8 flex w-full max-w-lg items-center justify-between border-t border-border/60 pt-6 pb-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Link href={portfolioUrl} className="font-mono hover:underline">
            rizkyramadhan.dev
          </Link>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle className="size-8 rounded-lg border border-border/70" />
        </div>
      </footer>
    </main>
  )
}
