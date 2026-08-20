import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { siteSettings } from "../schema/settings"

export const insertSiteSettingSchema = createInsertSchema(siteSettings)
export const selectSiteSettingSchema = createSelectSchema(siteSettings)
