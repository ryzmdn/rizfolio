import type { MetadataRoute } from "next"
import { getPublishedPosts } from "@/lib/queries"
import { getBaseUrl } from "@workspace/ui/lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl("blog")

  const { posts } = await getPublishedPosts({ limit: 100 })

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
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
    ...postEntries,
  ]
}
