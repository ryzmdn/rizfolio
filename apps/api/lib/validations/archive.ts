import { z } from "zod"
import { paginationQuerySchema } from "./common"

export const queryRepositoriesSchema = paginationQuerySchema.extend({
  category: z.string().trim().optional(),
  techStack: z.string().trim().optional(),
  isPublic: z.coerce.boolean().optional(),
})

export const createRepositorySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  name: z.string().trim().min(1, "Name is required").max(255),
  description: z.string().trim().optional().nullable(),
  category: z.string().trim().max(50).default("EXPERIMENT"),
  courseName: z.string().trim().max(255).optional().nullable(),
  semester: z.string().trim().max(50).optional().nullable(),
  techStack: z.array(z.string().trim()).default([]),
  githubUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  demoUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  license: z.string().trim().max(50).default("MIT"),
  readmeContent: z.string().trim().optional().nullable(),
  isPublic: z.boolean().default(true),
})

export const updateRepositorySchema = createRepositorySchema.partial()

export const createRepoReleaseSchema = z.object({
  versionTag: z.string().trim().min(1, "Version tag is required").max(50),
  zipStoragePath: z.string().trim().min(1, "Zip storage path is required"),
  changelog: z.string().trim().optional().nullable(),
})

export const createRepoFileSchema = z.object({
  path: z.string().trim().min(1, "File path is required"),
  filename: z.string().trim().min(1, "Filename is required").max(255),
  isDirectory: z.boolean().default(false),
  parentPath: z.string().trim().default(""),
  sizeBytes: z.coerce.number().int().min(0).default(0),
  contentText: z.string().optional().nullable(),
  storageUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
})
