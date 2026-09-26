import type { MetadataRoute } from "next"
import { getRepositories, getAllRepoFilePaths } from "../lib/queries"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_DOCS_URL ||
    process.env.NEXT_PUBLIC_ARCHIVE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://docs.rizkyramadhan.dev"

  const repos = await getRepositories({ limit: 100 })

  const repoEntries: MetadataRoute.Sitemap = repos.map((repo) => ({
    url: `${baseUrl}/repo/${repo.slug}`,
    lastModified: repo.updatedAt ? new Date(repo.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const repoFilePaths = await Promise.all(
    repos.map(async (repo) => {
      const filePaths = await getAllRepoFilePaths(repo.slug)
      return { repo, filePaths }
    })
  )

  const blobEntries: MetadataRoute.Sitemap = []
  for (const { repo, filePaths } of repoFilePaths) {
    for (const fp of filePaths) {
      blobEntries.push({
        url: `${baseUrl}/repo/${repo.slug}/blob/${fp}`,
        lastModified: repo.updatedAt ? new Date(repo.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      })
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...repoEntries,
    ...blobEntries,
  ]
}
