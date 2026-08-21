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
