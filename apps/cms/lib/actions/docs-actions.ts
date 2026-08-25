"use server"

import { db, eq, desc, asc } from "@workspace/db"
import { repositories, repoFiles, repoReleases } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { dispatchBackgroundRevalidation } from "../revalidate"
import { logTransaction } from "./transaction-actions"

export async function getAdminRepositories() {
  try {
    return await db
      .select({
        id: repositories.id,
        name: repositories.name,
        slug: repositories.slug,
        description: repositories.description,
        category: repositories.category,
        courseName: repositories.courseName,
        semester: repositories.semester,
        isPublic: repositories.isPublic,
        starsCount: repositories.starsCount,
        downloadsCount: repositories.downloadsCount,
        githubUrl: repositories.githubUrl,
        demoUrl: repositories.demoUrl,
        license: repositories.license,
        createdAt: repositories.createdAt,
      })
      .from(repositories)
      .orderBy(desc(repositories.createdAt))
  } catch (error) {
    console.error(
      "[CMS Docs] Failed to fetch repositories:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getAdminRepoById(id: string) {
  try {
    const [repo] = await db
      .select()
      .from(repositories)
      .where(eq(repositories.id, id))
      .limit(1)
    return repo || null
  } catch (error) {
    console.error(
      "[CMS Docs] Failed to fetch repository by ID:",
      error instanceof Error ? error.message : error
    )
    return null
  }
}

export async function createRepository(
  values: typeof repositories.$inferInsert
) {
  const [created] = await db.insert(repositories).values(values).returning()
  if (created) {
    logTransaction({
      domain: "CODE_DOCS",
      actionType: "REPO_CREATED",
      status: "COMPLETED",
      entityType: "repositories",
      entityId: created.id,
      repoId: created.id,
      payloadAfter: { slug: created.slug, name: created.name },
    })
    dispatchBackgroundRevalidation({ app: "docs", path: "/" })
  }
  revalidatePath("/docs")
  revalidatePath("/")
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
  if (updated) {
    logTransaction({
      domain: "CODE_DOCS",
      actionType: "REPO_UPDATED",
      status: "COMPLETED",
      entityType: "repositories",
      entityId: updated.id,
      repoId: updated.id,
      payloadAfter: values,
    })
    if (updated.slug) {
      dispatchBackgroundRevalidation([
        { app: "docs", path: "/" },
        { app: "docs", slug: updated.slug, path: `/repo/${updated.slug}` },
      ])
    }
  }
  revalidatePath("/docs")
  revalidatePath("/")
  return updated
}

export async function deleteRepository(id: string) {
  const [deleted] = await db
    .delete(repositories)
    .where(eq(repositories.id, id))
    .returning()
  if (deleted) {
    logTransaction({
      domain: "CODE_DOCS",
      actionType: "REPO_DELETED",
      status: "COMPLETED",
      entityType: "repositories",
      entityId: id,
      repoId: id,
    })
    dispatchBackgroundRevalidation({ app: "docs", path: "/" })
  }
  revalidatePath("/docs")
  revalidatePath("/")
}

export async function getAdminRepoFiles(repoId: string) {
  try {
    return await db
      .select({
        id: repoFiles.id,
        repoId: repoFiles.repoId,
        path: repoFiles.path,
        filename: repoFiles.filename,
        sizeBytes: repoFiles.sizeBytes,
        isDirectory: repoFiles.isDirectory,
        storageUrl: repoFiles.storageUrl,
      })
      .from(repoFiles)
      .where(eq(repoFiles.repoId, repoId))
      .orderBy(desc(repoFiles.isDirectory), asc(repoFiles.path))
  } catch (error) {
    console.error(
      "[CMS Docs] Failed to fetch repo files:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createRepoFile(values: typeof repoFiles.$inferInsert) {
  const [created] = await db.insert(repoFiles).values(values).returning()
  if (created) {
    logTransaction({
      domain: "CODE_DOCS",
      actionType: "REPO_FILE_CREATED",
      status: "COMPLETED",
      entityType: "repo_files",
      entityId: created.id,
      repoId: created.repoId,
      metadata: { path: created.path, filename: created.filename },
    })
    dispatchBackgroundRevalidation({ app: "docs", path: "/" })
  }
  revalidatePath("/docs")
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
  revalidatePath("/docs")
  return updated
}

export async function deleteRepoFile(id: string) {
  await db.delete(repoFiles).where(eq(repoFiles.id, id))
  revalidatePath("/docs")
}

export async function getAdminRepoReleases(repoId: string) {
  try {
    return await db
      .select()
      .from(repoReleases)
      .where(eq(repoReleases.repoId, repoId))
      .orderBy(desc(repoReleases.createdAt))
  } catch (error) {
    console.error(
      "[CMS Docs] Failed to fetch repo releases:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createRepoRelease(
  values: typeof repoReleases.$inferInsert
) {
  const [created] = await db.insert(repoReleases).values(values).returning()
  if (created) {
    logTransaction({
      domain: "CODE_DOCS",
      actionType: "REPO_RELEASE_PUBLISHED",
      status: "COMPLETED",
      entityType: "repo_releases",
      entityId: created.id,
      repoId: created.repoId,
      metadata: { versionTag: created.versionTag },
    })
    dispatchBackgroundRevalidation({ app: "docs", path: "/" })
  }
  revalidatePath("/docs")
  return created
}

export async function deleteRepoRelease(id: string) {
  await db.delete(repoReleases).where(eq(repoReleases.id, id))
  revalidatePath("/docs")
}
