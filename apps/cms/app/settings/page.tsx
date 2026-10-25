import { Metadata } from "next"
import { CmsPageShell } from "@/components/cms-page-shell"
import {
  getSiteSettings,
  getProfileSettings,
} from "@/lib/actions/settings-actions"
import { SettingsManagerClient } from "@/components/settings/settings-manager-client"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Settings & System Health",
  description:
    "Pusat konfigurasi parameter global situs, profil pemilik, keamanan, diagnostik server, dan revalidasi cache ISR.",
}

export default async function SettingsPage() {
  const [generalSettings, profileSettings] = await Promise.all([
    getSiteSettings("general"),
    getProfileSettings(),
  ])

  const generalJson =
    (generalSettings?.valueJson as Record<string, unknown>) || {}

  const initialGeneral = {
    siteName:
      typeof generalJson.siteName === "string"
        ? generalJson.siteName
        : "Rizfolio",
    siteUrl:
      typeof generalJson.siteUrl === "string"
        ? generalJson.siteUrl
        : "https://rizkyramadhan.dev",
    contactEmail:
      typeof generalJson.contactEmail === "string"
        ? generalJson.contactEmail
        : "contact@rizkyramadhan.dev",
    defaultMetaDesc:
      typeof generalJson.defaultMetaDesc === "string"
        ? generalJson.defaultMetaDesc
        : "Personal platform, digital shop, technical blog, and engineering ecosystem of Rizky Ramadhan.",
    defaultOgImage:
      typeof generalJson.defaultOgImage === "string"
        ? generalJson.defaultOgImage
        : "https://rizkyramadhan.dev/og.png",
    twitterHandle:
      typeof generalJson.twitterHandle === "string"
        ? generalJson.twitterHandle
        : "@ryzmdn",
    maintenanceMode: Boolean(generalJson.maintenanceMode),
  }

  return (
    <CmsPageShell
      title="Settings & System Health"
      description="Konfigurasi parameter global situs, profil pemilik, keamanan kata sandi, diagnostik performa server, dan sinkronisasi cache ISR."
    >
      <SettingsManagerClient
        initialProfile={profileSettings}
        initialGeneral={initialGeneral}
      />
    </CmsPageShell>
  )
}
