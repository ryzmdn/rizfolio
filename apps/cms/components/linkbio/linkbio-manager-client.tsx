"use client"

import { useState, useTransition } from "react"
import {
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  Search,
  Sparkles,
  MousePointerClick,
  Layers,
  Globe,
  FileText,
  ShoppingBag,
  BookOpen,
  History,
  Mail,
  Code,
  Terminal,
  Cpu,
  Star,
  Share2,
  Briefcase,
  type LucideIcon,
} from "lucide-react"
import type { BioLink } from "@workspace/db"
import { Badge } from "@workspace/ui/components/badge"
import {
  createBioLinkAction,
  updateBioLinkAction,
  deleteBioLinkAction,
  toggleBioLinkStatusAction,
} from "@/lib/actions/linkbio-actions"

const AVAILABLE_ICONS = [
  "Globe",
  "FileText",
  "ShoppingBag",
  "BookOpen",
  "History",
  "Mail",
  "Code",
  "Layers",
  "Sparkles",
  "Terminal",
  "Cpu",
  "Star",
  "Share2",
  "Briefcase",
  "ExternalLink",
]

const iconMap: Record<string, LucideIcon> = {
  Globe,
  FileText,
  ShoppingBag,
  BookOpen,
  History,
  Mail,
  Code,
  Layers,
  Sparkles,
  Terminal,
  Cpu,
  Star,
  Share2,
  Briefcase,
  ExternalLink,
}

interface LinkbioManagerClientProps {
  initialLinks: BioLink[]
}

export function LinkbioManagerClient({
  initialLinks,
}: LinkbioManagerClientProps) {
  const [links, setLinks] = useState<BioLink[]>(initialLinks)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [isPending, startTransition] = useTransition()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState("")
  const [formUrl, setFormUrl] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formIcon, setFormIcon] = useState("Globe")
  const [formBadge, setFormBadge] = useState("")
  const [formBadgeColor, setFormBadgeColor] = useState(
    "bg-primary/10 text-primary border-primary/20"
  )
  const [formCategory, setFormCategory] = useState("ECOSYSTEM")
  const [formOrder, setFormOrder] = useState(0)
  const [formActive, setFormActive] = useState(true)
  const [formError, setFormError] = useState<string | null>(null)

  function openCreateModal() {
    setEditingId(null)
    setFormTitle("")
    setFormUrl("")
    setFormDescription("")
    setFormIcon("Globe")
    setFormBadge("")
    setFormBadgeColor("bg-primary/10 text-primary border-primary/20")
    setFormCategory("ECOSYSTEM")
    setFormOrder(links.length + 1)
    setFormActive(true)
    setFormError(null)
    setIsModalOpen(true)
  }

  function openEditModal(link: BioLink) {
    setEditingId(link.id)
    setFormTitle(link.title)
    setFormUrl(link.url)
    setFormDescription(link.description || "")
    setFormIcon(link.icon || "Globe")
    setFormBadge(link.badge || "")
    setFormBadgeColor(
      link.badgeColor || "bg-primary/10 text-primary border-primary/20"
    )
    setFormCategory(link.category || "ECOSYSTEM")
    setFormOrder(link.displayOrder || 0)
    setFormActive(link.isActive)
    setFormError(null)
    setIsModalOpen(true)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!formTitle.trim()) {
      setFormError("Link title is required.")
      return
    }

    if (!formUrl.trim() || !formUrl.startsWith("http")) {
      setFormError("Valid URL starting with http:// or https:// is required.")
      return
    }

    startTransition(async () => {
      if (editingId) {
        const res = await updateBioLinkAction(editingId, {
          title: formTitle.trim(),
          url: formUrl.trim(),
          description: formDescription.trim() || null,
          icon: formIcon,
          badge: formBadge.trim() || null,
          badgeColor: formBadgeColor,
          category: formCategory,
          displayOrder: Number(formOrder),
          isActive: formActive,
        })

        if (res.success && res.item) {
          setLinks((prev) =>
            prev.map((item) => (item.id === editingId ? res.item! : item))
          )
          setIsModalOpen(false)
        } else {
          setFormError(res.error || "Failed to update link.")
        }
      } else {
        const res = await createBioLinkAction({
          title: formTitle.trim(),
          url: formUrl.trim(),
          description: formDescription.trim() || null,
          icon: formIcon,
          badge: formBadge.trim() || null,
          badgeColor: formBadgeColor,
          category: formCategory,
          displayOrder: Number(formOrder),
          isActive: formActive,
          clickCount: 0,
        })

        if (res.success && res.item) {
          setLinks((prev) => [...prev, res.item!])
          setIsModalOpen(false)
        } else {
          setFormError(res.error || "Failed to create link.")
        }
      }
    })
  }

  function handleToggleStatus(id: string, currentStatus: boolean) {
    startTransition(async () => {
      const res = await toggleBioLinkStatusAction(id, currentStatus)
      if (res.success) {
        setLinks((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isActive: !currentStatus } : item
          )
        )
      }
    })
  }

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`Are you sure you want to remove link "${title}"?`))
      return

    startTransition(async () => {
      const res = await deleteBioLinkAction(id)
      if (res.success) {
        setLinks((prev) => prev.filter((item) => item.id !== id))
      }
    })
  }

  const filteredLinks = links.filter((link) => {
    const matchCategory =
      categoryFilter === "ALL" || link.category === categoryFilter
    const matchSearch =
      search === "" ||
      link.title.toLowerCase().includes(search.toLowerCase()) ||
      link.url.toLowerCase().includes(search.toLowerCase()) ||
      (link.description &&
        link.description.toLowerCase().includes(search.toLowerCase()))

    return matchCategory && matchSearch
  })

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search links by title or URL..."
                className="h-9 w-full rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary/50 focus:outline-hidden"
            >
              <option value="ALL">All Categories</option>
              <option value="ECOSYSTEM">Ecosystem</option>
              <option value="FEATURED">Featured</option>
              <option value="SOCIAL">Social</option>
              <option value="COMMUNITY">Community</option>
              <option value="RESOURCE">Resource</option>
            </select>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
          >
            <Plus className="size-3.5" />
            <span>Add Bio Link</span>
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/70 bg-card/60 shadow-xs">
          <div className="divide-y divide-border/60">
            {filteredLinks.length === 0 ? (
              <div className="py-12 text-center">
                <Layers className="mx-auto size-8 text-muted-foreground/50" />
                <p className="mt-2 text-xs font-medium text-foreground">
                  No bio links found
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Create your first bio link or adjust the search filter.
                </p>
              </div>
            ) : (
              filteredLinks.map((link) => {
                const IconComp = iconMap[link.icon] || Globe
                return (
                  <div
                    key={link.id}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-foreground">
                        <IconComp className="size-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {link.title}
                          </span>
                          {link.badge && (
                            <span
                              className={`py-0.2 rounded-md border px-1.5 font-mono text-[9px] font-medium ${link.badgeColor}`}
                            >
                              {link.badge}
                            </span>
                          )}
                          <Badge
                            variant="outline"
                            className="font-mono text-[9px]"
                          >
                            {link.category}
                          </Badge>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            #{link.displayOrder}
                          </span>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-clamp-1 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          <span className="max-w-xs truncate">{link.url}</span>
                          <ExternalLink className="size-2.5 shrink-0" />
                        </a>
                        {link.description && (
                          <p className="line-clamp-1 text-[11px] text-muted-foreground">
                            {link.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border/40 pt-2 sm:justify-end sm:border-0 sm:pt-0">
                      <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        <MousePointerClick className="size-3 text-muted-foreground" />
                        <span>{link.clickCount} clicks</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(link.id, link.isActive)
                          }
                          disabled={isPending}
                          className={`cursor-pointer rounded-md px-2 py-1 text-[10px] font-semibold transition-colors ${
                            link.isActive
                              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {link.isActive ? "Active" : "Disabled"}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(link)}
                          className="cursor-pointer rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Edit Link"
                        >
                          <Edit2 className="size-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(link.id, link.title)}
                          disabled={isPending}
                          className="cursor-pointer rounded-md border border-border p-1.5 text-rose-500 transition-colors hover:bg-rose-500/10"
                          title="Delete Link"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:col-span-4">
        <div className="sticky top-20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-foreground uppercase">
              Live Linkbio Mockup
            </span>
            <Badge variant="outline" className="font-mono text-[10px]">
              Dynamic Client View
            </Badge>
          </div>

          <div className="mx-auto w-full max-w-[340px] rounded-3xl border-4 border-foreground/20 bg-background p-4 shadow-xl">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted-foreground/30" />

            <div className="space-y-3 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-border bg-gradient-to-tr from-primary/30 to-muted text-xs font-bold text-foreground shadow-xs">
                RR
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  Rizky Ramadhan
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Software Engineer &amp; Architect
                </p>
              </div>
            </div>

            <div className="mt-5 max-h-[380px] space-y-2 overflow-y-auto pr-1">
              {links
                .filter((l) => l.isActive)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((l) => {
                  const PreviewIcon = iconMap[l.icon] || Globe
                  return (
                    <div
                      key={l.id}
                      className="flex items-center justify-between rounded-xl border border-border/80 bg-card/60 p-2.5 text-left text-xs transition-colors hover:border-foreground/30"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <PreviewIcon className="size-3.5 shrink-0 text-foreground" />
                        <span className="truncate text-[11px] font-medium text-foreground">
                          {l.title}
                        </span>
                      </div>
                      {l.badge && (
                        <span className="py-0.2 shrink-0 rounded-md border px-1 font-mono text-[8px]">
                          {l.badge}
                        </span>
                      )}
                    </div>
                  )
                })}
            </div>

            <div className="mt-4 border-t border-border/60 pt-3 text-center font-mono text-[9px] text-muted-foreground">
              apps/linkbio live preview
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div
            className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground">
                {editingId ? "Edit Bio Link" : "Create Bio Link"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {formError && (
              <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-500">
                {formError}
              </p>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Link Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Personal Portfolio & Work"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Destination URL
                </label>
                <input
                  type="url"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short tagline shown under the title"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Icon
                  </label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary/50 focus:outline-hidden"
                  >
                    {AVAILABLE_ICONS.map((iconName) => (
                      <option key={iconName} value={iconName}>
                        {iconName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary/50 focus:outline-hidden"
                  >
                    <option value="ECOSYSTEM">Ecosystem</option>
                    <option value="FEATURED">Featured</option>
                    <option value="SOCIAL">Social</option>
                    <option value="COMMUNITY">Community</option>
                    <option value="RESOURCE">Resource</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. New / Hot"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary/50 focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-col justify-end space-y-1.5">
                  <label className="flex cursor-pointer items-center gap-2 pb-2 text-xs font-medium text-foreground">
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      className="size-4 rounded border-border"
                    />
                    <span>Active on Public Bio</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Bio Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
