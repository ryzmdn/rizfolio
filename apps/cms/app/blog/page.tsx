import { Badge } from "@workspace/ui/components/badge"
import { CmsPageShell } from "@/components/cms-page-shell"
import { DeleteButton } from "@/components/delete-confirm-dialog"
import { FormSubmitButton } from "@/components/form-submit-button"
import { getPosts, createPost, deletePost } from "@/lib/actions/blog-actions"

export const dynamic = "force-dynamic"

export default async function BlogManagerPage() {
  const postList = await getPosts()

  return (
    <CmsPageShell
      title="Blog Manager"
      description="Tulis artikel teknis, kelola draf, publikasi, dan kategori blog."
    >
      <div className="space-y-8">
        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Tulis Artikel Baru
          </h2>
          <form
            action={async (formData: FormData) => {
              "use server"
              const title = formData.get("title")?.toString() || ""
              const slug =
                formData.get("slug")?.toString().trim().toLowerCase() ||
                title
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^\w-]/g, "")
              const excerpt = formData.get("excerpt")?.toString() || ""
              const contentMd = formData.get("contentMd")?.toString() || ""
              const isPublished = formData.get("isPublished") === "true"

              if (title && slug) {
                await createPost({
                  title,
                  slug,
                  excerpt,
                  contentMd,
                  status: isPublished ? "PUBLISHED" : "DRAFT",
                  publishedAt: isPublished ? new Date() : null,
                  readingTime: Math.max(
                    1,
                    Math.ceil(contentMd.split(/\s+/).length / 200)
                  ),
                })
              }
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="title"
                placeholder="Judul Artikel"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
              <input
                name="slug"
                placeholder="Slug URL (opsional, auto dari judul)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <textarea
              name="excerpt"
              rows={2}
              placeholder="Ringkasan singkat artikel..."
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />

            <textarea
              name="contentMd"
              rows={6}
              placeholder="Isi konten artikel (Markdown)..."
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Status:</label>
                <select
                  name="isPublished"
                  className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none"
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>

              <FormSubmitButton
                icon="plus"
                pendingLabel="Mempublikasikan artikel..."
              >
                Simpan & Publikasikan
              </FormSubmitButton>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground">
            <span>Daftar Artikel ({postList.length})</span>
          </div>

          <div className="divide-y divide-border/40 text-xs">
            {postList.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Belum ada artikel yang ditulis.
              </div>
            ) : (
              postList.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {post.title}
                      </span>
                      <Badge
                        variant={
                          post.status === "PUBLISHED" ? "default" : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                      <span>/{post.slug}</span>
                      <span>•</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <DeleteButton
                    onConfirm={async () => {
                      "use server"
                      await deletePost(post.id)
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
