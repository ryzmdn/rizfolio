"use client"

import { useState, useMemo } from "react"
import {
  History,
  ListPlus,
  Milestone,
  Search,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Calendar,
  Loader2,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { ChangelogEditDialog } from "./changelog-edit-dialog"
import { ChangelogItemBuilder } from "./changelog-item-builder"
import { RoadmapManager } from "./roadmap-manager"
import { createChangelog, deleteChangelog } from "@/lib/actions/changelog-actions"

interface ChangelogItem {
  id: string
  version: string
  title: string
  releaseDate: string
  summary: string | null
  isPublished: boolean
  createdAt: Date
}

interface ItemizedHighlight {
  id: string
  changelogId: string
  category: string
  description: string
  displayOrder: number
}

interface RoadmapItem {
  id: string
  title: string
  description: string
  stage: string
  quarter: string
  priority: string
  scope: string[] | null
  relatedVersion: string | null
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

interface ChangelogManagerViewProps {
  changelogs: ChangelogItem[]
  items: ItemizedHighlight[]
  roadmapItems: RoadmapItem[]
}

type ChangelogTab = "RELEASES" | "ITEMS" | "ROADMAP"

export function ChangelogManagerView({
  changelogs,
  items,
  roadmapItems,
}: ChangelogManagerViewProps) {
  const [activeTab, setActiveTab] = useState<ChangelogTab>("RELEASES")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [editingChangelog, setEditingChangelog] =
    useState<ChangelogItem | null>(null)

  const [version, setVersion] = useState("")
  const [title, setTitle] = useState("")
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().split("T")[0]!
  )
  const [summary, setSummary] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredChangelogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return changelogs.filter((c) => {
      const matchSearch =
        !q ||
        c.version.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.summary && c.summary.toLowerCase().includes(q))

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && c.isPublished) ||
        (statusFilter === "DRAFT" && !c.isPublished)

      return matchSearch && matchStatus
    })
  }, [changelogs, searchQuery, statusFilter])

  const itemsCountMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of items) {
      map.set(item.changelogId, (map.get(item.changelogId) || 0) + 1)
    }
    return map
  }, [items])

  async function handleCreateChangelog(e: React.FormEvent) {
    e.preventDefault()
    if (!version.trim() || !title.trim() || !releaseDate.trim()) return

    setIsSubmitting(true)
    try {
      await createChangelog({
        version: version.trim(),
        title: title.trim(),
        releaseDate: releaseDate.trim(),
        summary: summary.trim() || null,
        isPublished,
      })

      setVersion("")
      setTitle("")
      setReleaseDate(new Date().toISOString().split("T")[0]!)
      setSummary("")
      setIsPublished(true)
      setIsFormExpanded(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const changelogBaseUrl =
    process.env.NEXT_PUBLIC_CHANGELOG_URL || "http://localhost:3005"

  return (
    <div className="space-y-6">
      <div className="flex border-b border-border/80">
        <button
          type="button"
          onClick={() => setActiveTab("RELEASES")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition-colors ${
            activeTab === "RELEASES"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="size-4" />
          <span>Catatan Rilis Changelog</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {changelogs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ITEMS")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition-colors ${
            activeTab === "ITEMS"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListPlus className="size-4" />
          <span>Sorotan Pembaruan (Itemizer)</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {items.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ROADMAP")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium transition-colors ${
            activeTab === "ROADMAP"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Milestone className="size-4" />
          <span>Peta Jalan Roadmap</span>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {roadmapItems.length}
          </span>
        </button>
      </div>

      {activeTab === "RELEASES" && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
            <div className="flex items-center justify-between border-b border-border/80 p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
                  <Plus className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Tambah Rilis Changelog Baru
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Catat versi rilis baru aplikasi, perbaikan bug, dan pembaruan arsitektur sistem.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormExpanded((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>{isFormExpanded ? "Tutup Formulir" : "Buka Formulir"}</span>
                {isFormExpanded ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>
            </div>

            {isFormExpanded && (
              <form onSubmit={handleCreateChangelog} className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Nomor Versi (SemVer)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. v1.4.0"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Judul Pembaruan Rilis
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Major UI Overhaul & Performance Enhancements"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Tanggal Rilis
                    </label>
                    <input
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Status Publikasi
                    </label>
                    <select
                      value={isPublished ? "true" : "false"}
                      onChange={(e) => setIsPublished(e.target.value === "true")}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                    >
                      <option value="true">Publik (Tampil di Timeline)</option>
                      <option value="false">Draf (Hanya Admin)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Ringkasan Rilis (Summary)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tulis ringkasan singkat perubahan utama pada rilis versi ini..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Menyimpan Rilis...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="size-3.5" />
                        <span>Simpan & Publikasikan Rilis</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <History className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Daftar Catatan Rilis ({filteredChangelogs.length})
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari versi atau judul rilis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-60"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="PUBLISHED">Publik</option>
                  <option value="DRAFT">Draf</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
              <div className="divide-y divide-border/40 text-xs">
                {filteredChangelogs.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    {searchQuery || statusFilter !== "ALL"
                      ? "Tidak ada rilis yang cocok dengan filter pencarian."
                      : "Belum ada catatan rilis changelog terdaftar."}
                  </div>
                ) : (
                  filteredChangelogs.map((release) => {
                    const itemsCount = itemsCountMap.get(release.id) || 0

                    return (
                      <div
                        key={release.id}
                        className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="default"
                              className="font-mono text-[10px]"
                            >
                              {release.version}
                            </Badge>
                            <span className="text-sm font-semibold text-foreground">
                              {release.title}
                            </span>
                            <Badge
                              variant={
                                release.isPublished ? "secondary" : "outline"
                              }
                              className="text-[9px]"
                            >
                              {release.isPublished ? "Publik" : "Draf"}
                            </Badge>
                          </div>

                          {release.summary && (
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {release.summary}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              <span>Dirilis pada {release.releaseDate}</span>
                            </div>
                            <span>&bull;</span>
                            <span>{itemsCount} poin sorotan</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <a
                            href={`${changelogBaseUrl}/release/${release.version.replace(/^v/, "").replace(/\./g, "-")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex size-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Lihat Rilis Publik"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => setEditingChangelog(release)}
                            className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                          >
                            <Pencil className="size-3.5 text-muted-foreground" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              if (
                                confirm(
                                  `Hapus rilis "${release.version} - ${release.title}"?`
                                )
                              ) {
                                await deleteChangelog(release.id)
                              }
                            }}
                            className="flex size-8 items-center justify-center rounded-lg border border-destructive/20 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            title="Hapus Rilis"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ITEMS" && (
        <ChangelogItemBuilder changelogs={changelogs} items={items} />
      )}

      {activeTab === "ROADMAP" && (
        <RoadmapManager roadmapItems={roadmapItems} />
      )}

      <ChangelogEditDialog
        changelog={editingChangelog}
        isOpen={Boolean(editingChangelog)}
        onClose={() => setEditingChangelog(null)}
      />
    </div>
  )
}
