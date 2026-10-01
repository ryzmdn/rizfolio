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
}

export function BioLinkCard({ link }: BioLinkCardProps) {
  const IconComponent = iconMap[link.icon] || Globe

  function handleClick() {
    trackLinkClickAction(link.id)
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 p-4 transition-all hover:border-foreground/30 hover:bg-card/90 hover:shadow-md"
    >
      <div className="flex items-center gap-3.5">
        <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted/30 text-foreground transition-colors group-hover:border-foreground/30">
          <IconComponent className="size-5" />
        </div>
        <div className="space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {link.title}
            </span>
            {link.badge && (
              <span
                className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-medium ${
                  link.badgeColor ||
                  "border-primary/20 bg-primary/10 text-primary"
                }`}
              >
                {link.badge}
              </span>
            )}
          </div>
          {link.description && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {link.description}
            </p>
          )}
        </div>
      </div>

      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
    </a>
  )
}
