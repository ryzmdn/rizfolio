import { Container } from "@workspace/ui/components/layouts/container"
import { getChangelogReleases, getChangelogStats } from "@/lib/queries"
import { TimelineExplorer } from "@/components"
import {
  SEO_CONFIG,
  getBaseUrl,
  createWebSiteJsonLd,
} from "@workspace/ui/lib/seo"

export const revalidate = 3600

export default async function ChangelogPage() {
  const baseUrl = getBaseUrl("changelog")
  const [releases, stats] = await Promise.all([
    getChangelogReleases(),
    getChangelogStats(),
  ])

  const websiteLd = createWebSiteJsonLd({
    siteKey: "changelog",
    url: baseUrl,
  })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SEO_CONFIG.sites.changelog.name,
    description: SEO_CONFIG.sites.changelog.description,
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
        item: SEO_CONFIG.sites.main.url,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
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
