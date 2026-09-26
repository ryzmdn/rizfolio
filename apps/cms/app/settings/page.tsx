import { Settings, RefreshCw } from "lucide-react"
import { CmsPageShell } from "@/components/cms-page-shell"
import { RevalidationButton } from "@/components/revalidation-button"
import { FormSubmitButton } from "@/components/form-submit-button"
import { SystemHealthDiagnostics } from "@/components/settings/system-health-diagnostics"
import {
  getSiteSettings,
  updateSiteSettings,
} from "@/lib/actions/settings-actions"

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
      : "https://rizkyramadhan.dev"
  const contactEmail =
    typeof valueJson.contactEmail === "string"
      ? valueJson.contactEmail
      : "contact@rizkyramadhan.dev"
  const maintenanceMode = Boolean(valueJson.maintenanceMode)

  return (
    <CmsPageShell
      title="Settings & System Health"
      description="Konfigurasi parameter global situs, otentikasi, diagnostik server, dan revalidasi cache ISR."
    >
      <div className="space-y-10">
        {/* On-Demand ISR Revalidation Panel */}
        <section className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs backdrop-blur-xs sm:p-8">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-4">
            <div className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground">
              <RefreshCw className="size-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-foreground uppercase text-muted-foreground/80">
                On-Demand ISR Cache Revalidation
              </h2>
              <p className="text-xs text-muted-foreground">
                Sinkronisasi data instan ke seluruh platform monorepo tanpa build ulang.
              </p>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Perbarui cache halaman statis di aplikasi konsumen (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">portfolio</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">blog</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">shop</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">docs</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">changelog</code>) secara
            otomatis dan instan.
          </p>

          <div className="pt-2">
            <RevalidationButton />
          </div>
        </section>

        {/* Global Site Parameters */}
        <section className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs backdrop-blur-xs sm:p-8">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-4">
            <div className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground">
              <Settings className="size-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-foreground uppercase text-muted-foreground/80">
                Konfigurasi Situs Global
              </h2>
              <p className="text-xs text-muted-foreground">
                Metadata identitas, domain produksi, dan status operasional publik.
              </p>
            </div>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server"
              const name = formData.get("siteName")?.toString() || "Rizfolio"
              const url =
                formData.get("siteUrl")?.toString() || "https://rizkyramadhan.dev"
              const email =
                formData.get("contactEmail")?.toString() || "contact@rizkyramadhan.dev"
              const isMaintenance = formData.get("maintenanceMode") === "true"

              await updateSiteSettings(
                "general",
                {
                  siteName: name,
                  siteUrl: url,
                  contactEmail: email,
                  maintenanceMode: isMaintenance,
                },
                "Pengaturan umum website rizfolio"
              )
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Ekosistem Website
                </label>
                <input
                  name="siteName"
                  defaultValue={siteName}
                  required
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-foreground/30 focus:outline-hidden focus:ring-2 focus:ring-primary/20 sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  URL Domain Produksi
                </label>
                <input
                  name="siteUrl"
                  defaultValue={siteUrl}
                  required
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-foreground/30 focus:outline-hidden focus:ring-2 focus:ring-primary/20 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Email Kontak Administratif
                </label>
                <input
                  name="contactEmail"
                  defaultValue={contactEmail}
                  type="email"
                  required
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-foreground/30 focus:outline-hidden focus:ring-2 focus:ring-primary/20 sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Status Operasional
                </label>
                <select
                  name="maintenanceMode"
                  defaultValue={maintenanceMode ? "true" : "false"}
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:outline-hidden focus:ring-2 focus:ring-primary/20 sm:text-sm"
                >
                  <option value="false">Live (Operasional Normal)</option>
                  <option value="true">Maintenance Mode (Perawatan Sistem)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <FormSubmitButton
                icon="save"
                pendingLabel="Menyimpan konfigurasi..."
              >
                Simpan Konfigurasi
              </FormSubmitButton>
            </div>
          </form>
        </section>

        {/* Live System Diagnostics */}
        <section className="space-y-4">
          <SystemHealthDiagnostics />
        </section>
      </div>
    </CmsPageShell>
  )
}
