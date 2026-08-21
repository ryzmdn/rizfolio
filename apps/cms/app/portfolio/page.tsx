import { CmsPageShell } from "../../components/cms-page-shell"
import { DeleteButton } from "../../components/delete-confirm-dialog"
import {
  getProfile,
  upsertProfile,
  getExperiences,
  createExperience,
  deleteExperience,
  getEducation,
  deleteEducation,
  getServices,
} from "../../lib/actions/portfolio-actions"
import { Plus, Briefcase, GraduationCap } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PortfolioManagerPage() {
  const [profileData, expList, eduList] = await Promise.all([
    getProfile(),
    getExperiences(),
    getEducation(),
    getServices(),
  ])

  return (
    <CmsPageShell
      title="Portfolio Manager"
      description="Kelola informasi bio, riwayat pekerjaan, pendidikan, dan layanan profesional."
    >
      <div className="space-y-10">
        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Profil & Biodata Utama
          </h2>
          <form
            action={async (formData: FormData) => {
              "use server"
              const fullName = formData.get("fullName")?.toString() || ""
              const headline = formData.get("headline")?.toString() || ""
              const bio = formData.get("bio")?.toString() || ""
              const location = formData.get("location")?.toString() || ""
              const resumeUrl = formData.get("resumeUrl")?.toString() || ""
              const status = formData.get("status")?.toString() || "available"

              await upsertProfile({
                fullName,
                headline,
                bio,
                location,
                resumeUrl,
                status,
              })
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Nama Lengkap
                </label>
                <input
                  name="fullName"
                  defaultValue={profileData?.fullName || "Rizky Ramadhan"}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Headline
                </label>
                <input
                  name="headline"
                  defaultValue={
                    profileData?.headline || "Software Engineer & AI Enthusiast"
                  }
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Bio / Ringkasan
              </label>
              <textarea
                name="bio"
                defaultValue={profileData?.bio || ""}
                rows={3}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Lokasi
                </label>
                <input
                  name="location"
                  defaultValue={profileData?.location || "Jakarta, Indonesia"}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  URL Resume (PDF)
                </label>
                <input
                  name="resumeUrl"
                  defaultValue={profileData?.resumeUrl || ""}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Status Ketersediaan
                </label>
                <select
                  name="status"
                  defaultValue={profileData?.status || "available"}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="available">Available for Hire</option>
                  <option value="busy">Busy / Working</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Simpan Profil
            </button>
          </form>
        </div>

        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Pengalaman Kerja
              </h2>
            </div>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server"
              const company = formData.get("company")?.toString() || ""
              const role = formData.get("role")?.toString() || ""
              const startDate = formData.get("startDate")?.toString() || ""
              const endDate = formData.get("endDate")?.toString() || ""
              const description = formData.get("description")?.toString() || ""

              if (company && role) {
                await createExperience({
                  company,
                  role,
                  startDate,
                  endDate: endDate || null,
                  description,
                  isCurrent: !endDate,
                })
              }
            }}
            className="grid grid-cols-1 gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 sm:grid-cols-4"
          >
            <input
              name="company"
              placeholder="Nama Perusahaan"
              required
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
            />
            <input
              name="role"
              placeholder="Posisi / Role"
              required
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
            />
            <input
              name="startDate"
              placeholder="Mulai (e.g. Jan 2023)"
              required
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90"
            >
              <Plus className="size-3.5" />
              Tambah
            </button>
          </form>

          <div className="divide-y divide-border/40 text-xs">
            {expList.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                Belum ada data pengalaman kerja.
              </p>
            ) : (
              expList.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <div className="font-medium text-foreground">
                      {exp.role} • {exp.company}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </div>
                  </div>
                  <DeleteButton
                    onConfirm={async () => {
                      "use server"
                      await deleteExperience(exp.id)
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Riwayat Pendidikan
            </h2>
          </div>

          <div className="divide-y divide-border/40 text-xs">
            {eduList.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                Belum ada data pendidikan.
              </p>
            ) : (
              eduList.map((edu) => (
                <div
                  key={edu.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <div className="font-medium text-foreground">
                      {edu.degree} in {edu.field}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {edu.institution} ({edu.startYear} -{" "}
                      {edu.endYear || "Present"})
                    </div>
                  </div>
                  <DeleteButton
                    onConfirm={async () => {
                      "use server"
                      await deleteEducation(edu.id)
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </CmsPageShell>
  )
}
