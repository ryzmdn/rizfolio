"use server"

import { db, eq } from "@workspace/db"
import { siteSettings } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"

export async function getSiteSettings(key = "general") {
  const [settings] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1)
  return settings || null
}

export async function updateSiteSettings(
  key: string,
  valueJson: unknown,
  description?: string
) {
  const existing = await getSiteSettings(key)
  if (existing) {
    await db
      .update(siteSettings)
      .set({ valueJson, description, updatedAt: new Date() })
      .where(eq(siteSettings.key, key))
  } else {
    await db.insert(siteSettings).values({ key, valueJson, description })
  }

  revalidatePath("/settings")
  revalidatePath("/")
}
