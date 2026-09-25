import { NextResponse } from "next/server"
import { getChangelogReleases } from "../../lib/queries"

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_CHANGELOG_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://changelog.rizkyramadhan.dev"

  const releases = await getChangelogReleases()

  const itemsXml = releases
    .map((release) => {
      const releaseUrl = `${baseUrl}/release/${release.version}`
      const formattedDate = new Date(release.createdAt).toUTCString()
      const itemsList = release.items
        .map((item) => `[${item.category}] ${item.description}`)
        .join("\n")

      const fullDescription = release.summary
        ? `${release.summary}\n\nKey Updates:\n${itemsList}`
        : itemsList

      return `    <item>
      <title>[${release.version}] ${escapeXml(release.title)}</title>
      <link>${releaseUrl}</link>
      <guid isPermaLink="true">${releaseUrl}</guid>
      <pubDate>${formattedDate}</pubDate>
      <description>${escapeXml(fullDescription)}</description>
    </item>`
    })
    .join("\n")

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rizfolio Changelog</title>
    <link>${baseUrl}</link>
    <description>Continuous timeline of architectural milestones, feature additions, performance tunings, and version releases across the Rizfolio monorepo.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
