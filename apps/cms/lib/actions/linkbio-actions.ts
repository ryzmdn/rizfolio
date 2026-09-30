"use server"

import { db, asc, eq } from "@workspace/db"
import { bioLinks, type BioLink, type NewBioLink } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { recordTransaction } from "./transaction-actions"

export interface BioLinkStats {
  total: number
  active: number
  totalClicks: number
}

export async function getBioLinksAdmin(): Promise<BioLink[]> {
  try {
    return await db.select().from(bioLinks).orderBy(asc(bioLinks.displayOrder))
  } catch (error) {
    console.error(
      "[CMS Linkbio] Failed to fetch bio links:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getBioLinkStats(): Promise<BioLinkStats> {
  try {
    const all = await db.select().from(bioLinks)
    const total = all.length
    const active = all.filter((l) => l.isActive).length
    const totalClicks = all.reduce((acc, curr) => acc + (curr.clickCount || 0), 0)

    return { total, active, totalClicks }
  } catch {
    return { total: 0, active: 0, totalClicks: 0 }
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
      return { success: false, error: "URL must be a valid http/https address." }
    }

    const [created] = await db
      .insert(bioLinks)
      .values({
        title,
        url,
        description: input.description?.trim() || null,
        icon: input.icon || "Globe",
        badge: input.badge?.trim() || null,
        badgeColor: input.badgeColor || "bg-primary/10 text-primary border-primary/20",
        category: input.category || "ECOSYSTEM",
        isActive: input.isActive ?? true,
        displayOrder: input.displayOrder ?? 0,
        clickCount: 0,
      })
      .returning()

    if (created) {
      await recordTransaction({
        domain: "SYSTEM",
        actionType: "BIO_LINK_CREATED",
        status: "COMPLETED",
        actorType: "OWNER",
        entityType: "BIO_LINK",
        entityId: created.id,
        metadata: { title, url, category: created.category },
      })
    }

    revalidatePath("/linkbio")
    return { success: true, item: created }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create bio link",
    }
  }
}

export async function updateBioLinkAction(
  id: string,
  input: Partial<Omit<NewBioLink, "id" | "createdAt" | "updatedAt">>
): Promise<{ success: boolean; error?: string; item?: BioLink }> {
  try {
    const [updated] = await db
      .update(bioLinks)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(bioLinks.id, id))
      .returning()

    if (updated) {
      await recordTransaction({
        domain: "SYSTEM",
        actionType: "BIO_LINK_UPDATED",
        status: "COMPLETED",
        actorType: "OWNER",
        entityType: "BIO_LINK",
        entityId: updated.id,
        metadata: { title: updated.title, url: updated.url },
      })
    }

    revalidatePath("/linkbio")
    return { success: true, item: updated }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update bio link",
    }
  }
}

export async function toggleBioLinkStatusAction(
  id: string,
  currentStatus: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(bioLinks)
      .set({
        isActive: !currentStatus,
        updatedAt: new Date(),
      })
      .where(eq(bioLinks.id, id))

    await recordTransaction({
      domain: "SYSTEM",
      actionType: "BIO_LINK_STATUS_TOGGLED",
      status: "COMPLETED",
      actorType: "OWNER",
      entityType: "BIO_LINK",
      entityId: id,
      metadata: { newStatus: !currentStatus },
    })

    revalidatePath("/linkbio")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle status",
    }
  }
}

export async function deleteBioLinkAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(bioLinks).where(eq(bioLinks.id, id))

    await recordTransaction({
      domain: "SYSTEM",
      actionType: "BIO_LINK_DELETED",
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
      error: error instanceof Error ? error.message : "Failed to delete link",
    }
  }
}
