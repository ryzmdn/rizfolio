import { Badge } from "@workspace/ui/components/badge"
import { CmsPageShell } from "@/components/cms-page-shell"
import { DeleteButton } from "@/components/delete-confirm-dialog"
import { FormSubmitButton } from "@/components/form-submit-button"
import {
  getAdminRepositories,
  createRepository,
  deleteRepository,
} from "@/lib/actions/docs-actions"

export const dynamic = "force-dynamic"

export default async function DocsManagerPage() {
  const repoList = await getAdminRepositories()

  return (
    <CmsPageShell
      title="Documentation & Repositories Manager"
      description="Kelola repositori sumber terbuka, dokumentasi teknis, dan proyek akademik."
    >
      <div className="space-y-8">
        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Tambah Repositori / Dokumen Baru
          </h2>
          <form
            action={async (formData: FormData) => {
              "use server"
              const name = formData.get("name")?.toString() || ""
              const slug =
                formData.get("slug")?.toString().trim().toLowerCase() ||
                name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^\w-]/g, "")
              const description = formData.get("description")?.toString() || ""
              const category =
                formData.get("category")?.toString() || "OPEN_SOURCE"
              const courseName = formData.get("courseName")?.toString() || null
              const semester = formData.get("semester")?.toString() || null
              const githubUrl = formData.get("githubUrl")?.toString() || null
              const demoUrl = formData.get("demoUrl")?.toString() || null
              const readmeContent =
                formData.get("readmeContent")?.toString() || null

              if (name && slug) {
                await createRepository({
                  name,
                  slug,
                  description,
                  category,
                  courseName,
                  semester,
                  githubUrl,
                  demoUrl,
                  readmeContent,
                  isPublic: true,
                })
              }
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                name="name"
                placeholder="Nama Repositori / Proyek (e.g. core-engine)"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <input
                name="slug"
                placeholder="Slug URL (opsional)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <select
                name="category"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                <option value="OPEN_SOURCE">Open Source</option>
                <option value="EXPERIMENT">Eksperimen</option>
                <option value="ASSIGNMENT">Tugas Kuliah</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="courseName"
                placeholder="Topik / Mata Kuliah (e.g. Software Architecture)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <input
                name="semester"
                placeholder="Semester / Batch (opsional)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="githubUrl"
                placeholder="GitHub URL (https://github.com/ryzmdn/...)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <input
                name="demoUrl"
                placeholder="Live Demo URL (https://...)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <textarea
              name="description"
              rows={2}
              placeholder="Deskripsi singkat dokumentasi/repositori..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />

            <textarea
              name="readmeContent"
              rows={4}
              placeholder="README.md konten awal (Markdown)..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
            />

            <div className="flex justify-end pt-1">
              <FormSubmitButton
                icon="plus"
                pendingLabel="Menyimpan repositori..."
              >
                Simpan Dokumen / Repositori
              </FormSubmitButton>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
          <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground">
            Daftar Repositori & Dokumentasi ({repoList.length})
          </div>

          <div className="divide-y divide-border/40 text-xs">
            {repoList.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Belum ada repositori atau dokumen.
              </div>
            ) : (
              repoList.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {repo.name}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {repo.category}
                      </Badge>
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      /{repo.slug} {repo.courseName && `• ${repo.courseName}`}
                    </div>
                  </div>

                  <DeleteButton
                    onConfirm={async () => {
                      "use server"
                      await deleteRepository(repo.id)
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
