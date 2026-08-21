import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"

export const repositories = pgTable("repositories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull().default("EXPERIMENT"),
  courseName: varchar("course_name", { length: 255 }),
  semester: varchar("semester", { length: 50 }),
  techStack: text("tech_stack").array(),
  githubUrl: text("github_url"),
  demoUrl: text("demo_url"),
  license: varchar("license", { length: 50 }).default("MIT"),
  starsCount: integer("stars_count").notNull().default(0),
  viewsCount: integer("views_count").notNull().default(0),
  downloadsCount: integer("downloads_count").notNull().default(0),
  readmeContent: text("readme_content"),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const repoFiles = pgTable("repo_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  repoId: uuid("repo_id")
    .notNull()
    .references(() => repositories.id, { onDelete: "cascade" }),
  path: text("path").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  isDirectory: boolean("is_directory").notNull().default(false),
  parentPath: text("parent_path").notNull().default(""),
  sizeBytes: integer("size_bytes").notNull().default(0),
  contentText: text("content_text"),
  storageUrl: text("storage_url"),
})

export const repoReleases = pgTable("repo_releases", {
  id: uuid("id").primaryKey().defaultRandom(),
  repoId: uuid("repo_id")
    .notNull()
    .references(() => repositories.id, { onDelete: "cascade" }),
  versionTag: varchar("version_tag", { length: 50 }).notNull(),
  zipStoragePath: text("zip_storage_path").notNull(),
  changelog: text("changelog"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})
