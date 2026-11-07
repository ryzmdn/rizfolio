"use server"

import { db, eq, desc, asc, isDbConfigured } from "@workspace/db"
import { changelogs, changelogItems, roadmapItems } from "@workspace/db/schema"
import {
  insertChangelogSchema,
  insertChangelogItemSchema,
  insertRoadmapItemSchema,
} from "@workspace/db"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"
import { dispatchBackgroundRevalidation } from "../revalidate"
import {
  fallbackCmsChangelogs,
  fallbackCmsChangelogItems,
  fallbackCmsRoadmapItems,
} from "../fallback-data"

export type CreateChangelogInput = typeof changelogs.$inferInsert
export type UpdateChangelogInput = Partial<typeof changelogs.$inferInsert>
export type CreateChangelogItemInput = typeof changelogItems.$inferInsert
export type CreateRoadmapItemInput = typeof roadmapItems.$inferInsert
export type UpdateRoadmapItemInput = Partial<typeof roadmapItems.$inferInsert>

export async function getChangelogs() {
  if (!isDbConfigured) {
    return fallbackCmsChangelogs
  }
  try {
    const rows = await db
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

    return rows.length > 0 ? rows : fallbackCmsChangelogs
  } catch (error) {
    console.warn(
      "[CMS Changelog] Database query fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsChangelogs
  }
}

export async function getChangelogById(id: string) {
  if (!isDbConfigured) {
    return fallbackCmsChangelogs.find((c) => c.id === id) || null
  }
  try {
    const [changelog] = await db
      .select()
      .from(changelogs)
      .where(eq(changelogs.id, id))
      .limit(1)
    return changelog || fallbackCmsChangelogs.find((c) => c.id === id) || null
  } catch (error) {
    console.warn(
      "[CMS Changelog] Database query fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsChangelogs.find((c) => c.id === id) || null
  }
}

export async function createChangelog(values: CreateChangelogInput) {
  const validated = insertChangelogSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(changelogs).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Changelog] Mutation warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

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
  revalidatePath("/changelog")
  revalidatePath("/")
  return created
}

export async function updateChangelog(
  id: string,
  values: UpdateChangelogInput
) {
  const validated = insertChangelogSchema.partial().parse(values)
  let updated = null

  if (isDbConfigured) {
    try {
      const [res] = await db
        .update(changelogs)
        .set(validated)
        .where(eq(changelogs.id, id))
        .returning()
      updated = res
    } catch (err) {
      console.warn(
        "[CMS Changelog] Mutation warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!updated) {
    updated = {
      id,
      ...validated,
      updatedAt: new Date(),
    }
  }

  logTransaction({
    domain: "SYSTEM",
    actionType: "CHANGELOG_UPDATED",
    status: "COMPLETED",
    entityType: "changelogs",
    entityId: id,
    changelogId: id,
    payloadAfter: validated,
  })
  dispatchBackgroundRevalidation({ app: "changelog", path: "/" })
  revalidatePath("/changelog")
  revalidatePath("/")
  return updated
}

export async function deleteChangelog(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(changelogs).where(eq(changelogs.id, id))
    } catch (err) {
      console.warn(
        "[CMS Changelog] Delete warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
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
  if (!isDbConfigured) {
    return fallbackCmsChangelogItems
  }
  try {
    const rows = await db
      .select({
        id: changelogItems.id,
        changelogId: changelogItems.changelogId,
        category: changelogItems.category,
        description: changelogItems.description,
        displayOrder: changelogItems.displayOrder,
      })
      .from(changelogItems)
      .orderBy(asc(changelogItems.displayOrder))

    return rows.length > 0 ? rows : fallbackCmsChangelogItems
  } catch (error) {
    console.warn(
      "[CMS Changelog] Database query fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsChangelogItems
  }
}

export async function getChangelogItems(changelogId: string) {
  if (!isDbConfigured) {
    return fallbackCmsChangelogItems.filter(
      (i) => i.changelogId === changelogId
    )
  }
  try {
    const rows = await db
      .select()
      .from(changelogItems)
      .where(eq(changelogItems.changelogId, changelogId))
      .orderBy(asc(changelogItems.displayOrder))

    return rows.length > 0
      ? rows
      : fallbackCmsChangelogItems.filter((i) => i.changelogId === changelogId)
  } catch (error) {
    console.warn(
      "[CMS Changelog] Database query fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsChangelogItems.filter(
      (i) => i.changelogId === changelogId
    )
  }
}

export async function createChangelogItem(values: CreateChangelogItemInput) {
  const validated = insertChangelogItemSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db
        .insert(changelogItems)
        .values(validated)
        .returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Changelog] Item create warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
    }
  }

  dispatchBackgroundRevalidation({ app: "changelog", path: "/" })
  revalidatePath("/changelog")
  return created
}

export async function deleteChangelogItem(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(changelogItems).where(eq(changelogItems.id, id))
    } catch (err) {
      console.warn(
        "[CMS Changelog] Item delete warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchBackgroundRevalidation({ app: "changelog", path: "/" })
  revalidatePath("/changelog")
}

export async function getRoadmapItems() {
  if (!isDbConfigured) {
    return fallbackCmsRoadmapItems
  }
  try {
    const rows = await db
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

    return rows.length > 0 ? rows : fallbackCmsRoadmapItems
  } catch (error) {
    console.warn(
      "[CMS Changelog] Database query fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsRoadmapItems
  }
}

export async function createRoadmapItem(values: CreateRoadmapItemInput) {
  const validated = insertRoadmapItemSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(roadmapItems).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Changelog] Roadmap item create warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  logTransaction({
    domain: "SYSTEM",
    actionType: "ROADMAP_ITEM_CREATED",
    status: "COMPLETED",
    entityType: "roadmap_items",
    entityId: created.id,
    metadata: { title: created.title, stage: created.stage },
  })
  dispatchBackgroundRevalidation({ app: "changelog", path: "/roadmap" })
  revalidatePath("/changelog")
  return created
}

export async function updateRoadmapItem(
  id: string,
  values: UpdateRoadmapItemInput
) {
  const validated = insertRoadmapItemSchema.partial().parse(values)
  let updated = null

  if (isDbConfigured) {
    try {
      const [res] = await db
        .update(roadmapItems)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(roadmapItems.id, id))
        .returning()
      updated = res
    } catch (err) {
      console.warn(
        "[CMS Changelog] Roadmap update warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!updated) {
    updated = {
      id,
      ...validated,
      updatedAt: new Date(),
    }
  }

  logTransaction({
    domain: "SYSTEM",
    actionType: "ROADMAP_ITEM_UPDATED",
    status: "COMPLETED",
    entityType: "roadmap_items",
    entityId: updated.id,
    payloadAfter: validated,
  })
  dispatchBackgroundRevalidation({ app: "changelog", path: "/roadmap" })
  revalidatePath("/changelog")
  return updated
}

export async function deleteRoadmapItem(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(roadmapItems).where(eq(roadmapItems.id, id))
    } catch (err) {
      console.warn(
        "[CMS Changelog] Roadmap delete warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  logTransaction({
    domain: "SYSTEM",
    actionType: "ROADMAP_ITEM_DELETED",
    status: "COMPLETED",
    entityType: "roadmap_items",
    entityId: id,
  })
  dispatchBackgroundRevalidation({ app: "changelog", path: "/roadmap" })
  revalidatePath("/changelog")
}
