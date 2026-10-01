import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import {
  repositories,
  repoFiles,
  repoReleases,
} from "@workspace/db/schema/archive"

export const insertRepositorySchema = createInsertSchema(repositories)
export const selectRepositorySchema = createSelectSchema(repositories)

export const insertRepoFileSchema = createInsertSchema(repoFiles)
export const selectRepoFileSchema = createSelectSchema(repoFiles)

export const insertRepoReleaseSchema = createInsertSchema(repoReleases)
export const selectRepoReleaseSchema = createSelectSchema(repoReleases)
