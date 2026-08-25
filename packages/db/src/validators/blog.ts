import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { posts, categories, tags } from "@workspace/db/schema/blog"

export const insertPostSchema = createInsertSchema(posts)
export const selectPostSchema = createSelectSchema(posts)

export const insertCategorySchema = createInsertSchema(categories)
export const selectCategorySchema = createSelectSchema(categories)

export const insertTagSchema = createInsertSchema(tags)
export const selectTagSchema = createSelectSchema(tags)
