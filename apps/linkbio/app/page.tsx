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
  Phone,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"

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
    <>
      <div className="mx-auto max-w-xl py-10">
        <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-60 lg:h-64">
          <Image
            src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1775372259/samples/animals/three-dogs.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:gap-x-5">
            <div className="relative flex size-24 shrink-0 overflow-hidden rounded-full ring-4 ring-background sm:size-32">
              <Image
                src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-6 flex w-full flex-col justify-end gap-y-3 sm:flex-row sm:gap-x-4 sm:gap-y-0">
              <Button>
                <Mail data-icon="inline-start" /> New Branch
              </Button>
              <Button variant="outline">
                <Phone data-icon="inline-start" /> New Branch
              </Button>
            </div>
          </div>
          <div className="mt-6 flex-1">
            <h1 className="scroll-m-20 truncate text-2xl font-bold text-primary lg:text-3xl">
              Rizky Ramadhan
            </h1>
            <p className="mt-1 mb-3 leading-7 text-secondary-foreground lg:text-lg">
              I&apos;m a Software Engineer
            </p>
            <p className="leading-7 text-muted-foreground">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque
              natus odio saepe veritatis ex fugiat, molestiae aperiam,
              doloremque magnam porro non vero obcaecati distinctio commodi at
              corporis, voluptate ab facere?
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
