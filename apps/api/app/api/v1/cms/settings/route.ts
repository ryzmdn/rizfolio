import { db, eq } from "@workspace/db"
import { siteSettings } from "@workspace/db/schema"
import { createApiHandler, apiSuccess } from "@/lib/api"
import { updateSettingsSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db.select().from(siteSettings)
    const settingsMap: Record<string, unknown> = {}
    for (const item of list) {
      settingsMap[item.key] = item.valueJson
    }

    return apiSuccess({
      settings: settingsMap,
      raw: list,
    })
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateSettingsSchema,
    auditConfig: (_, { body }) => ({
      domain: "SYSTEM",
      actionType: "SETTINGS_UPDATED",
      entityType: "site_settings",
      entityId: "batch",
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    for (const item of body.settings) {
      const [existing] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, item.key))
        .limit(1)

      if (existing) {
        await db
          .update(siteSettings)
          .set({
            valueJson: item.valueJson,
            description: item.description ?? existing.description,
            updatedAt: new Date(),
          })
          .where(eq(siteSettings.key, item.key))
      } else {
        await db.insert(siteSettings).values({
          key: item.key,
          valueJson: item.valueJson,
          description: item.description,
          updatedAt: new Date(),
        })
      }
    }

    const updatedList = await db.select().from(siteSettings)
    return apiSuccess(updatedList)
  }
)
