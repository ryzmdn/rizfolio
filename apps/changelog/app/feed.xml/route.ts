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

  const entriesXml = releases
    .map((release) => {
      const releaseUrl = `${baseUrl}/release/${release.version}`
      const formattedDate = new Date(release.createdAt).toISOString()
      const itemsList = release.items
        .map((item) => `[${item.category}] ${item.description}`)
        .join("\n")

      const fullContent = release.summary
        ? `${release.summary}\n\nKey Updates:\n${itemsList}`
        : itemsList

      return `  <entry>
    <title>[${release.version}] ${escapeXml(release.title)}</title>
    <link href="${releaseUrl}"/>
    <id>${releaseUrl}</id>
    <updated>${formattedDate}</updated>
    <summary>${escapeXml(release.summary || release.title)}</summary>
    <content type="text">${escapeXml(fullContent)}</content>
    <author>
      <name>Rizky Ramadhan</name>
      <uri>https://rizkyramadhan.dev</uri>
    </author>
  </entry>`
    })
    .join("\n")

  const atomXml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Rizfolio Changelog</title>
  <subtitle>Continuous timeline of architectural milestones, feature additions, performance tunings, and version releases across the Rizfolio monorepo.</subtitle>
  <link href="${baseUrl}"/>
  <link href="${baseUrl}/feed.xml" rel="self"/>
  <updated>${new Date().toISOString()}</updated>
  <id>${baseUrl}/</id>
  <author>
    <name>Rizky Ramadhan</name>
    <uri>https://rizkyramadhan.dev</uri>
  </author>
${entriesXml}
</feed>`

  return new NextResponse(atomXml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
