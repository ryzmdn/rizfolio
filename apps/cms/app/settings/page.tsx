import { CmsPageShell } from "../../components/cms-page-shell"
import { RevalidationButton } from "../../components/revalidation-button"
import {
  getSiteSettings,
  updateSiteSettings,
} from "../../lib/actions/settings-actions"
import { Settings, RefreshCw } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const settings = await getSiteSettings("general")
  const valueJson =
    (settings?.valueJson as Record<string, string | boolean>) || {}

  const siteName =
    typeof valueJson.siteName === "string" ? valueJson.siteName : "Rizfolio"
  const siteUrl =
    typeof valueJson.siteUrl === "string"
      ? valueJson.siteUrl
      : "https://ryzmdn.dev"
  const contactEmail =
    typeof valueJson.contactEmail === "string"
      ? valueJson.contactEmail
      : "contact@ryzmdn.dev"
  const maintenanceMode = Boolean(valueJson.maintenanceMode)

  return (
    <CmsPageShell
      title="Settings & System Cache"
      description="Konfigurasi parameter global situs, otentikasi, dan revalidasi cache ISR."
    >
      <div className="space-y-8">
        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              On-Demand ISR Revalidation
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Perbarui cache halaman statis di aplikasi konsumen (
            <code className="font-mono text-foreground">portfolio</code>,{" "}
            <code className="font-mono text-foreground">blog</code>,{" "}
            <code className="font-mono text-foreground">shop</code>,{" "}
            <code className="font-mono text-foreground">docs</code>,{" "}
            <code className="font-mono text-foreground">changelog</code>) secara
            instan tanpa perlu rebuild ulang monorepo.
          </p>
          <div className="pt-2">
            <RevalidationButton />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Konfigurasi Situs Global
            </h2>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server"
              const siteName =
                formData.get("siteName")?.toString() || "Rizfolio"
              const siteUrl =
                formData.get("siteUrl")?.toString() || "https://ryzmdn.dev"
              const contactEmail =
                formData.get("contactEmail")?.toString() || "contact@ryzmdn.dev"
              const maintenanceMode = formData.get("maintenanceMode") === "true"

              await updateSiteSettings(
                "general",
                {
                  siteName,
                  siteUrl,
                  contactEmail,
                  maintenanceMode,
                },
                "Pengaturan umum website rizfolio"
              )
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Nama Website
                </label>
                <input
                  name="siteName"
                  defaultValue={siteName}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  URL Domain Produksi
                </label>
                <input
                  name="siteUrl"
                  defaultValue={siteUrl}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Email Kontak
                </label>
                <input
                  name="contactEmail"
                  defaultValue={contactEmail}
                  type="email"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Status Pemeliharaan (Maintenance)
                </label>
                <select
                  name="maintenanceMode"
                  defaultValue={maintenanceMode ? "true" : "false"}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="false">Normal (Live)</option>
                  <option value="true">Maintenance Mode</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Simpan Pengaturan
            </button>
          </form>
        </div>
      </div>
    </CmsPageShell>
  )
}
