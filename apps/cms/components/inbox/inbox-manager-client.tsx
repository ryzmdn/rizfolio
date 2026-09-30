"use client"

import { useState, useTransition } from "react"
import {
  Inbox,
  Mail,
  Search,
  ExternalLink,
  Trash2,
  X,
  Send,
  User,
} from "lucide-react"
import type { Inquiry } from "@workspace/db"
import {
  updateInquiryStatusAction,
  deleteInquiryAction,
} from "@/lib/actions/inbox-actions"

interface InboxManagerClientProps {
  initialInquiries: Inquiry[]
}

const defaultBadge = {
  label: "New Inquiry",
  className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
}

const statusBadges: Record<
  string,
  { label: string; className: string }
> = {
  NEW: defaultBadge,
  IN_REVIEW: {
    label: "In Review",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  RESPONDED: {
    label: "Responded",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-border",
  },
}

export function InboxManagerClient({
  initialInquiries,
}: InboxManagerClientProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [replyNotes, setReplyNotes] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSelectInquiry(inq: Inquiry) {
    setSelectedInquiry(inq)
    setReplyNotes(inq.replyNotes || "")
  }

  function handleUpdateStatus(newStatus: string) {
    if (!selectedInquiry) return

    startTransition(async () => {
      const res = await updateInquiryStatusAction(
        selectedInquiry.id,
        newStatus,
        replyNotes
      )
      if (res.success) {
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === selectedInquiry.id
              ? {
                  ...item,
                  status: newStatus,
                  replyNotes,
                  respondedAt: newStatus === "RESPONDED" ? new Date() : item.respondedAt,
                }
              : item
          )
        )
        setSelectedInquiry((prev) =>
          prev ? { ...prev, status: newStatus, replyNotes } : null
        )
      }
    })
  }

  function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) return

    startTransition(async () => {
      const res = await deleteInquiryAction(id)
      if (res.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id))
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null)
        }
      }
    })
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchStatus = statusFilter === "ALL" || inq.status === statusFilter
    const term = search.toLowerCase()
    const matchSearch =
      search === "" ||
      inq.name.toLowerCase().includes(term) ||
      inq.email.toLowerCase().includes(term) ||
      (inq.subject && inq.subject.toLowerCase().includes(term)) ||
      inq.message.toLowerCase().includes(term)

    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sender, email, subject, or message..."
              className="h-9 w-full rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1 text-xs">
            {["ALL", "NEW", "IN_REVIEW", "RESPONDED", "ARCHIVED"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="font-mono text-xs text-muted-foreground shrink-0">
          Showing <span className="font-medium text-foreground">{filteredInquiries.length}</span> of{" "}
          <span className="font-medium text-foreground">{inquiries.length}</span> inquiries
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card/60 shadow-xs">
        <div className="divide-y divide-border/60">
          {filteredInquiries.length === 0 ? (
            <div className="py-16 text-center">
              <Inbox className="mx-auto size-9 text-muted-foreground/40" />
              <p className="mt-2 text-xs font-semibold text-foreground">
                No inquiries in this view
              </p>
              <p className="text-[11px] text-muted-foreground">
                All client proposals and incoming project messages will appear here.
              </p>
            </div>
          ) : (
            filteredInquiries.map((inq) => {
              const badge = statusBadges[inq.status] ?? defaultBadge
              const isSelected = selectedInquiry?.id === inq.id
              return (
                <div
                  key={inq.id}
                  onClick={() => handleSelectInquiry(inq)}
                  className={`flex flex-col gap-3 p-4 transition-colors cursor-pointer hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between ${
                    isSelected ? "bg-muted/40 border-l-2 border-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-muted/40 text-foreground shrink-0 mt-0.5">
                      <User className="size-4" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground">
                          {inq.name}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          &lt;{inq.email}&gt;
                        </span>
                        <span
                          className={`rounded-md border px-1.5 py-0.2 font-mono text-[9px] font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                        <span>{inq.subject || "No Subject"}</span>
                      </div>

                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {inq.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end shrink-0 border-t border-border/40 pt-2 sm:border-0 sm:pt-0">
                    <div className="flex flex-col items-end gap-1">
                      {inq.projectScope && (
                        <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {inq.projectScope}
                        </span>
                      )}
                      <time className="font-mono text-[10px] text-muted-foreground">
                        {new Date(inq.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectInquiry(inq)
                      }}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {selectedInquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Client Project Inquiry Details
                  </h3>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    ID: {selectedInquiry.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  Sender Information
                </span>
                <p className="text-xs font-bold text-foreground">
                  {selectedInquiry.name}
                </p>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                    `Re: ${selectedInquiry.subject || "Project Inquiry"}`
                  )}`}
                  className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                >
                  <span>{selectedInquiry.email}</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  Project Parameters
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-foreground">
                    {selectedInquiry.projectScope || "General Inquiry"}
                  </span>
                  {selectedInquiry.budgetRange && (
                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-500">
                      Budget: {selectedInquiry.budgetRange}
                    </span>
                  )}
                </div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground">
                Subject: {selectedInquiry.subject || "No Subject"}
              </span>
              <div className="rounded-xl border border-border/80 bg-background p-4 text-xs leading-relaxed text-foreground whitespace-pre-wrap font-sans">
                {selectedInquiry.message}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Internal Admin Notes &amp; Follow-up Actions
              </label>
              <textarea
                rows={3}
                value={replyNotes}
                onChange={(e) => setReplyNotes(e.target.value)}
                placeholder="Log internal decisions, call notes, or follow-up status..."
                className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleUpdateStatus("IN_REVIEW")}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
                >
                  Mark In Review
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleUpdateStatus("RESPONDED")}
                  className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                >
                  Mark Responded
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleUpdateStatus("ARCHIVED")}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  Archive
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                    `Re: ${selectedInquiry.subject || "Project Inquiry"}`
                  )}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="size-3" />
                  <span>Reply via Email</span>
                </a>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="rounded-lg border border-border p-1.5 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  title="Delete Inquiry"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
