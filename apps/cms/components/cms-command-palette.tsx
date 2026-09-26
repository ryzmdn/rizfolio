"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  LayoutDashboard,
  Activity,
  User,
  FileText,
  ShoppingBag,
  BookOpen,
  History,
  Image,
  Settings,
  PlusCircle,
  RefreshCw,
  ExternalLink,
  X,
  CornerDownLeft,
} from "lucide-react"

interface CommandItem {
  id: string
  title: string
  description: string
  category: "Navigasi" | "Aksi Cepat" | "Ekosistem Monorepo"
  href: string
  isExternal?: boolean
  icon: React.ComponentType<{ className?: string }>
}

const COMMAND_ITEMS: CommandItem[] = [
  {
    id: "nav-overview",
    title: "Overview",
    description: "Dashboard ringkasan metrik dan status ekosistem",
    category: "Navigasi",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    id: "nav-transactions",
    title: "Master Transactions",
    description: "Ledger audit trail transaksi dan catatan aktivitas",
    category: "Navigasi",
    href: "/transactions",
    icon: Activity,
  },
  {
    id: "nav-portfolio",
    title: "Portfolio Manager",
    description: "Profil bio, pengalaman, pendidikan, dan karya",
    category: "Navigasi",
    href: "/portfolio",
    icon: User,
  },
  {
    id: "nav-blog",
    title: "Blog Manager",
    description: "Artikel teknis, draf, dan taksonomi kategori",
    category: "Navigasi",
    href: "/blog",
    icon: FileText,
  },
  {
    id: "nav-shop",
    title: "Shop & Orders",
    description: "Katalog produk digital, unduhan file, dan pesanan",
    category: "Navigasi",
    href: "/shop",
    icon: ShoppingBag,
  },
  {
    id: "nav-docs",
    title: "Docs & Repositories",
    description: "Repositori sumber terbuka dan dokumentasi teknis",
    category: "Navigasi",
    href: "/docs",
    icon: BookOpen,
  },
  {
    id: "nav-changelog",
    title: "Changelog Manager",
    description: "Catatan rilis versi dan peta jalan fitur",
    category: "Navigasi",
    href: "/changelog",
    icon: History,
  },
  {
    id: "nav-media",
    title: "Media Library",
    description: "Penyimpanan aset visual dan CDN Supabase",
    category: "Navigasi",
    href: "/media",
    icon: Image,
  },
  {
    id: "nav-settings",
    title: "Settings & System",
    description: "Konfigurasi situs dan revalidasi cache ISR",
    category: "Navigasi",
    href: "/settings",
    icon: Settings,
  },
  {
    id: "action-new-post",
    title: "Tulis Artikel Baru",
    description: "Buka modul blog untuk menulis artikel baru",
    category: "Aksi Cepat",
    href: "/blog",
    icon: PlusCircle,
  },
  {
    id: "action-new-product",
    title: "Tambah Produk Toko",
    description: "Buka modul shop untuk mendaftarkan aset digital",
    category: "Aksi Cepat",
    href: "/shop",
    icon: PlusCircle,
  },
  {
    id: "action-new-repo",
    title: "Tambah Repositori Docs",
    description: "Buka modul docs untuk mendaftarkan repositori baru",
    category: "Aksi Cepat",
    href: "/docs",
    icon: PlusCircle,
  },
  {
    id: "action-new-release",
    title: "Catat Rilis Changelog",
    description: "Buka modul changelog untuk mencatat versi baru",
    category: "Aksi Cepat",
    href: "/changelog",
    icon: PlusCircle,
  },
  {
    id: "action-upload-media",
    title: "Unggah Berkas Media",
    description: "Buka media library untuk mengunggah file baru",
    category: "Aksi Cepat",
    href: "/media",
    icon: PlusCircle,
  },
  {
    id: "action-revalidate",
    title: "Revalidasi Cache Monorepo",
    description: "Buka settings untuk membersihkan cache ISR",
    category: "Aksi Cepat",
    href: "/settings",
    icon: RefreshCw,
  },
  {
    id: "app-portfolio",
    title: "Portfolio Live Site",
    description: "Buka aplikasi portfolio publik di tab baru",
    category: "Ekosistem Monorepo",
    href: process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev",
    isExternal: true,
    icon: ExternalLink,
  },
  {
    id: "app-blog",
    title: "Blog Platform",
    description: "Buka portal artikel teknis di tab baru",
    category: "Ekosistem Monorepo",
    href: process.env.NEXT_PUBLIC_BLOG_URL || "https://blog.rizkyramadhan.dev",
    isExternal: true,
    icon: ExternalLink,
  },
  {
    id: "app-docs",
    title: "Documentation Platform",
    description: "Buka portal dokumentasi teknis di tab baru",
    category: "Ekosistem Monorepo",
    href: process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.rizkyramadhan.dev",
    isExternal: true,
    icon: ExternalLink,
  },
  {
    id: "app-shop",
    title: "Shop & Commerce Store",
    description: "Buka etalase toko digital di tab baru",
    category: "Ekosistem Monorepo",
    href: process.env.NEXT_PUBLIC_SHOP_URL || "https://shop.rizkyramadhan.dev",
    isExternal: true,
    icon: ExternalLink,
  },
  {
    id: "app-changelog",
    title: "Product Changelog",
    description: "Buka linimasa rilis publik di tab baru",
    category: "Ekosistem Monorepo",
    href: process.env.NEXT_PUBLIC_CHANGELOG_URL || "https://changelog.rizkyramadhan.dev",
    isExternal: true,
    icon: ExternalLink,
  },
]

interface CmsCommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CmsCommandPalette({ isOpen, onClose }: CmsCommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [rawIndex, setRawIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const filteredItems = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim()
    if (!cleanQuery) return COMMAND_ITEMS

    return COMMAND_ITEMS.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(cleanQuery)
      const matchDesc = item.description.toLowerCase().includes(cleanQuery)
      const matchCategory = item.category.toLowerCase().includes(cleanQuery)
      return matchTitle || matchDesc || matchCategory
    })
  }, [query])

  const selectedIndex = Math.min(
    rawIndex,
    Math.max(0, filteredItems.length - 1)
  )

  function handleClose() {
    setQuery("")
    setRawIndex(0)
    onClose()
  }

  function handleSelect(item: CommandItem) {
    handleClose()
    if (item.isExternal) {
      window.open(item.href, "_blank", "noopener,noreferrer")
    } else {
      router.push(item.href)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault()
      handleClose()
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setRawIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : 0
      )
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      setRawIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItems.length - 1
      )
      return
    }

    if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault()
      handleSelect(filteredItems[selectedIndex])
      return
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Search"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24"
      onKeyDown={handleKeyDown}
    >
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative z-50 flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-center gap-3 border-b border-border/80 px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setRawIndex(0)
            }}
            placeholder="Cari navigasi, aksi cepat, atau ekosistem monorepo..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setRawIndex(0)
              }}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
          <kbd className="hidden rounded border border-border/80 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
            Esc
          </kbd>
        </div>

        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto p-2"
        >
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Tidak ada hasil yang cocok dengan &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = item.icon
                const isSelected = index === selectedIndex

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setRawIndex(index)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${
                          isSelected
                            ? "border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground"
                            : "border-border/80 bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        <span
                          className={`text-[11px] ${
                            isSelected
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] uppercase font-mono ${
                          isSelected
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.category}
                      </span>
                      {isSelected && (
                        <CornerDownLeft className="size-3 text-primary-foreground" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/80 bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Pilih dengan panah</span>
            <kbd className="rounded border border-border/80 bg-background px-1 text-[10px]">
              ↑
            </kbd>
            <kbd className="rounded border border-border/80 bg-background px-1 text-[10px]">
              ↓
            </kbd>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Buka</span>
            <kbd className="rounded border border-border/80 bg-background px-1 text-[10px]">
              Enter
            </kbd>
          </div>
        </div>
      </div>
    </div>
  )
}
