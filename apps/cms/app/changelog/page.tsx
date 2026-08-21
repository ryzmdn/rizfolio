import { CmsPageShell } from "../../components/cms-page-shell"
import { Badge } from "@workspace/ui/components/badge"
import { DeleteButton } from "../../components/delete-confirm-dialog"
import {
  getChangelogs,
  createChangelog,
  deleteChangelog,
} from "../../lib/actions/changelog-actions"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ChangelogManagerPage() {
  const list = await getChangelogs()

  return (
    <CmsPageShell
      title="Changelog Manager"
      description="Catat log rilis pembaruan website, fitur baru, dan perbaikan bug."
    >
      <div className="space-y-8">
        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Tambah Rilis Changelog
          </h2>
          <form
            action={async (formData: FormData) => {
              "use server"
              const version = formData.get("version")?.toString() || ""
              const title = formData.get("title")?.toString() || ""
              const releaseDate =
                formData.get("releaseDate")?.toString() ||
                new Date().toISOString().split("T")[0]
              const summary = formData.get("summary")?.toString() || null

              if (version && title) {
                await createChangelog({
                  version,
                  title,
                  releaseDate:
                    releaseDate || new Date().toISOString().split("T")[0]!,
                  summary: summary || null,
                  isPublished: true,
                })
              }
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                name="version"
                placeholder="Versi (e.g. v2.1.0)"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <input
                name="title"
                placeholder="Judul Rilis (e.g. Major Monorepo Redesign)"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <input
                name="releaseDate"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <textarea
              name="summary"
              rows={2}
              placeholder="Ringkasan pembaruan rilis ini..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="size-3.5" />
                Tambah Rilis
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
          <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground">
            Daftar Catatan Rilis ({list.length})
          </div>

          <div className="divide-y divide-border/40 text-xs">
            {list.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Belum ada log rilis changelog.
              </div>
            ) : (
              list.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="font-mono text-[10px]"
                      >
                        {item.version}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Dirilis pada {item.releaseDate}{" "}
                      {item.summary && `• ${item.summary}`}
                    </div>
                  </div>

                  <DeleteButton
                    onConfirm={async () => {
                      "use server"
                      await deleteChangelog(item.id)
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
