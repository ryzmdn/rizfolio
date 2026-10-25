import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import {
  changelogs,
  changelogItems,
  roadmapItems,
  roadmapProposals,
  changelogSubscribers,
} from "@workspace/db/schema/changelog"

export const insertChangelogSchema = createInsertSchema(changelogs)
export const selectChangelogSchema = createSelectSchema(changelogs)

export const insertChangelogItemSchema = createInsertSchema(changelogItems)
export const selectChangelogItemSchema = createSelectSchema(changelogItems)

export const insertRoadmapItemSchema = createInsertSchema(roadmapItems)
export const selectRoadmapItemSchema = createSelectSchema(roadmapItems)

export const insertRoadmapProposalSchema = createInsertSchema(roadmapProposals)
export const selectRoadmapProposalSchema = createSelectSchema(roadmapProposals)

export const insertChangelogSubscriberSchema =
  createInsertSchema(changelogSubscribers)
export const selectChangelogSubscriberSchema =
  createSelectSchema(changelogSubscribers)
