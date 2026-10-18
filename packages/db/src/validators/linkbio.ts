import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { bioLinks, bioLinkClicks } from "@workspace/db/schema/linkbio"

export const insertBioLinkSchema = createInsertSchema(bioLinks)
export const selectBioLinkSchema = createSelectSchema(bioLinks)

export const insertBioLinkClickSchema = createInsertSchema(bioLinkClicks)
export const selectBioLinkClickSchema = createSelectSchema(bioLinkClicks)
