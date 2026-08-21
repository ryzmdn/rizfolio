"use server"

import { db, eq, desc, asc } from "@workspace/db"
import { repositories, repoFiles, repoReleases } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"

export async function getAdminRepositories() {
  return await db
    .select()
    .from(repositories)
    .orderBy(desc(repositories.createdAt))
}

export async function getAdminRepoById(id: string) {
  const [repo] = await db
    .select()
    .from(repositories)
    .where(eq(repositories.id, id))
    .limit(1)
  return repo || null
}

export async function createRepository(
  values: typeof repositories.$inferInsert
) {
  const [created] = await db.insert(repositories).values(values).returning()
  revalidatePath("/archive")
  return created
}

export async function updateRepository(
  id: string,
  values: Partial<typeof repositories.$inferInsert>
) {
  const [updated] = await db
    .update(repositories)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(repositories.id, id))
    .returning()
  revalidatePath("/archive")
  return updated
}

export async function deleteRepository(id: string) {
  await db.delete(repositories).where(eq(repositories.id, id))
  revalidatePath("/archive")
}

export async function getAdminRepoFiles(repoId: string) {
  return await db
    .select()
    .from(repoFiles)
    .where(eq(repoFiles.repoId, repoId))
    .orderBy(desc(repoFiles.isDirectory), asc(repoFiles.path))
}

export async function createRepoFile(values: typeof repoFiles.$inferInsert) {
  const [created] = await db.insert(repoFiles).values(values).returning()
  revalidatePath("/archive")
  return created
}

export async function updateRepoFile(
  id: string,
  values: Partial<typeof repoFiles.$inferInsert>
) {
  const [updated] = await db
    .update(repoFiles)
    .set(values)
    .where(eq(repoFiles.id, id))
    .returning()
  revalidatePath("/archive")
  return updated
}

export async function deleteRepoFile(id: string) {
  await db.delete(repoFiles).where(eq(repoFiles.id, id))
  revalidatePath("/archive")
}

export async function getAdminRepoReleases(repoId: string) {
  return await db
    .select()
    .from(repoReleases)
    .where(eq(repoReleases.repoId, repoId))
    .orderBy(desc(repoReleases.createdAt))
}

export async function createRepoRelease(
  values: typeof repoReleases.$inferInsert
) {
  const [created] = await db.insert(repoReleases).values(values).returning()
  revalidatePath("/archive")
  return created
}

export async function deleteRepoRelease(id: string) {
  await db.delete(repoReleases).where(eq(repoReleases.id, id))
  revalidatePath("/archive")
}
