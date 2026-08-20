import { pgTable, varchar, text, timestamp, jsonb } from "drizzle-orm/pg-core"

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  valueJson: jsonb("value_json").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})
