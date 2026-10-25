import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { docSections, docPages, docRevisions } from "@workspace/db/schema/docs"

export const insertDocSectionSchema = createInsertSchema(docSections)
export const selectDocSectionSchema = createSelectSchema(docSections)

export const insertDocPageSchema = createInsertSchema(docPages)
export const selectDocPageSchema = createSelectSchema(docPages)

export const insertDocRevisionSchema = createInsertSchema(docRevisions)
export const selectDocRevisionSchema = createSelectSchema(docRevisions)
