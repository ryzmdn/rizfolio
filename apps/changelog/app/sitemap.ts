import type { MetadataRoute } from "next"
import { getChangelogReleases } from "@/lib/queries"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_CHANGELOG_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://changelog.rizkyramadhan.dev"

  const releases = await getChangelogReleases()

  const releaseEntries: MetadataRoute.Sitemap = releases.map((release) => ({
    url: `${baseUrl}/release/${release.version}`,
    lastModified: new Date(release.createdAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/roadmap`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...releaseEntries,
  ]
}
