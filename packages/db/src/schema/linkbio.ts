import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const bioLinks = pgTable("bio_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  url: text("url").notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }).notNull().default("Globe"),
  badge: varchar("badge", { length: 50 }),
  badgeColor: varchar("badge_color", { length: 100 }).default(
    "bg-primary/10 text-primary border-primary/20"
  ),
  category: varchar("category", { length: 50 }).notNull().default("ECOSYSTEM"),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const bioLinkClicks = pgTable("bio_link_clicks", {
  id: uuid("id").primaryKey().defaultRandom(),
  linkId: uuid("link_id")
    .notNull()
    .references(() => bioLinks.id, { onDelete: "cascade" }),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ipHash: varchar("ip_hash", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type BioLink = typeof bioLinks.$inferSelect
export type NewBioLink = typeof bioLinks.$inferInsert
export type BioLinkClick = typeof bioLinkClicks.$inferSelect
export type NewBioLinkClick = typeof bioLinkClicks.$inferInsert
