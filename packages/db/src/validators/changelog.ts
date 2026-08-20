import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { changelogs, changelogItems } from "../schema/changelog"

export const insertChangelogSchema = createInsertSchema(changelogs)
export const selectChangelogSchema = createSelectSchema(changelogs)

export const insertChangelogItemSchema = createInsertSchema(changelogItems)
export const selectChangelogItemSchema = createSelectSchema(changelogItems)
