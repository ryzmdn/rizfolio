"use client"

import { useState } from "react"
import { CmsPageShell } from "../../components/cms-page-shell"
import { uploadMediaAsset } from "../../lib/actions/media-actions"
import { Upload, Copy, Check, Image as ImageIcon, Loader2 } from "lucide-react"

export default function MediaLibraryPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleUpload(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const file = formData.get("file") as File

    if (!file || file.size === 0) return

    setIsUploading(true)
    setErrorMsg(null)
    setUploadedUrl(null)

    try {
      const res = await uploadMediaAsset(formData)
      if (res.error) {
        setErrorMsg(res.error)
      } else if (res.url) {
        setUploadedUrl(res.url)
        form.reset()
      }
    } catch {
      setErrorMsg("Gagal mengunggah berkas ke server.")
    } finally {
      setIsUploading(false)
    }
  }

  function handleCopyUrl() {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <CmsPageShell
      title="Media Library"
      description="Unggah dan kelola aset gambar atau media ke Supabase Storage (media bucket)."
    >
      <div className="space-y-8">
        {/* Upload Form Box */}
        <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Unggah Berkas Baru
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            {errorMsg && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Pilih File (Gambar / PDF)
                </label>
                <input
                  name="file"
                  type="file"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Folder Tujuan
                </label>
                <select
                  name="folder"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="general">general</option>
                  <option value="blog">blog</option>
                  <option value="portfolio">portfolio</option>
                  <option value="products">products</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Mengunggah ke Supabase Storage...</span>
                </>
              ) : (
                <>
                  <Upload className="size-3.5" />
                  <span>Mulai Unggah</span>
                </>
              )}
            </button>
          </form>

          {/* Success Banner with Copy Link */}
          {uploadedUrl && (
            <div className="mt-4 space-y-2 rounded-xl border border-success/30 bg-success/5 p-4">
              <div className="text-xs font-medium text-success">
                Berkas berhasil diunggah!
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-2 font-mono text-xs text-foreground">
                <span className="truncate">{uploadedUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-success" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Salin CDN URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bucket Info */}
        <div className="space-y-3 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ImageIcon className="size-4 text-muted-foreground" />
            <span>Informasi Supabase Storage</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Semua media disimpan di bucket publik{" "}
            <code className="font-mono text-foreground">media</code> dan
            dilayani langsung oleh Supabase CDN global dengan latensi rendah.
          </p>
        </div>
      </div>
    </CmsPageShell>
  )
}
