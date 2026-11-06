import Image from "next/image"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { Mail, ArrowUpRight, Sparkles } from "lucide-react"
import { db } from "@workspace/db"
import { profile } from "@workspace/db/schema"
import { unstable_cache } from "next/cache"
import { getDynamicBioLinks } from "@/lib/queries"
import { BioLinkCard } from "@/components/bio-link-card"

export const revalidate = 60

const SOCIAL_CHANNELS = [
  { name: "GITHUB", href: "https://github.com/ryzmdn" },
  { name: "LINKEDIN", href: "https://linkedin.com/in/ryzmdn" },
  { name: "BEHANCE", href: "https://behance.net/ryzmdn" },
  { name: "DRIBBBLE", href: "https://dribbble.com/ryzmdn" },
  { name: "X (TWITTER)", href: "https://twitter.com/ryzmdn" },
  { name: "INSTAGRAM", href: "https://instagram.com/ryzmdn" },
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
  const headline =
    profileData?.headline || "Lead Software Architect & Systems Engineering Consultant"
  const bio =
    profileData?.bio ||
    "Architecting high-throughput distributed applications, resilient commerce infrastructure, and timeless minimal design systems across the modern web."
  const avatarUrl =
    socialLinks?.avatarUrl ||
    "https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"

  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@rizkyramadhan.dev"

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen flex-col justify-between bg-background px-5 py-12 outline-none sm:px-6 sm:py-20"
    >
      <div className="mx-auto w-full max-w-lg space-y-12">
        <div className="flex items-center justify-between border-b border-foreground/6 pb-5">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            <Sparkles className="size-3 text-foreground" />
            <span>DIGITAL MONOLITH v2.4</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="space-y-6 text-center sm:text-left">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-foreground/15 bg-foreground/5 shadow-2xl transition-transform duration-500 hover:scale-[1.03] sm:size-28">
              <Image
                src={avatarUrl}
                alt={name}
                fill
                priority
                sizes="112px"
                className="size-full object-cover grayscale contrast-125 transition-all duration-700 hover:grayscale-0"
              />
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                EXECUTIVE IDENTITY
              </span>
              <h1 className="text-2xl font-light tracking-tight text-foreground sm:text-3xl">
                {name}
              </h1>
              <p className="font-mono text-xs text-muted-foreground">
                {headline}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.02] px-3.5 py-1 text-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] tracking-wider text-foreground/80 uppercase">
              Available for Advisory &amp; High-Impact Contracts
            </span>
          </div>

          <p className="text-xs font-light leading-relaxed text-muted-foreground sm:text-sm">
            {bio}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-foreground/6 pb-3">
            <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
              [ 01 / ECOSYSTEM DIRECTORY ]
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/60 uppercase">
              {dynamicLinks.length} NODES
            </span>
          </div>

          <div className="space-y-3">
            {dynamicLinks.map((link, idx) => (
              <BioLinkCard key={link.id} link={link} index={idx} />
            ))}
          </div>
        </div>

        <div className="space-y-4 border-t border-foreground/6 pt-8">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
              [ 02 / DIRECT CHANNELS ]
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/60 uppercase">
              GLOBAL REACH
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 font-mono text-[11px] tracking-wider text-muted-foreground">
            {SOCIAL_CHANNELS.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 transition-colors hover:text-foreground"
              >
                <span>{channel.name}</span>
                <ArrowUpRight className="size-2.5 opacity-40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </a>
            ))}
          </div>

          <div className="pt-2">
            <a
              href={`mailto:${contactEmail}`}
              className="group flex w-full items-center justify-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.02] py-3.5 font-mono text-xs tracking-widest text-foreground uppercase transition-all duration-300 hover:border-foreground/40 hover:bg-foreground hover:text-background"
            >
              <Mail className="size-3.5" />
              <span>Inquire via Encrypted Email</span>
              <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <footer className="border-t border-foreground/6 pt-6 text-center font-mono text-[10px] tracking-widest text-muted-foreground/60 uppercase">
          <p>
            Rizfolio Architecture &bull; Jakarta (UTC+7) &bull; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  )
}
