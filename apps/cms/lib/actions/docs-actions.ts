"use server"

import { db, eq, desc, asc, isDbConfigured } from "@workspace/db"
import { repositories, repoFiles, repoReleases } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { dispatchBackgroundRevalidation } from "../revalidate"
import { logTransaction } from "./transaction-actions"
import { fallbackCmsRepositories } from "../fallback-data"

export type CreateRepositoryInput = typeof repositories.$inferInsert
export type UpdateRepositoryInput = Partial<typeof repositories.$inferInsert>

export async function getAdminRepositories() {
  if (!isDbConfigured) {
    return fallbackCmsRepositories
  }
  try {
    const rows = await db
      .select({
        id: repositories.id,
        name: repositories.name,
        slug: repositories.slug,
        description: repositories.description,
        category: repositories.category,
        courseName: repositories.courseName,
        semester: repositories.semester,
        techStack: repositories.techStack,
        githubUrl: repositories.githubUrl,
        demoUrl: repositories.demoUrl,
        license: repositories.license,
        starsCount: repositories.starsCount,
        viewsCount: repositories.viewsCount,
        downloadsCount: repositories.downloadsCount,
        readmeContent: repositories.readmeContent,
        isPublic: repositories.isPublic,
        createdAt: repositories.createdAt,
        updatedAt: repositories.updatedAt,
      })
      .from(repositories)
      .orderBy(desc(repositories.createdAt))

    return rows.length > 0 ? rows : fallbackCmsRepositories
  } catch (error) {
    console.warn(
      "[CMS Docs] Database repositories fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsRepositories
  }
}

export async function getAdminRepoById(id: string) {
  if (!isDbConfigured) {
    return fallbackCmsRepositories.find((r) => r.id === id) || null
  }
  try {
    const [repo] = await db
      .select()
      .from(repositories)
      .where(eq(repositories.id, id))
      .limit(1)
    return repo || fallbackCmsRepositories.find((r) => r.id === id) || null
  } catch (error) {
    console.warn(
      "[CMS Docs] Database query fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsRepositories.find((r) => r.id === id) || null
  }
}

export async function createRepository(values: CreateRepositoryInput) {
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(repositories).values(values).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Docs] Create repo warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...values,
      starsCount: 0,
      viewsCount: 0,
      downloadsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

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
  revalidatePath("/docs")
  revalidatePath("/")
  return created
}

export async function updateRepository(
  id: string,
  values: UpdateRepositoryInput
) {
  let updated = null

  if (isDbConfigured) {
    try {
      const [res] = await db
        .update(repositories)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(repositories.id, id))
        .returning()
      updated = res
    } catch (err) {
      console.warn(
        "[CMS Docs] Update repo warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!updated) {
    updated = {
      id,
      ...values,
      updatedAt: new Date(),
    }
  }

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
  revalidatePath("/docs")
  revalidatePath("/")
  return updated
}

export async function deleteRepository(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(repositories).where(eq(repositories.id, id))
    } catch (err) {
      console.warn(
        "[CMS Docs] Delete repo warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  logTransaction({
    domain: "CODE_DOCS",
    actionType: "REPO_DELETED",
    status: "COMPLETED",
    entityType: "repositories",
    entityId: id,
    repoId: id,
  })
  dispatchBackgroundRevalidation({ app: "docs", path: "/" })
  revalidatePath("/docs")
  revalidatePath("/")
}

export async function getAllAdminRepoFiles() {
  if (!isDbConfigured) {
    return []
  }
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
        contentText: repoFiles.contentText,
      })
      .from(repoFiles)
      .orderBy(desc(repoFiles.isDirectory), asc(repoFiles.path))
  } catch (error) {
    console.warn(
      "[CMS Docs] Database repo files fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return []
  }
}

export async function getAdminRepoFiles(repoId: string) {
  if (!isDbConfigured) {
    return []
  }
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
        contentText: repoFiles.contentText,
      })
      .from(repoFiles)
      .where(eq(repoFiles.repoId, repoId))
      .orderBy(desc(repoFiles.isDirectory), asc(repoFiles.path))
  } catch (error) {
    console.warn(
      "[CMS Docs] Database repo files fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return []
  }
}

export async function createRepoFile(values: typeof repoFiles.$inferInsert) {
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(repoFiles).values(values).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Docs] Create file warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...values,
      createdAt: new Date(),
    }
  }

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
  revalidatePath("/docs")
  return created
}

export async function updateRepoFile(
  id: string,
  values: Partial<typeof repoFiles.$inferInsert>
) {
  let updated = null

  if (isDbConfigured) {
    try {
      const [res] = await db
        .update(repoFiles)
        .set(values)
        .where(eq(repoFiles.id, id))
        .returning()
      updated = res
    } catch (err) {
      console.warn(
        "[CMS Docs] Update file warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!updated) {
    updated = {
      id,
      ...values,
    }
  }

  dispatchBackgroundRevalidation({ app: "docs", path: "/" })
  revalidatePath("/docs")
  return updated
}

export async function deleteRepoFile(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(repoFiles).where(eq(repoFiles.id, id))
    } catch (err) {
      console.warn(
        "[CMS Docs] Delete file warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchBackgroundRevalidation({ app: "docs", path: "/" })
  revalidatePath("/docs")
}

export async function getAllAdminRepoReleases() {
  if (!isDbConfigured) {
    return []
  }
  try {
    return await db
      .select()
      .from(repoReleases)
      .orderBy(desc(repoReleases.createdAt))
  } catch (error) {
    console.warn(
      "[CMS Docs] Database releases fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return []
  }
}

export async function getAdminRepoReleases(repoId: string) {
  if (!isDbConfigured) {
    return []
  }
  try {
    return await db
      .select()
      .from(repoReleases)
      .where(eq(repoReleases.repoId, repoId))
      .orderBy(desc(repoReleases.createdAt))
  } catch (error) {
    console.warn(
      "[CMS Docs] Database releases fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return []
  }
}

export async function createRepoRelease(
  values: typeof repoReleases.$inferInsert
) {
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(repoReleases).values(values).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Docs] Create release warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...values,
      createdAt: new Date(),
    }
  }

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
  revalidatePath("/docs")
  return created
}

export async function deleteRepoRelease(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(repoReleases).where(eq(repoReleases.id, id))
    } catch (err) {
      console.warn(
        "[CMS Docs] Delete release warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchBackgroundRevalidation({ app: "docs", path: "/" })
  revalidatePath("/docs")
}
