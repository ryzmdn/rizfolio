"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  Trash2,
  Search,
  X,
  Loader2,
  Sparkles,
  Zap,
  Bug,
  AlertTriangle,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  createChangelogItem,
  deleteChangelogItem,
} from "@/lib/actions/changelog-actions"

interface ChangelogItem {
  id: string
  version: string
  title: string
}

interface ItemizedHighlight {
  id: string
  changelogId: string
  category: string
  description: string
  displayOrder: number
}

interface ChangelogItemBuilderProps {
  changelogs: ChangelogItem[]
  items: ItemizedHighlight[]
}

export function ChangelogItemBuilder({
  changelogs,
  items,
}: ChangelogItemBuilderProps) {
  const [selectedChangelogId, setSelectedChangelogId] = useState<string>(
    changelogs[0]?.id || "ALL"
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [formChangelogId, setFormChangelogId] = useState<string>(
    changelogs[0]?.id || ""
  )
  const [category, setCategory] = useState<
    "FEATURE" | "IMPROVEMENT" | "FIX" | "BREAKING"
  >("FEATURE")
  const [description, setDescription] = useState("")
  const [displayOrder, setDisplayOrder] = useState<number | string>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const changelogMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of changelogs) {
      map.set(c.id, `${c.version} - ${c.title}`)
    }
    return map
  }, [changelogs])

  const changelogVersionMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of changelogs) {
      map.set(c.id, c.version)
    }
    return map
  }, [changelogs])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchChangelog =
        selectedChangelogId === "ALL" ||
        item.changelogId === selectedChangelogId
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      return matchChangelog && matchSearch
    })
  }, [items, selectedChangelogId, searchQuery])

  async function handleCreateItem(e: React.FormEvent) {
    e.preventDefault()
    if (!formChangelogId || !description.trim()) return

    setIsSubmitting(true)
    try {
      await createChangelogItem({
        changelogId: formChangelogId,
        category,
        description: description.trim(),
        displayOrder: Number(displayOrder) || 1,
      })

      setDescription("")
      setDisplayOrder((prev) => Number(prev) + 1)
      setIsFormOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  function getCategoryBadge(cat: string) {
    switch (cat) {
      case "FEATURE":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
            <Sparkles className="size-3" />
            <span>FEATURE</span>
          </span>
        )
      case "IMPROVEMENT":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
            <Zap className="size-3" />
            <span>IMPROVEMENT</span>
          </span>
        )
      case "FIX":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
            <Bug className="size-3" />
            <span>FIX</span>
          </span>
        )
      case "BREAKING":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500">
            <AlertTriangle className="size-3" />
            <span>BREAKING</span>
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-foreground">
              Filter Berdasarkan Rilis:
            </span>
            <select
              value={selectedChangelogId}
              onChange={(e) => setSelectedChangelogId(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="ALL">Semua Rilis ({items.length} poin)</option>
              {changelogs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.version} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-foreground">
              Cari Poin:
            </span>
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari deskripsi pembaruan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-60"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>{isFormOpen ? "Tutup Formulir" : "Tambah Poin Sorotan"}</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleCreateItem} className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Tambah Butir Poin Sorotan Pembaruan
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
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-foreground">
                Target Rilis Changelog
              </label>
              <select
                value={formChangelogId}
                onChange={(e) => setFormChangelogId(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                {changelogs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.version} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Kategori Pembaruan
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as
                      | "FEATURE"
                      | "IMPROVEMENT"
                      | "FIX"
                      | "BREAKING"
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                <option value="FEATURE">FEATURE (Fitur Baru)</option>
                <option value="IMPROVEMENT">IMPROVEMENT (Peningkatan)</option>
                <option value="FIX">FIX (Perbaikan Bug)</option>
                <option value="BREAKING">BREAKING (Perubahan Signifikan)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="space-y-1.5 sm:col-span-3">
              <label className="text-xs font-medium text-foreground">
                Deskripsi Pembaruan Teknis
              </label>
              <input
                type="text"
                placeholder="e.g. Implementasi real-time cart state sinkronisasi dengan localStorage..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Urutan Tampilan
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                min={1}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>Simpan Poin Sorotan</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground flex items-center justify-between">
          <span>Daftar Poin Sorotan Pembaruan ({filteredItems.length} butir)</span>
          {selectedChangelogId !== "ALL" && (
            <Badge variant="outline" className="text-[10px]">
              {changelogVersionMap.get(selectedChangelogId)}
            </Badge>
          )}
        </div>

        <div className="divide-y divide-border/40 text-xs">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Belum ada butir sorotan pembaruan terdaftar pada rilis ini.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/20"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 font-mono text-[11px] text-muted-foreground">
                    #{item.displayOrder}
                  </div>

                  <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(item.category)}
                      <span className="font-medium text-foreground">
                        {item.description}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-muted-foreground">
                      {changelogMap.get(item.changelogId) || item.changelogId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={async () => {
                      if (
                        confirm(
                          `Hapus poin sorotan "${item.description.slice(0, 40)}..."?`
                        )
                      ) {
                        await deleteChangelogItem(item.id)
                      }
                    }}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Hapus Poin"
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
