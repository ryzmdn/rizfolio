import type { Metadata } from "next"
import { Container } from "@workspace/ui/components/layouts/container"
import { getRoadmapItems } from "@/lib/queries"
import { RoadmapView } from "@/components"

export const revalidate = 3600

const baseUrl =
  process.env.NEXT_PUBLIC_CHANGELOG_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://changelog.rizkyramadhan.dev"

export const metadata: Metadata = {
  title: "Product Roadmap & Architecture Milestones",
  description:
    "Explore shipped milestones, current engineering priorities, and future architectural initiatives across the Rizfolio monorepo ecosystem.",
  openGraph: {
    type: "website",
    title: "Product Roadmap & Architecture Milestones: Rizfolio",
    description:
      "Explore shipped milestones, current engineering priorities, and future architectural initiatives across the Rizfolio monorepo.",
    url: `${baseUrl}/roadmap`,
    siteName: "Rizfolio Changelog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Roadmap & Architecture Milestones: Rizfolio",
    description:
      "Explore shipped milestones, current engineering priorities, and future architectural initiatives across the Rizfolio monorepo.",
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
      name: "Rizky Ramadhan",
      url: "https://rizkyramadhan.dev",
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
