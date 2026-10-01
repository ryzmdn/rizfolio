import { db } from "@workspace/db"
import { bioLinks, type BioLink } from "@workspace/db/schema"
import { asc, eq } from "@workspace/db"
import { getBaseUrl } from "@workspace/ui/lib/seo"

const portfolioUrl = getBaseUrl("portfolio")
const blogUrl = getBaseUrl("blog")
const shopUrl = getBaseUrl("shop")
const docsUrl = getBaseUrl("docs")
const changelogUrl = getBaseUrl("changelog")

export const DEFAULT_BIO_LINKS: Omit<
  BioLink,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    title: "Personal Portfolio & Architecture",
    description: "Full case studies, career journey, and technical solutions",
    url: portfolioUrl,
    icon: "Globe",
    badge: "Main",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    category: "ECOSYSTEM",
    isActive: true,
    displayOrder: 1,
    clickCount: 128,
  },
  {
    title: "Engineering Blog",
    description: "Deep dives on full-stack architecture, Next.js, and scaling",
    url: blogUrl,
    icon: "FileText",
    badge: "Articles",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    category: "ECOSYSTEM",
    isActive: true,
    displayOrder: 2,
    clickCount: 94,
  },
  {
    title: "Digital Store & UI Kits",
    description: "Production boilerplates, UI templates, and dev tools",
    url: shopUrl,
    icon: "ShoppingBag",
    badge: "Shop",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    category: "ECOSYSTEM",
    isActive: true,
    displayOrder: 3,
    clickCount: 76,
  },
  {
    title: "Documentation & Code Explorer",
    description: "Open-source repositories, experiments, and tech docs",
    url: docsUrl,
    icon: "BookOpen",
    badge: "Docs",
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    category: "ECOSYSTEM",
    isActive: true,
    displayOrder: 4,
    clickCount: 52,
  },
  {
    title: "Ecosystem Changelog",
    description: "Release notes, system updates, and milestone tracking",
    url: changelogUrl,
    icon: "History",
    badge: "Updates",
    badgeColor: "bg-muted text-muted-foreground border-border",
    category: "ECOSYSTEM",
    isActive: true,
    displayOrder: 5,
    clickCount: 41,
  },
]

export async function getDynamicBioLinks(): Promise<BioLink[]> {
  try {
    const rows = await db
      .select()
      .from(bioLinks)
      .where(eq(bioLinks.isActive, true))
      .orderBy(asc(bioLinks.displayOrder))

    if (rows && rows.length > 0) {
      return rows
    }
  } catch (error) {
    console.warn(
      "[Linkbio Queries] DB unavailable, falling back to default ecosystem links:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  // Generate fallback with mock IDs for rendering
  return DEFAULT_BIO_LINKS.map((link, idx) => ({
    ...link,
    id: `default-${idx + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}
