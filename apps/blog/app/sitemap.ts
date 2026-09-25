import type { MetadataRoute } from "next"
import { getPublishedPosts, getCategoriesWithCount } from "@/lib/queries"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BLOG_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rizkyramadhan.dev/blog"

  const [{ posts }, categories] = await Promise.all([
    getPublishedPosts({ limit: 100 }),
    getCategoriesWithCount(),
  ])

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categoryEntries,
    ...postEntries,
  ]
}
