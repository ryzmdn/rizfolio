import BlogHomePage from "../page"
import type { Metadata } from "next"
import { getBaseUrl, SEO_CONFIG } from "@workspace/ui/lib/seo"

export const revalidate = 3600

const baseUrl = getBaseUrl("blog")
const pageUrl = `${baseUrl}/blog`

export const metadata: Metadata = {
  title: `All Engineering Articles | ${SEO_CONFIG.author.name}`,
  description:
    "Explore the complete index of technical publications, system architecture deep dives, database optimization strategies, and full-stack engineering guides.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `All Engineering Articles | ${SEO_CONFIG.author.name}`,
    description:
      "Explore the complete index of technical publications, system architecture deep dives, and database optimization strategies.",
    type: "website",
    url: pageUrl,
    images: [{ url: SEO_CONFIG.author.avatar, alt: SEO_CONFIG.author.name }],
  },
}

export default BlogHomePage
