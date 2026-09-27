import type { Metadata } from "next"
import { Container } from "@workspace/ui/components/layouts/container"
import { getRoadmapItems } from "@/lib/queries"
import { RoadmapView } from "@/components"
import { getBaseUrl, SEO_CONFIG } from "@workspace/ui/lib/seo"

export const revalidate = 3600

const baseUrl = getBaseUrl("changelog")
const roadmapUrl = `${baseUrl}/roadmap`

export const metadata: Metadata = {
  title: "Product Roadmap & Architecture Milestones | Rizfolio Changelog",
  description:
    "Explore shipped milestones, current engineering priorities, and future architectural initiatives across the Rizfolio monorepo ecosystem.",
  alternates: {
    canonical: roadmapUrl,
  },
  openGraph: {
    type: "website",
    title: "Product Roadmap & Architecture Milestones | Rizfolio Changelog",
    description:
      "Explore shipped milestones, current engineering priorities, and future architectural initiatives across the Rizfolio monorepo.",
    url: roadmapUrl,
    siteName: SEO_CONFIG.sites.changelog.name,
    images: [
      {
        url: SEO_CONFIG.author.avatar,
        width: 800,
        height: 800,
        alt: "Rizfolio Product Roadmap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Roadmap & Architecture Milestones | Rizfolio Changelog",
    description:
      "Explore shipped milestones, current engineering priorities, and future architectural initiatives across the Rizfolio monorepo.",
    images: [SEO_CONFIG.author.avatar],
  },
}

export default async function RoadmapPage() {
  const items = await getRoadmapItems()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Rizfolio Product Roadmap",
    description:
      "Transparent engineering timeline tracking shipped, in-progress, and planned architecture milestones.",
    url: `${baseUrl}/roadmap`,
    publisher: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Changelog",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Roadmap",
        item: `${baseUrl}/roadmap`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Container className="max-w-6xl py-10 sm:py-16">
        <RoadmapView initialItems={items} />
      </Container>
    </>
  )
}
