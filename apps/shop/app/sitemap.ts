import type { MetadataRoute } from "next"
import { getActiveProducts } from "@/lib/queries"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SHOP_URL ||
    process.env.NEXT_PUBLIC_APP_URL

  const products = await getActiveProducts()

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.createdAt ? new Date(product.createdAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl!,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...productEntries,
  ]
}
