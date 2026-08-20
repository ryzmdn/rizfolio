import { CmsPageShell } from "../../components/cms-page-shell"
import { Badge } from "@workspace/ui/components/badge"
import { DeleteButton } from "../../components/delete-confirm-dialog"
import {
  getAdminRepositories,
  createRepository,
  deleteRepository,
} from "../../lib/actions/archive-actions"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ArchiveManagerPage() {
  const repoList = await getAdminRepositories()

  return (
    <CmsPageShell
      title="Archive & Repositories Manager"
      description="Kelola repositori tugas kuliah, eksperimen, dan proyek open-source."
    >
      <div className="space-y-8">
        <div className="rounded-xl border border-border/80 bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">
            Tambah Repositori Baru
          </h2>
          <form
            action={async (formData: FormData) => {
              "use server"
              const name = formData.get("name")?.toString() || ""
              const slug =
                formData.get("slug")?.toString().trim().toLowerCase() ||
                name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
              const description = formData.get("description")?.toString() || ""
              const category = formData.get("category")?.toString() || "ASSIGNMENT"
              const courseName = formData.get("courseName")?.toString() || null
              const semester = formData.get("semester")?.toString() || null
              const githubUrl = formData.get("githubUrl")?.toString() || null
              const demoUrl = formData.get("demoUrl")?.toString() || null
              const readmeContent = formData.get("readmeContent")?.toString() || null

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
                placeholder="Nama Repositori (e.g. algoritma-lanjut)"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <input
                name="slug"
                placeholder="Slug (opsional)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <select
                name="category"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                <option value="ASSIGNMENT">Tugas Kuliah</option>
                <option value="EXPERIMENT">Eksperimen</option>
                <option value="OPEN_SOURCE">Open Source</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="courseName"
                placeholder="Nama Mata Kuliah (e.g. Struktur Data)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <input
                name="semester"
                placeholder="Semester (e.g. Semester 3)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <textarea
              name="description"
              rows={2}
              placeholder="Deskripsi singkat repositori..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />

            <textarea
              name="readmeContent"
              rows={4}
              placeholder="README.md konten awal (Markdown)..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
            />

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Plus className="size-3.5" />
                Tambah Repositori
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
          <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground">
            Daftar Repositori ({repoList.length})
          </div>

          <div className="divide-y divide-border/40 text-xs">
            {repoList.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Belum ada repositori.
              </div>
            ) : (
              repoList.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {repo.name}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {repo.category}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground font-mono text-[11px]">
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
