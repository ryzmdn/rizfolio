"use server"

import { db, eq, sql } from "@workspace/db"
import { repositories } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"

export async function incrementRepoView(slug: string): Promise<void> {
  try {
    await db
      .update(repositories)
      .set({
        viewsCount: sql`${repositories.viewsCount} + 1`,
      })
      .where(eq(repositories.slug, slug))
  } catch (error) {
    console.error(`Failed to increment view for ${slug}:`, error)
  }
}

export async function incrementRepoDownload(slug: string): Promise<void> {
  try {
    await db
      .update(repositories)
      .set({
        downloadsCount: sql`${repositories.downloadsCount} + 1`,
      })
      .where(eq(repositories.slug, slug))

    revalidatePath(`/repo/${slug}`)
  } catch (error) {
    console.error(`Failed to increment download for ${slug}:`, error)
  }
}

export async function toggleRepoStar(
  slug: string,
  increment = true
): Promise<number | null> {
  try {
    const change = increment ? 1 : -1
    const [updated] = await db
      .update(repositories)
      .set({
        starsCount: sql`GREATEST(0, ${repositories.starsCount} + ${change})`,
      })
      .where(eq(repositories.slug, slug))
      .returning({ starsCount: repositories.starsCount })

    revalidatePath(`/repo/${slug}`)
    revalidatePath("/")
    return updated?.starsCount ?? null
  } catch (error) {
    console.error(`Failed to toggle star for ${slug}:`, error)
    return null
  }
}
