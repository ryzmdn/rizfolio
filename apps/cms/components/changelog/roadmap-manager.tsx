"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  Trash2,
  Search,
  X,
  Layers,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRightCircle,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  createRoadmapItem,
  updateRoadmapItem,
  deleteRoadmapItem,
} from "@/lib/actions/changelog-actions"

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

interface RoadmapManagerProps {
  roadmapItems: RoadmapItem[]
}

export function RoadmapManager({ roadmapItems }: RoadmapManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("ALL")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [stage, setStage] = useState<"PLANNED" | "IN_PROGRESS" | "SHIPPED">(
    "PLANNED"
  )
  const [quarter, setQuarter] = useState("Q4 2026")
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "PLANNED">(
    "HIGH"
  )
  const [scopeInput, setScopeInput] = useState("")
  const [relatedVersion, setRelatedVersion] = useState("")
  const [displayOrder, setDisplayOrder] = useState<number | string>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredRoadmap = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return roadmapItems.filter((item) => {
      const matchStage =
        stageFilter === "ALL" || item.stage === stageFilter
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.quarter.toLowerCase().includes(q) ||
        (item.scope && item.scope.some((s) => s.toLowerCase().includes(q)))
      return matchStage && matchSearch
    })
  }, [roadmapItems, searchQuery, stageFilter])

  async function handleCreateRoadmap(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    const parsedScope = scopeInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    setIsSubmitting(true)
    try {
      await createRoadmapItem({
        title: title.trim(),
        description: description.trim(),
        stage,
        quarter: quarter.trim() || "Q4 2026",
        priority,
        scope: parsedScope.length > 0 ? parsedScope : null,
        relatedVersion: relatedVersion.trim() || null,
        displayOrder: Number(displayOrder) || 1,
      })

      setTitle("")
      setDescription("")
      setStage("PLANNED")
      setQuarter("Q4 2026")
      setPriority("HIGH")
      setScopeInput("")
      setRelatedVersion("")
      setDisplayOrder((prev) => Number(prev) + 1)
      setIsFormOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUpdateStage(
    itemId: string,
    newStage: "PLANNED" | "IN_PROGRESS" | "SHIPPED"
  ) {
    await updateRoadmapItem(itemId, { stage: newStage })
  }

  function getStageBadge(st: string) {
    switch (st) {
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
            <CheckCircle2 className="size-3" />
            <span>SHIPPED</span>
          </span>
        )
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
            <Clock className="size-3" />
            <span>IN_PROGRESS</span>
          </span>
        )
      case "PLANNED":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
            <ArrowRightCircle className="size-3" />
            <span>PLANNED</span>
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
              Filter Tahap Roadmap:
            </span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="ALL">Semua Tahap ({roadmapItems.length} tonggak)</option>
              <option value="SHIPPED">SHIPPED (Selesai)</option>
              <option value="IN_PROGRESS">IN_PROGRESS (Sedang Berjalan)</option>
              <option value="PLANNED">PLANNED (Direncanakan)</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-foreground">
              Cari Tonggak:
            </span>
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari target fitur atau kuartal..."
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
          <span>{isFormOpen ? "Tutup Formulir" : "Tambah Tonggak Roadmap"}</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleCreateRoadmap} className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Tambah Tonggak Rencana Roadmap Baru
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
                Judul Tonggak Rencana
              </label>
              <input
                type="text"
                placeholder="e.g. Edge Middleware Geo-Routing & Performance Optimization"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Tahapan Pengembangan
              </label>
              <select
                value={stage}
                onChange={(e) =>
                  setStage(
                    e.target.value as "PLANNED" | "IN_PROGRESS" | "SHIPPED"
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                <option value="PLANNED">PLANNED (Direncanakan)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Sedang Dikerjakan)</option>
                <option value="SHIPPED">SHIPPED (Selesai & Dirilis)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Target Kuartal Rilis
              </label>
              <input
                type="text"
                placeholder="e.g. Q4 2026 atau Q1 2027"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as "HIGH" | "MEDIUM" | "PLANNED"
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                <option value="HIGH">HIGH (Tinggi)</option>
                <option value="MEDIUM">MEDIUM (Sedang)</option>
                <option value="PLANNED">PLANNED (Standar)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Versi Terkait (Opsional)
              </label>
              <input
                type="text"
                placeholder="e.g. v1.4.0"
                value={relatedVersion}
                onChange={(e) => setRelatedVersion(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
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

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Scope / Area Aplikasi (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              placeholder="e.g. apps/portfolio, apps/shop, packages/ui, packages/db"
              value={scopeInput}
              onChange={(e) => setScopeInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Deskripsi Rencana & Target Arsitektur
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan kebutuhan arsitektur, dampak performa, dan tujuan fitur ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            />
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
                  <span>Simpan Tonggak Roadmap</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="border-b border-border/80 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground flex items-center justify-between">
          <span>Daftar Tonggak Rencana Roadmap ({filteredRoadmap.length} tonggak)</span>
        </div>

        <div className="divide-y divide-border/40 text-xs">
          {filteredRoadmap.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Belum ada tonggak rencana roadmap terdaftar.
            </div>
          ) : (
            filteredRoadmap.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {getStageBadge(item.stage)}
                    <span className="text-sm font-semibold text-foreground">
                      {item.title}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {item.quarter}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      Prioritas: {item.priority}
                    </Badge>
                    {item.relatedVersion && (
                      <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {item.relatedVersion}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>

                  {item.scope && item.scope.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <Layers className="size-3 text-muted-foreground" />
                      {item.scope.map((sc) => (
                        <span
                          key={sc}
                          className="rounded bg-muted/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                        >
                          {sc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <select
                    value={item.stage}
                    onChange={(e) =>
                      handleUpdateStage(
                        item.id,
                        e.target.value as "PLANNED" | "IN_PROGRESS" | "SHIPPED"
                      )
                    }
                    className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none"
                  >
                    <option value="PLANNED">PLANNED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="SHIPPED">SHIPPED</option>
                  </select>

                  <button
                    type="button"
                    onClick={async () => {
                      if (
                        confirm(`Hapus tonggak roadmap "${item.title}"?`)
                      ) {
                        await deleteRoadmapItem(item.id)
                      }
                    }}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Hapus Tonggak"
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
