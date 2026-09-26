import { Container } from "@workspace/ui/components/layouts/container"
import { getChangelogReleases, getChangelogStats } from "@/lib/queries"
import { TimelineExplorer } from "@/components"

export const revalidate = 3600

const baseUrl =
  process.env.NEXT_PUBLIC_CHANGELOG_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://changelog.rizkyramadhan.dev"

export default async function ChangelogPage() {
  const [releases, stats] = await Promise.all([
    getChangelogReleases(),
    getChangelogStats(),
  ])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Rizfolio Changelog & Dev Log",
    description:
      "A continuous timeline of architectural milestones, feature additions, performance tunings, and version releases across the monorepo ecosystem.",
    url: baseUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: releases.map((release, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${release.version}: ${release.title}`,
        url: `${baseUrl}/release/${release.version}`,
      })),
    },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://rizkyramadhan.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Changelog",
        item: baseUrl,
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
        <TimelineExplorer initialReleases={releases} stats={stats} />
      </Container>
    </>
  )
}
