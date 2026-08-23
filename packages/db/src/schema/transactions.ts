import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { orders, products } from "./shop"
import { posts } from "./blog"
import { repositories } from "./archive"
import { caseStudies } from "./portfolio"
import { changelogs } from "./changelog"

export const masterTransactions = pgTable("master_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  trxNumber: varchar("trx_number", { length: 100 }).notNull().unique(),
  domain: varchar("domain", { length: 50 }).notNull(), // 'COMMERCE', 'CONTENT', 'PORTFOLIO', 'CODE_DOCS', 'AUTH_SECURITY', 'SYSTEM'
  actionType: varchar("action_type", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("COMPLETED"), // 'PENDING', 'COMPLETED', 'FAILED', 'REVERTED', 'EXPIRED'

  // Actor
  actorId: uuid("actor_id").references(() => users.id, {
    onDelete: "set null",
  }),
  actorType: varchar("actor_type", { length: 50 }).notNull().default("SYSTEM"), // 'OWNER', 'CUSTOMER', 'SYSTEM', 'CRON_JOB'

  // Polymorphic Entity Reference
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 255 }).notNull(),

  // Optional Direct Foreign Keys
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "set null" }),
  repoId: uuid("repo_id").references(() => repositories.id, {
    onDelete: "set null",
  }),
  caseStudyId: uuid("case_study_id").references(() => caseStudies.id, {
    onDelete: "set null",
  }),
  changelogId: uuid("changelog_id").references(() => changelogs.id, {
    onDelete: "set null",
  }),

  // Financial payload
  amount: integer("amount").default(0),
  currency: varchar("currency", { length: 10 }).default("IDR"),

  // State Snapshots
  payloadBefore: jsonb("payload_before"),
  payloadAfter: jsonb("payload_after"),

  // Network & Telemetry
  clientIp: varchar("client_ip", { length: 45 }),
  userAgent: text("user_agent"),
  traceId: varchar("trace_id", { length: 128 }),
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type MasterTransaction = typeof masterTransactions.$inferSelect
export type NewMasterTransaction = typeof masterTransactions.$inferInsert
