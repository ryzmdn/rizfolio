import ChangelogPage, { revalidate } from "../page"
import type { Metadata } from "next"
import { getBaseUrl, SEO_CONFIG } from "@workspace/ui/lib/seo"

export { revalidate }

const baseUrl = getBaseUrl("changelog")
const pageUrl = `${baseUrl}/release`

export const metadata: Metadata = {
  title: `Release History & Monorepo Changelog | ${SEO_CONFIG.author.name}`,
  description:
    "Chronological ledger of release milestones, architecture updates, performance optimizations, and breaking changes across the ecosystem.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `Release History & Monorepo Changelog | ${SEO_CONFIG.author.name}`,
    description:
      "Chronological ledger of release milestones, architecture updates, and performance optimizations across the ecosystem.",
    type: "website",
    url: pageUrl,
    images: [{ url: SEO_CONFIG.author.avatar, alt: SEO_CONFIG.author.name }],
  },
}

export default ChangelogPage
