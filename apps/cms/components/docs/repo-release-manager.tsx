"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  Trash2,
  Calendar,
  X,
  FileArchive,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { createRepoRelease, deleteRepoRelease } from "@/lib/actions/docs-actions"

interface RepositoryItem {
  id: string
  name: string
  slug: string
}

interface RepoReleaseItem {
  id: string
  repoId: string
  versionTag: string
  zipStoragePath: string
  changelog: string | null
  createdAt: Date
}

interface RepoReleaseManagerProps {
  repositories: RepositoryItem[]
  releases: RepoReleaseItem[]
}

export function RepoReleaseManager({
  repositories,
  releases,
}: RepoReleaseManagerProps) {
  const [selectedRepoId, setSelectedRepoId] = useState<string>("ALL")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [formRepoId, setFormRepoId] = useState<string>(
    repositories[0]?.id || ""
  )
  const [versionTag, setVersionTag] = useState("")
  const [zipStoragePath, setZipStoragePath] = useState("")
  const [changelog, setChangelog] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const repoMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const r of repositories) {
      map.set(r.id, r.name)
    }
    return map
  }, [repositories])

  const filteredReleases = useMemo(() => {
    if (selectedRepoId === "ALL") return releases
    return releases.filter((r) => r.repoId === selectedRepoId)
  }, [releases, selectedRepoId])

  async function handleCreateRelease(e: React.FormEvent) {
    e.preventDefault()
    if (!formRepoId || !versionTag.trim() || !zipStoragePath.trim()) return

    setIsSubmitting(true)
    try {
      await createRepoRelease({
        repoId: formRepoId,
        versionTag: versionTag.trim(),
        zipStoragePath: zipStoragePath.trim(),
        changelog: changelog.trim() || null,
      })

      setVersionTag("")
      setZipStoragePath("")
      setChangelog("")
      setIsFormOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-foreground">
            Filter Berdasarkan Repositori:
          </span>
          <select
            value={selectedRepoId}
            onChange={(e) => setSelectedRepoId(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
          >
            <option value="ALL">Semua Repositori ({releases.length} rilis)</option>
            {repositories.map((repo) => (
              <option key={repo.id} value={repo.id}>
                {repo.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>{isFormOpen ? "Tutup Formulir" : "Publikasikan Rilis Baru"}</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleCreateRelease} className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Publikasikan Versi Rilis Repositori
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Target Repositori
              </label>
              <select
                value={formRepoId}
                onChange={(e) => setFormRepoId(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                {repositories.map((repo) => (
                  <option key={repo.id} value={repo.id}>
                    {repo.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Tag Versi (SemVer)
              </label>
              <input
                type="text"
                placeholder="e.g. v1.0.0"
                value={versionTag}
                onChange={(e) => setVersionTag(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Path / URL Berkas Arsip (.zip / .tar.gz)
              </label>
              <input
                type="text"
                placeholder="e.g. releases/core-v1.0.0.zip"
                value={zipStoragePath}
                onChange={(e) => setZipStoragePath(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Catatan Rilis (Changelog Markdown)
            </label>
            <textarea
              rows={4}
              placeholder="Rangkuman perbaikan, pembaruan fitur, dan panduan instalasi versi ini..."
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Plus className="size-3.5" />
              <span>{isSubmitting ? "Menerbitkan..." : "Publikasikan Rilis"}</span>
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground flex items-center justify-between">
          <span>Daftar Arsip Rilis ({filteredReleases.length} versi)</span>
        </div>

        <div className="divide-y divide-border/40 text-xs">
          {filteredReleases.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Belum ada rilis terdaftar pada repositori ini.
            </div>
          ) : (
            filteredReleases.map((rel) => (
              <div
                key={rel.id}
                className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="default" className="font-mono text-xs">
                      {rel.versionTag}
                    </Badge>
                    <span className="font-semibold text-foreground">
                      {repoMap.get(rel.repoId) || rel.repoId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    <FileArchive className="size-3.5" />
                    <span>{rel.zipStoragePath}</span>
                    <span>&bull;</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      <span>
                        {new Date(rel.createdAt).toLocaleDateString("id-ID", {
                          dateStyle: "medium",
                        })}
                      </span>
                    </div>
                  </div>

                  {rel.changelog && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {rel.changelog}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={async () => {
                      if (
                        confirm(
                          `Hapus rilis "${rel.versionTag}" permanen?`
                        )
                      ) {
                        await deleteRepoRelease(rel.id)
                      }
                    }}
                    className="flex size-8 items-center justify-center rounded-lg border border-destructive/20 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Hapus Rilis"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
