import { z } from "zod"
import { paginationQuerySchema } from "./common"

export const queryPostsSchema = paginationQuerySchema.extend({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
})

export const createPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(255)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    ),
  title: z.string().trim().min(1, "Title is required").max(255),
  excerpt: z.string().trim().min(1, "Excerpt is required"),
  contentMd: z.string().trim().min(1, "Content markdown is required"),
  coverImageUrl: z.string().trim().optional().nullable(),
  readingTime: z.coerce.number().int().min(1).default(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional().nullable(),
  seoTitle: z.string().trim().max(255).optional().nullable(),
  seoDesc: z.string().trim().optional().nullable(),
  categoryIds: z.array(z.string().uuid()).default([]),
  tagIds: z.array(z.string().uuid()).default([]),
})

export const updatePostSchema = createPostSchema.partial()

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    ),
  description: z.string().trim().optional().nullable(),
})

export const updateCategorySchema = createCategorySchema.partial()

export const createTagSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    ),
})

export const updateTagSchema = createTagSchema.partial()

export const postReactionSchema = z.object({
  reactionType: z
    .enum(["LIKE", "LOVE", "CLAP", "IDEA", "FIRE"])
    .default("LIKE"),
})

export const newsletterSubscribeSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  source: z.string().trim().max(100).default("BLOG_FOOTER"),
  _hp_website: z.string().optional(),
  _hp_email: z.string().optional(),
})

export const newsletterUnsubscribeSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
})
