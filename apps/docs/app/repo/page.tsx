import DocsPage from "../page"
import type { Metadata } from "next"
import { getBaseUrl, SEO_CONFIG } from "@workspace/ui/lib/seo"

export const revalidate = 3600

const baseUrl = getBaseUrl("docs")
const pageUrl = `${baseUrl}/repo`

export const metadata: Metadata = {
  title: `Open Source Repositories & Engineering Documentation | ${SEO_CONFIG.author.name}`,
  description:
    "Explore academic source code repositories, software architecture blueprints, open source libraries, and coursework experiments.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `Open Source Repositories & Engineering Documentation | ${SEO_CONFIG.author.name}`,
    description:
      "Explore academic source code repositories, software architecture blueprints, and open source libraries.",
    type: "website",
    url: pageUrl,
    images: [{ url: SEO_CONFIG.author.avatar, alt: SEO_CONFIG.author.name }],
  },
}

export default DocsPage
