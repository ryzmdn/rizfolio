import { z } from "zod"

export const changelogItemInputSchema = z.object({
  category: z.string().trim().max(50).default("FEATURE"),
  description: z.string().trim().min(1, "Item description is required"),
  displayOrder: z.coerce.number().int().default(0),
})

export const createChangelogSchema = z.object({
  version: z.string().trim().min(1, "Version is required").max(50),
  title: z.string().trim().min(1, "Title is required").max(255),
  releaseDate: z.string().trim().min(1, "Release date is required").max(50),
  summary: z.string().trim().optional().nullable(),
  isPublished: z.boolean().default(true),
  items: z.array(changelogItemInputSchema).default([]),
})

export const updateChangelogSchema = createChangelogSchema.partial()

export const createRoadmapItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().min(1, "Description is required"),
  stage: z
    .enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .default("PLANNED"),
  quarter: z.string().trim().max(50).default("Q4 2026"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  scope: z.array(z.string().trim()).default([]),
  relatedVersion: z.string().trim().max(50).optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
})

export const updateRoadmapItemSchema = createRoadmapItemSchema.partial()

export const createRoadmapProposalSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  scope: z.string().trim().max(100).default("monorepo"),
  rationale: z.string().trim().min(1, "Rationale is required"),
  authorName: z.string().trim().max(255).optional().nullable(),
  authorEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .nullable()
    .or(z.literal("")),
  _hp_website: z.string().optional(),
})

export const updateRoadmapProposalStatusSchema = z.object({
  status: z.enum([
    "SUBMITTED",
    "UNDER_REVIEW",
    "ACCEPTED",
    "DECLINED",
    "SHIPPED",
  ]),
})
