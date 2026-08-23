"use server"

import { db, eq, desc, asc } from "@workspace/db"
import { changelogs, changelogItems } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { recordTransaction } from "./transaction-actions"

export async function getChangelogs() {
  return await db
    .select()
    .from(changelogs)
    .orderBy(desc(changelogs.releaseDate))
}

export async function getChangelogById(id: string) {
  const [changelog] = await db
    .select()
    .from(changelogs)
    .where(eq(changelogs.id, id))
    .limit(1)
  return changelog || null
}

export async function createChangelog(values: typeof changelogs.$inferInsert) {
  const [created] = await db.insert(changelogs).values(values).returning()
  if (created) {
    await recordTransaction({
      domain: "SYSTEM",
      actionType: "CHANGELOG_RELEASED",
      status: "COMPLETED",
      entityType: "changelogs",
      entityId: created.id,
      changelogId: created.id,
      payloadAfter: { version: created.version, title: created.title },
    })
  }
  revalidatePath("/changelog")
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
    await recordTransaction({
      domain: "SYSTEM",
      actionType: "CHANGELOG_UPDATED",
      status: "COMPLETED",
      entityType: "changelogs",
      entityId: updated.id,
      changelogId: updated.id,
      payloadAfter: values,
    })
  }
  revalidatePath("/changelog")
  return updated
}

export async function deleteChangelog(id: string) {
  await db.delete(changelogs).where(eq(changelogs.id, id))
  await recordTransaction({
    domain: "SYSTEM",
    actionType: "CHANGELOG_DELETED",
    status: "COMPLETED",
    entityType: "changelogs",
    entityId: id,
    changelogId: id,
  })
  revalidatePath("/changelog")
}

export async function getChangelogItems(changelogId: string) {
  return await db
    .select()
    .from(changelogItems)
    .where(eq(changelogItems.changelogId, changelogId))
    .orderBy(asc(changelogItems.displayOrder))
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
