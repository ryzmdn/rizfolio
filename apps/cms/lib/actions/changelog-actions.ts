"use server"

import { db, eq, desc, asc } from "@workspace/db"
import {
  changelogs,
  changelogItems,
  roadmapItems,
} from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"
import { dispatchBackgroundRevalidation } from "../revalidate"

export type CreateChangelogInput = typeof changelogs.$inferInsert
export type UpdateChangelogInput = Partial<typeof changelogs.$inferInsert>
export type CreateChangelogItemInput = typeof changelogItems.$inferInsert
export type CreateRoadmapItemInput = typeof roadmapItems.$inferInsert
export type UpdateRoadmapItemInput = Partial<typeof roadmapItems.$inferInsert>

export async function getChangelogs() {
  try {
    return await db
      .select({
        id: changelogs.id,
        version: changelogs.version,
        title: changelogs.title,
        releaseDate: changelogs.releaseDate,
        summary: changelogs.summary,
        isPublished: changelogs.isPublished,
        createdAt: changelogs.createdAt,
      })
      .from(changelogs)
      .orderBy(desc(changelogs.releaseDate))
  } catch (error) {
    console.error(
      "[CMS Changelog] Failed to fetch changelogs:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getChangelogById(id: string) {
  try {
    const [changelog] = await db
      .select()
      .from(changelogs)
      .where(eq(changelogs.id, id))
      .limit(1)
    return changelog || null
  } catch (error) {
    console.error(
      "[CMS Changelog] Failed to fetch changelog by ID:",
      error instanceof Error ? error.message : error
    )
    return null
  }
}

export async function createChangelog(values: CreateChangelogInput) {
  const [created] = await db.insert(changelogs).values(values).returning()
  if (created) {
    logTransaction({
      domain: "SYSTEM",
      actionType: "CHANGELOG_RELEASED",
      status: "COMPLETED",
      entityType: "changelogs",
      entityId: created.id,
      changelogId: created.id,
      payloadAfter: { version: created.version, title: created.title },
    })
    dispatchBackgroundRevalidation({ app: "changelog", path: "/" })
  }
  revalidatePath("/changelog")
  revalidatePath("/")
  return created
}

export async function updateChangelog(
  id: string,
  values: UpdateChangelogInput
) {
  const [updated] = await db
    .update(changelogs)
    .set(values)
    .where(eq(changelogs.id, id))
    .returning()
  if (updated) {
    logTransaction({
      domain: "SYSTEM",
      actionType: "CHANGELOG_UPDATED",
      status: "COMPLETED",
      entityType: "changelogs",
      entityId: updated.id,
      changelogId: updated.id,
      payloadAfter: values,
    })
    dispatchBackgroundRevalidation({ app: "changelog", path: "/" })
  }
  revalidatePath("/changelog")
  revalidatePath("/")
  return updated
}

export async function deleteChangelog(id: string) {
  await db.delete(changelogs).where(eq(changelogs.id, id))
  logTransaction({
    domain: "SYSTEM",
    actionType: "CHANGELOG_DELETED",
    status: "COMPLETED",
    entityType: "changelogs",
    entityId: id,
    changelogId: id,
  })
  dispatchBackgroundRevalidation({ app: "changelog", path: "/" })
  revalidatePath("/changelog")
  revalidatePath("/")
}

export async function getAllChangelogItems() {
  try {
    return await db
      .select({
        id: changelogItems.id,
        changelogId: changelogItems.changelogId,
        category: changelogItems.category,
        description: changelogItems.description,
        displayOrder: changelogItems.displayOrder,
      })
      .from(changelogItems)
      .orderBy(asc(changelogItems.displayOrder))
  } catch (error) {
    console.error(
      "[CMS Changelog] Failed to fetch all changelog items:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getChangelogItems(changelogId: string) {
  try {
    return await db
      .select()
      .from(changelogItems)
      .where(eq(changelogItems.changelogId, changelogId))
      .orderBy(asc(changelogItems.displayOrder))
  } catch (error) {
    console.error(
      "[CMS Changelog] Failed to fetch changelog items:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createChangelogItem(
  values: CreateChangelogItemInput
) {
  const [created] = await db.insert(changelogItems).values(values).returning()
  dispatchBackgroundRevalidation({ app: "changelog", path: "/" })
  revalidatePath("/changelog")
  return created
}

export async function deleteChangelogItem(id: string) {
  await db.delete(changelogItems).where(eq(changelogItems.id, id))
  dispatchBackgroundRevalidation({ app: "changelog", path: "/" })
  revalidatePath("/changelog")
}

export async function getRoadmapItems() {
  try {
    return await db
      .select({
        id: roadmapItems.id,
        title: roadmapItems.title,
        description: roadmapItems.description,
        stage: roadmapItems.stage,
        quarter: roadmapItems.quarter,
        priority: roadmapItems.priority,
        scope: roadmapItems.scope,
        relatedVersion: roadmapItems.relatedVersion,
        displayOrder: roadmapItems.displayOrder,
        createdAt: roadmapItems.createdAt,
        updatedAt: roadmapItems.updatedAt,
      })
      .from(roadmapItems)
      .orderBy(asc(roadmapItems.displayOrder), desc(roadmapItems.createdAt))
  } catch (error) {
    console.error(
      "[CMS Changelog] Failed to fetch roadmap items:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createRoadmapItem(values: CreateRoadmapItemInput) {
  const [created] = await db.insert(roadmapItems).values(values).returning()
  if (created) {
    logTransaction({
      domain: "SYSTEM",
      actionType: "ROADMAP_ITEM_CREATED",
      status: "COMPLETED",
      entityType: "roadmap_items",
      entityId: created.id,
      metadata: { title: created.title, stage: created.stage },
    })
    dispatchBackgroundRevalidation({ app: "changelog", path: "/roadmap" })
  }
  revalidatePath("/changelog")
  return created
}

export async function updateRoadmapItem(
  id: string,
  values: UpdateRoadmapItemInput
) {
  const [updated] = await db
    .update(roadmapItems)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(roadmapItems.id, id))
    .returning()
  if (updated) {
    logTransaction({
      domain: "SYSTEM",
      actionType: "ROADMAP_ITEM_UPDATED",
      status: "COMPLETED",
      entityType: "roadmap_items",
      entityId: updated.id,
      payloadAfter: values,
    })
    dispatchBackgroundRevalidation({ app: "changelog", path: "/roadmap" })
  }
  revalidatePath("/changelog")
  return updated
}

export async function deleteRoadmapItem(id: string) {
  const [deleted] = await db
    .delete(roadmapItems)
    .where(eq(roadmapItems.id, id))
    .returning()
  if (deleted) {
    logTransaction({
      domain: "SYSTEM",
      actionType: "ROADMAP_ITEM_DELETED",
      status: "COMPLETED",
      entityType: "roadmap_items",
      entityId: id,
    })
    dispatchBackgroundRevalidation({ app: "changelog", path: "/roadmap" })
  }
  revalidatePath("/changelog")
}
