"use server"

import { db, asc, eq, isDbConfigured } from "@workspace/db"
import { bioLinks, type BioLink, type NewBioLink } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { recordTransaction } from "./transaction-actions"

export interface BioLinkStats {
  total: number
  active: number
  totalClicks: number
}

const fallbackBioLinks: BioLink[] = [
  {
    id: "bio-1",
    title: "Personal Portfolio & Architecture",
    description: "Full case studies, career journey, and technical solutions",
    url: "https://portfolio.ryzmdn.me",
    icon: "Globe",
    badge: "Main",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    category: "ECOSYSTEM",
    isActive: true,
    displayOrder: 1,
    clickCount: 128,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  },
  {
    id: "bio-2",
    title: "Engineering Blog",
    description: "Deep dives on full-stack architecture, Next.js, and scaling",
    url: "https://blog.ryzmdn.me",
    icon: "FileText",
    badge: "Articles",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    category: "ECOSYSTEM",
    isActive: true,
    displayOrder: 2,
    clickCount: 94,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  },
  {
    id: "bio-3",
    title: "Digital Store & UI Kits",
    description: "Production boilerplates, UI templates, and dev tools",
    url: "https://shop.ryzmdn.me",
    icon: "ShoppingBag",
    badge: "Shop",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    category: "ECOSYSTEM",
    isActive: true,
    displayOrder: 3,
    clickCount: 76,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  },
]

export async function getBioLinksAdmin(): Promise<BioLink[]> {
  if (!isDbConfigured) {
    return fallbackBioLinks
  }
  try {
    const rows = await db.select().from(bioLinks).orderBy(asc(bioLinks.displayOrder))
    return rows.length > 0 ? rows : fallbackBioLinks
  } catch (error) {
    console.warn(
      "[CMS Linkbio] Database bio links fallback:",
      error instanceof Error ? error.message : error
    )
    return fallbackBioLinks
  }
}

export async function getBioLinkStats(): Promise<BioLinkStats> {
  if (!isDbConfigured) {
    return {
      total: fallbackBioLinks.length,
      active: fallbackBioLinks.filter((l) => l.isActive).length,
      totalClicks: fallbackBioLinks.reduce((acc, curr) => acc + (curr.clickCount || 0), 0),
    }
  }

  try {
    const all = await db.select().from(bioLinks)
    const total = all.length
    const active = all.filter((l) => l.isActive).length
    const totalClicks = all.reduce(
      (acc, curr) => acc + (curr.clickCount || 0),
      0
    )

    return { total, active, totalClicks }
  } catch {
    return {
      total: fallbackBioLinks.length,
      active: fallbackBioLinks.filter((l) => l.isActive).length,
      totalClicks: fallbackBioLinks.reduce((acc, curr) => acc + (curr.clickCount || 0), 0),
    }
  }
}

export async function createBioLinkAction(
  input: Omit<NewBioLink, "id" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; error?: string; item?: BioLink }> {
  try {
    const title = input.title?.trim()
    const url = input.url?.trim()

    if (!title || title.length < 2) {
      return { success: false, error: "Title must be at least 2 characters." }
    }

    if (!url || !url.startsWith("http")) {
      return {
        success: false,
        error: "URL must be a valid http/https address.",
      }
    }

    let created: BioLink | undefined

    if (isDbConfigured) {
      const [res] = await db
        .insert(bioLinks)
        .values({
          title,
          url,
          description: input.description?.trim() || null,
          icon: input.icon || "Globe",
          badge: input.badge?.trim() || null,
          badgeColor: input.badgeColor || null,
          category: input.category || "GENERAL",
          isActive: input.isActive ?? true,
          displayOrder: input.displayOrder ?? 0,
        })
        .returning()
      created = res
    }

    if (!created) {
      created = {
        id: crypto.randomUUID(),
        title,
        url,
        description: input.description?.trim() || null,
        icon: input.icon || "Globe",
        badge: input.badge?.trim() || null,
        badgeColor: input.badgeColor || null,
        category: input.category || "GENERAL",
        isActive: input.isActive ?? true,
        displayOrder: input.displayOrder ?? 0,
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    await recordTransaction({
      domain: "PORTFOLIO",
      actionType: "LINKBIO_LINK_CREATED",
      status: "COMPLETED",
      actorType: "OWNER",
      entityType: "BIO_LINK",
      entityId: created.id,
      metadata: { title: created.title, url: created.url },
    })

    revalidatePath("/linkbio")
    return { success: true, item: created }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create bio link",
    }
  }
}

export async function updateBioLinkAction(
  id: string,
  input: Partial<Omit<NewBioLink, "id" | "createdAt" | "updatedAt">>
): Promise<{ success: boolean; error?: string; item?: BioLink }> {
  try {
    let updated: BioLink | undefined

    if (isDbConfigured) {
      const [res] = await db
        .update(bioLinks)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(bioLinks.id, id))
        .returning()
      updated = res
    }

    if (!updated) {
      const match = fallbackBioLinks.find((b) => b.id === id)
      updated = {
        id,
        title: input.title ?? match?.title ?? "Bio Link",
        url: input.url ?? match?.url ?? "https://ryzmdn.me",
        description: input.description !== undefined ? input.description : (match?.description ?? null),
        icon: input.icon ?? match?.icon ?? "Globe",
        badge: input.badge !== undefined ? input.badge : (match?.badge ?? null),
        badgeColor: input.badgeColor !== undefined ? input.badgeColor : (match?.badgeColor ?? null),
        category: input.category ?? match?.category ?? "GENERAL",
        isActive: input.isActive ?? match?.isActive ?? true,
        displayOrder: input.displayOrder ?? match?.displayOrder ?? 0,
        clickCount: match?.clickCount ?? 0,
        createdAt: match?.createdAt ?? new Date(),
        updatedAt: new Date(),
      }
    }

    await recordTransaction({
      domain: "PORTFOLIO",
      actionType: "LINKBIO_LINK_UPDATED",
      status: "COMPLETED",
      actorType: "OWNER",
      entityType: "BIO_LINK",
      entityId: id,
    })

    revalidatePath("/linkbio")
    return { success: true, item: updated }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update bio link",
    }
  }
}

export async function deleteBioLinkAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isDbConfigured) {
      await db.delete(bioLinks).where(eq(bioLinks.id, id))
    }

    await recordTransaction({
      domain: "PORTFOLIO",
      actionType: "LINKBIO_LINK_DELETED",
      status: "COMPLETED",
      actorType: "OWNER",
      entityType: "BIO_LINK",
      entityId: id,
    })

    revalidatePath("/linkbio")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete bio link",
    }
  }
}

export async function toggleBioLinkStatusAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isDbConfigured) {
      await db
        .update(bioLinks)
        .set({
          isActive,
          updatedAt: new Date(),
        })
        .where(eq(bioLinks.id, id))
    }

    await recordTransaction({
      domain: "PORTFOLIO",
      actionType: "LINKBIO_LINK_STATUS_TOGGLED",
      status: "COMPLETED",
      actorType: "OWNER",
      entityType: "BIO_LINK",
      entityId: id,
      metadata: { isActive },
    })

    revalidatePath("/linkbio")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to toggle status",
    }
  }
}
