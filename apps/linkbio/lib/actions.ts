"use server"

import { db } from "@workspace/db"
import { bioLinks, bioLinkClicks } from "@workspace/db/schema"
import { eq, sql } from "@workspace/db"
import { headers } from "next/headers"
import { createHash } from "crypto"

export async function trackLinkClickAction(linkId: string): Promise<void> {
  if (!linkId || linkId.startsWith("default-")) return

  try {
    const headersList = await headers()
    const userAgent = headersList.get("user-agent") || null
    const referrer = headersList.get("referer") || null
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const cfIp = headersList.get("cf-connecting-ip")
    const rawIp = forwardedFor
      ? forwardedFor.split(",")[0]?.trim() || null
      : realIp
        ? realIp.trim()
        : cfIp
          ? cfIp.trim()
          : null
    const ipHash = rawIp
      ? createHash("sha256").update(rawIp).digest("hex")
      : null

    await Promise.all([
      db
        .update(bioLinks)
        .set({
          clickCount: sql`${bioLinks.clickCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(bioLinks.id, linkId)),
      db.insert(bioLinkClicks).values({
        linkId,
        referrer,
        userAgent,
        ipHash,
      }),
    ])
  } catch (error) {
    void error
  }
}
