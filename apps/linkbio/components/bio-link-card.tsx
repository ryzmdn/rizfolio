"use client"

import {
  Globe,
  FileText,
  ShoppingBag,
  BookOpen,
  History,
  Mail,
  ArrowUpRight,
  Code,
  Layers,
  Sparkles,
  Terminal,
  ExternalLink,
  Briefcase,
  Cpu,
  Star,
  Share2,
  type LucideIcon,
} from "lucide-react"
import type { BioLink } from "@workspace/db"
import { trackLinkClickAction } from "@/lib/actions"

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
  ExternalLink,
  Briefcase,
  Cpu,
  Star,
  Share2,
}

interface BioLinkCardProps {
  link: BioLink
  index?: number
}

export function BioLinkCard({ link, index }: BioLinkCardProps) {
  const IconComponent = iconMap[link.icon] || Globe
  const indexStr = index !== undefined ? String(index + 1).padStart(2, "0") : null

  function handleClick() {
    trackLinkClickAction(link.id)
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${link.title}${link.description ? `: ${link.description}` : ""} (opens in new tab)`}
      onClick={handleClick}
      className="group flex items-center justify-between rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-4 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/[0.035] sm:p-5"
    >
      <div className="flex items-center gap-4">
        {indexStr && (
          <span className="font-mono text-xs text-foreground/30 transition-colors group-hover:text-foreground/70">
            {indexStr}
          </span>
        )}

        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.02] text-foreground transition-colors group-hover:border-foreground/25">
          <IconComponent className="size-4 stroke-[1.5]" aria-hidden="true" />
        </div>

        <div className="space-y-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground">
              {link.title}
            </span>
            {link.badge && (
              <span className="rounded-full border border-foreground/15 bg-foreground/[0.03] px-2 py-0.5 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                {link.badge}
              </span>
            )}
          </div>
          {link.description && (
            <p className="line-clamp-1 text-xs font-light text-muted-foreground">
              {link.description}
            </p>
          )}
        </div>
      </div>

      <div className="ml-3 flex size-7 shrink-0 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-all duration-300 group-hover:border-foreground/20 group-hover:text-foreground">
        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </div>
    </a>
  )
}
