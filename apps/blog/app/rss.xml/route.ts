import { getPublishedPosts } from "@/lib/queries"

export const dynamic = "force-static"
export const revalidate = 3600

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BLOG_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rizkyramadhan.dev/blog"

  const { posts } = await getPublishedPosts({ limit: 100 })

  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;"
        case ">":
          return "&gt;"
        case "&":
          return "&amp;"
        case "'":
          return "&apos;"
        case '"':
          return "&quot;"
        default:
          return c
      }
    })
  }

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString()
      const category = post.categories[0]?.name || "Technology"

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(category)}</category>
      <author>hello@rizkyramadhan.dev (Rizky Ramadhan)</author>
    </item>`
    })
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rizky Ramadhan — Engineering Blog</title>
    <link>${baseUrl}</link>
    <description>Articles, architecture, and notes on modern full-stack systems, monorepos, and UI engineering.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
