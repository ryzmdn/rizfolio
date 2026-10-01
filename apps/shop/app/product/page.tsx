import ShopHomePage from "../page"
import type { Metadata } from "next"
import { getBaseUrl, SEO_CONFIG } from "@workspace/ui/lib/seo"

export const revalidate = 3600

const baseUrl = getBaseUrl("shop")
const pageUrl = `${baseUrl}/product`

export const metadata: Metadata = {
  title: `Digital Architecture Catalog & Software Packages | ${SEO_CONFIG.author.name}`,
  description:
    "Browse production-ready Next.js starters, database toolkits, and software engineering architecture templates with perpetual commercial licenses.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `Digital Architecture Catalog & Software Packages | ${SEO_CONFIG.author.name}`,
    description:
      "Browse production-ready Next.js starters, database toolkits, and software engineering architecture templates.",
    type: "website",
    url: pageUrl,
    images: [{ url: SEO_CONFIG.author.avatar, alt: SEO_CONFIG.author.name }],
  },
}

export default ShopHomePage
