"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  ExternalLink,
  MessageSquare,
  Clock,
  Mail,
  Loader2,
  CornerDownRight,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import {
  type AdminCommentItem,
  type CommentStats,
  type CommentStatus,
  updateCommentStatusAction,
  batchUpdateCommentsStatusAction,
  deleteCommentAction,
  batchDeleteCommentsAction,
} from "@/lib/actions/comment-actions"

interface CommentsManagerClientProps {
  initialComments: AdminCommentItem[]
  initialStats: CommentStats
}

function getAuthorInitials(name: string): string {
  if (!name.trim()) return "AN"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return (parts[0]?.slice(0, 2) || "AN").toUpperCase()
  }
  const first = parts[0]?.[0] || ""
  const last = parts[parts.length - 1]?.[0] || ""
  return (first + last).toUpperCase() || "AN"
}

function formatCommentDate(dateInput: Date | string): string {
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

const STATUS_TABS: Array<{
  id: string
  label: string
  statusKey: keyof CommentStats | "all"
}> = [
  { id: "ALL", label: "Semua", statusKey: "all" },
  { id: "PENDING", label: "Menunggu Review", statusKey: "pending" },
  { id: "APPROVED", label: "Disetujui", statusKey: "approved" },
  { id: "SPAM", label: "Spam", statusKey: "spam" },
  { id: "REJECTED", label: "Ditolak", statusKey: "rejected" },
]

export function CommentsManagerClient({
  initialComments,
  initialStats,
}: CommentsManagerClientProps) {
  const [comments, setComments] = useState<AdminCommentItem[]>(initialComments)
  const [stats, setStats] = useState<CommentStats>(initialStats)
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [batchConfirmDelete, setBatchConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  function showFeedback(type: "success" | "error", message: string) {
    setFeedback({ type, message })
    setTimeout(() => {
      setFeedback(null)
    }, 4000)
  }

  const filteredComments = comments.filter((comment) => {
    const matchesStatus =
      selectedStatus === "ALL" ||
      comment.status.toUpperCase() === selectedStatus

    if (!matchesStatus) return false

    if (!searchQuery.trim()) return true

    const q = searchQuery.toLowerCase()
    return (
      comment.authorName.toLowerCase().includes(q) ||
      comment.authorEmail.toLowerCase().includes(q) ||
      comment.content.toLowerCase().includes(q) ||
      (comment.postTitle && comment.postTitle.toLowerCase().includes(q))
    )
  })

  const allFilteredSelected =
    filteredComments.length > 0 &&
    filteredComments.every((c) => selectedIds.includes(c.id))

  function handleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredComments.map((c) => c.id))
    }
  }

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleStatusChange(id: string, newStatus: CommentStatus) {
    startTransition(async () => {
      const prevComments = [...comments]
      const target = comments.find((c) => c.id === id)
      if (!target) return

      const prevStatus = target.status.toUpperCase() as keyof CommentStats

      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      )
      setStats((prev) => {
        const next = { ...prev }
        const prevKey = prevStatus.toLowerCase() as keyof CommentStats
        const newKey = newStatus.toLowerCase() as keyof CommentStats
        if (next[prevKey] !== undefined) next[prevKey]--
        if (next[newKey] !== undefined) next[newKey]++
        return next
      })

      const res = await updateCommentStatusAction(id, newStatus)
      if (!res.success) {
        setComments(prevComments)
        showFeedback(
          "error",
          res.error || "Gagal mengubah status moderasi komentar."
        )
      } else {
        showFeedback(
          "success",
          `Status komentar berhasil diubah menjadi ${newStatus}.`
        )
      }
    })
  }

  function handleDeleteSingle(id: string) {
    startTransition(async () => {
      const prevComments = [...comments]
      const target = comments.find((c) => c.id === id)
      if (!target) return

      const targetStatus = target.status.toLowerCase() as keyof CommentStats

      setComments((prev) => prev.filter((c) => c.id !== id))
      setSelectedIds((prev) => prev.filter((item) => item !== id))
      setStats((prev) => {
        const next = { ...prev, total: prev.total - 1 }
        if (next[targetStatus] !== undefined) next[targetStatus]--
        return next
      })
      setDeletingId(null)

      const res = await deleteCommentAction(id)
      if (!res.success) {
        setComments(prevComments)
        showFeedback("error", res.error || "Gagal menghapus komentar.")
      } else {
        showFeedback("success", "Komentar berhasil dihapus permanen.")
      }
    })
  }

  function handleBatchStatusChange(newStatus: CommentStatus) {
    if (selectedIds.length === 0) return

    startTransition(async () => {
      const idsToUpdate = [...selectedIds]
      const prevComments = [...comments]

      setComments((prev) =>
        prev.map((c) =>
          idsToUpdate.includes(c.id) ? { ...c, status: newStatus } : c
        )
      )
      setSelectedIds([])

      const res = await batchUpdateCommentsStatusAction(idsToUpdate, newStatus)
      if (!res.success) {
        setComments(prevComments)
        showFeedback(
          "error",
          res.error || "Gagal memperbarui status komentar terpilih."
        )
      } else {
        showFeedback(
          "success",
          `${idsToUpdate.length} komentar berhasil diperbarui ke status ${newStatus}.`
        )
      }
    })
  }

  function handleBatchDelete() {
    if (selectedIds.length === 0) return

    startTransition(async () => {
      const idsToDelete = [...selectedIds]
      const prevComments = [...comments]

      setComments((prev) => prev.filter((c) => !idsToDelete.includes(c.id)))
      setSelectedIds([])
      setBatchConfirmDelete(false)

      const res = await batchDeleteCommentsAction(idsToDelete)
      if (!res.success) {
        setComments(prevComments)
        showFeedback("error", res.error || "Gagal menghapus komentar terpilih.")
      } else {
        showFeedback(
          "success",
          `${idsToDelete.length} komentar berhasil dihapus permanen.`
        )
      }
    })
  }

  function getStatusBadge(status: string) {
    const s = status.toUpperCase()
    switch (s) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3" />
            Disetujui
          </span>
        )
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <Clock className="size-3" />
            Menunggu
          </span>
        )
      case "SPAM":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="size-3" />
            Spam
          </span>
        )
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-500/10 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
            <XCircle className="size-3" />
            Ditolak
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={cn(
            "flex items-center justify-between rounded-xl p-4 text-xs font-medium shadow-sm transition-all animate-in fade-in slide-in-from-top-2",
            feedback.type === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
              : "border border-destructive/30 bg-destructive/10 text-destructive"
          )}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground uppercase">
            Total Komentar
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase">
            Menunggu Review
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.pending}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase">
            Disetujui
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.approved}
          </p>
        </div>
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase">
            Terdeteksi Spam
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-rose-600 dark:text-rose-400">
            {stats.spam}
          </p>
        </div>
        <div className="col-span-2 rounded-xl border border-zinc-500/30 bg-zinc-500/5 p-4 shadow-2xs sm:col-span-1">
          <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 uppercase">
            Ditolak
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-zinc-600 dark:text-zinc-400">
            {stats.rejected}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.id
            const count =
              tab.statusKey === "all"
                ? stats.total
                : stats[tab.statusKey as keyof CommentStats]

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus:outline-hidden",
                  isActive
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 font-mono text-[10px]",
                    isActive
                      ? "bg-background/20 text-background"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari penulis, email, artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-background/80 py-2 pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
          />
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              {selectedIds.length} komentar terpilih
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleBatchStatusChange("APPROVED")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300 disabled:opacity-50"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Setujui Semua</span>
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => handleBatchStatusChange("SPAM")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-500/20 dark:text-rose-300 disabled:opacity-50"
            >
              <AlertTriangle className="size-3.5" />
              <span>Tandai Spam</span>
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => handleBatchStatusChange("REJECTED")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-500/40 bg-zinc-500/10 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-500/20 dark:text-zinc-300 disabled:opacity-50"
            >
              <XCircle className="size-3.5" />
              <span>Tolak</span>
            </button>

            {batchConfirmDelete ? (
              <div className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 bg-destructive/10 p-1">
                <span className="px-1.5 text-[11px] font-medium text-destructive">
                  Hapus permanen?
                </span>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleBatchDelete}
                  className="rounded bg-destructive px-2 py-0.5 text-[11px] font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setBatchConfirmDelete(false)}
                  className="rounded border border-border bg-card px-2 py-0.5 text-[11px] text-foreground hover:bg-muted"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={isPending}
                onClick={() => setBatchConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
              >
                <Trash2 className="size-3.5" />
                <span>Hapus Terpilih</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Batalkan Pilihan
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between border-b border-border/80 bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              aria-label="Pilih semua komentar"
              checked={allFilteredSelected}
              onChange={handleSelectAll}
              className="size-4 rounded border-border/80 text-primary accent-primary focus:ring-primary/20"
            />
            <span>Penulis & Artikel</span>
          </div>
          <div className="hidden sm:block">Konten Komentar</div>
          <div className="flex items-center gap-8 pr-2">
            <span className="hidden md:inline">Status</span>
            <span>Aksi Moderasi</span>
          </div>
        </div>

        {filteredComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
              <MessageSquare className="size-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-foreground">
              Tidak ada komentar yang ditemukan
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {searchQuery
                ? `Tidak ada komentar yang cocok dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
                : `Belum ada komentar dalam kategori ${selectedStatus}.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredComments.map((comment) => {
              const isSelected = selectedIds.includes(comment.id)
              const isExpanded = Boolean(expandedIds[comment.id])
              const isConfirmingDelete = deletingId === comment.id

              return (
                <div
                  key={comment.id}
                  className={cn(
                    "flex flex-col gap-4 p-4 transition-colors sm:flex-row sm:items-start sm:justify-between",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      aria-label={`Pilih komentar dari ${comment.authorName}`}
                      checked={isSelected}
                      onChange={() => handleToggleSelect(comment.id)}
                      className="mt-1 size-4 rounded border-border/80 text-primary accent-primary focus:ring-primary/20"
                    />

                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background shadow-2xs">
                      {getAuthorInitials(comment.authorName)}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {comment.authorName}
                        </span>
                        {getStatusBadge(comment.status)}
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                        <Mail className="size-3" />
                        <a
                          href={`mailto:${comment.authorEmail}`}
                          className="hover:text-foreground hover:underline"
                        >
                          {comment.authorEmail}
                        </a>
                      </div>

                      {comment.postTitle && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <span className="font-medium text-foreground/80">
                            Artikel:
                          </span>
                          <span className="truncate max-w-[220px] font-semibold text-foreground">
                            {comment.postTitle}
                          </span>
                          {comment.postSlug && (
                            <Link
                              href={`/blog`}
                              title="Buka artikel blog"
                              className="text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="size-3" />
                            </Link>
                          )}
                        </div>
                      )}

                      {comment.parentId && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <CornerDownRight className="size-3 text-muted-foreground" />
                          <span>Balasan dari komentar sebelumnya</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80">
                        <Clock className="size-2.5" />
                        <span>{formatCommentDate(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 px-0 sm:px-6">
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs leading-relaxed text-foreground">
                      <p className="whitespace-pre-wrap break-words">
                        {isExpanded || comment.content.length <= 160
                          ? comment.content
                          : `${comment.content.slice(0, 160)}...`}
                      </p>
                      {comment.content.length > 160 && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(comment.id)}
                          className="mt-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          {isExpanded
                            ? "Sembunyikan"
                            : "Baca selengkapnya..."}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-start">
                    {comment.status.toUpperCase() !== "APPROVED" && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          handleStatusChange(comment.id, "APPROVED")
                        }
                        title="Setujui komentar ini"
                        className="inline-flex size-7 items-center justify-center rounded-lg border border-emerald-500/30 text-emerald-600 transition-colors hover:bg-emerald-500/10 focus:outline-hidden dark:text-emerald-400"
                      >
                        <CheckCircle2 className="size-3.5" />
                      </button>
                    )}

                    {comment.status.toUpperCase() !== "SPAM" && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleStatusChange(comment.id, "SPAM")}
                        title="Tandai sebagai spam"
                        className="inline-flex size-7 items-center justify-center rounded-lg border border-rose-500/30 text-rose-600 transition-colors hover:bg-rose-500/10 focus:outline-hidden dark:text-rose-400"
                      >
                        <AlertTriangle className="size-3.5" />
                      </button>
                    )}

                    {comment.status.toUpperCase() !== "REJECTED" && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          handleStatusChange(comment.id, "REJECTED")
                        }
                        title="Tolak komentar ini"
                        className="inline-flex size-7 items-center justify-center rounded-lg border border-zinc-500/30 text-zinc-600 transition-colors hover:bg-zinc-500/10 focus:outline-hidden dark:text-zinc-400"
                      >
                        <XCircle className="size-3.5" />
                      </button>
                    )}

                    {isConfirmingDelete ? (
                      <div className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 p-1 text-xs">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleDeleteSingle(comment.id)}
                          className="rounded bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                        >
                          {isPending ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            "Ya"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(null)}
                          className="rounded border border-border bg-card px-2 py-0.5 text-[10px] text-foreground hover:bg-muted"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingId(comment.id)}
                        title="Hapus komentar permanen"
                        className="inline-flex size-7 items-center justify-center rounded-lg border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10 focus:outline-hidden"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
