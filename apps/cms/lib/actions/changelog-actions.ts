"use server"

import { db, eq, desc, asc } from "@workspace/db"
import { changelogs, changelogItems } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"
import { dispatchBackgroundRevalidation } from "../revalidate"

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

export async function createChangelog(values: typeof changelogs.$inferInsert) {
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
  values: Partial<typeof changelogs.$inferInsert>
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
  values: typeof changelogItems.$inferInsert
) {
  const [created] = await db.insert(changelogItems).values(values).returning()
  revalidatePath("/changelog")
  return created
}

export async function deleteChangelogItem(id: string) {
  await db.delete(changelogItems).where(eq(changelogItems.id, id))
  revalidatePath("/changelog")
}
