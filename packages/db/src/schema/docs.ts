import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const docSections = pgTable("doc_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  displayOrder: integer("display_order").notNull().default(0),
  icon: varchar("icon", { length: 50 }).notNull().default("BookOpen"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const docPages = pgTable("doc_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => docSections.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  contentMd: text("content_md").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  readingTime: integer("reading_time").notNull().default(1),
  isPublished: boolean("is_published").notNull().default(true),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDesc: text("seo_desc"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const docRevisions = pgTable("doc_revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id")
    .notNull()
    .references(() => docPages.id, { onDelete: "cascade" }),
  versionTag: varchar("version_tag", { length: 50 }).notNull(),
  commitMessage: text("commit_message"),
  contentMd: text("content_md").notNull(),
  authorName: varchar("author_name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type DocSection = typeof docSections.$inferSelect
export type NewDocSection = typeof docSections.$inferInsert
export type DocPage = typeof docPages.$inferSelect
export type NewDocPage = typeof docPages.$inferInsert
export type DocRevision = typeof docRevisions.$inferSelect
export type NewDocRevision = typeof docRevisions.$inferInsert
