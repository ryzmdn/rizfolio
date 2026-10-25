import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const changelogs = pgTable("changelogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  version: varchar("version", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  releaseDate: varchar("release_date", { length: 50 }).notNull(),
  summary: text("summary"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const changelogItems = pgTable("changelog_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  changelogId: uuid("changelog_id")
    .notNull()
    .references(() => changelogs.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 50 }).notNull().default("FEATURE"),
  description: text("description").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
})

export const roadmapItems = pgTable("roadmap_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  stage: varchar("stage", { length: 50 }).notNull().default("PLANNED"),
  quarter: varchar("quarter", { length: 50 }).notNull().default("Q4 2026"),
  priority: varchar("priority", { length: 50 }).notNull().default("MEDIUM"),
  scope: text("scope").array(),
  relatedVersion: varchar("related_version", { length: 50 }),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const roadmapProposals = pgTable("roadmap_proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  scope: varchar("scope", { length: 100 }).notNull().default("monorepo"),
  rationale: text("rationale").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("SUBMITTED"),
  authorName: varchar("author_name", { length: 255 }),
  authorEmail: varchar("author_email", { length: 255 }),
  upvotesCount: integer("upvotes_count").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const changelogSubscribers = pgTable("changelog_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  unsubscribeToken: varchar("unsubscribe_token", { length: 255 })
    .notNull()
    .unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type Changelog = typeof changelogs.$inferSelect
export type NewChangelog = typeof changelogs.$inferInsert
export type ChangelogItem = typeof changelogItems.$inferSelect
export type NewChangelogItem = typeof changelogItems.$inferInsert
export type RoadmapItem = typeof roadmapItems.$inferSelect
export type NewRoadmapItem = typeof roadmapItems.$inferInsert
export type RoadmapProposal = typeof roadmapProposals.$inferSelect
export type NewRoadmapProposal = typeof roadmapProposals.$inferInsert
export type ChangelogSubscriber = typeof changelogSubscribers.$inferSelect
export type NewChangelogSubscriber = typeof changelogSubscribers.$inferInsert
