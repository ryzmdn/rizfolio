"use server"

import { db, eq } from "@workspace/db"
import { siteSettings } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"
import { dispatchBackgroundRevalidation, type RevalidatableApp } from "../revalidate"

const ALL_APPS: RevalidatableApp[] = [
  "portfolio",
  "blog",
  "shop",
  "docs",
  "changelog",
  "linkbio",
]

export async function getSiteSettings(key = "general") {
  try {
    const [settings] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1)
    return settings || null
  } catch (error) {
    console.error(
      "[CMS Settings] Failed to fetch settings:",
      error instanceof Error ? error.message : error
    )
    return null
  }
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

  logTransaction({
    domain: "SYSTEM",
    actionType: "SETTINGS_UPDATED",
    status: "COMPLETED",
    entityType: "site_settings",
    entityId: key,
    payloadAfter: typeof valueJson === "object" ? (valueJson as Record<string, unknown>) : { value: valueJson },
  })

  // Cascades revalidation across all consumer apps so global settings reflect immediately
  dispatchBackgroundRevalidation(
    ALL_APPS.map((app) => ({ app, path: "/" }))
  )

  revalidatePath("/settings")
  revalidatePath("/")
}
