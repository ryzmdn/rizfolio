"use server"

import { db } from "@workspace/db"
import { bioLinks } from "@workspace/db/schema"
import { eq, sql } from "@workspace/db"

export async function trackLinkClickAction(linkId: string): Promise<void> {
  if (!linkId || linkId.startsWith("default-")) return

  try {
    await db
      .update(bioLinks)
      .set({
        clickCount: sql`${bioLinks.clickCount} + 1`,
      })
      .where(eq(bioLinks.id, linkId))
  } catch {
    // Non-blocking telemetry
  }
}
