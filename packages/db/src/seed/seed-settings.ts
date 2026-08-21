import { db, siteSettings } from "../index"

export async function seedSettings() {
  console.log("Seeding Site Settings...")

  await db.delete(siteSettings)
  await db.insert(siteSettings).values([
    {
      key: "site_metadata",
      valueJson: {
        siteName: "Rizfolio Ecosystem",
        ownerName: "Rizky Ramadhan",
        title: "Rizky Ramadhan — Full-Stack Engineer & Architect",
        description:
          "Personal multi-app ecosystem powering portfolio, technical blog, digital store, dev changelog, and open-source archive.",
        baseUrl: "https://rizkyramadhan.dev",
      },
      description: "Global site metadata and default OpenGraph configurations.",
    },
    {
      key: "feature_flags",
      valueJson: {
        enableBlogComments: false,
        enableDirectDownloads: true,
        enableShopCheckout: true,
        enableArchiveViewer: true,
      },
      description: "System-wide feature flags toggleable via CMS Settings.",
    },
  ])

  console.log("Site Settings Seeded Successfully.")
}
