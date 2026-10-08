import { z } from "zod"

export const createBioLinkSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  url: z.string().trim().url("Invalid link URL"),
  description: z.string().trim().optional().nullable(),
  icon: z.string().trim().max(50).default("Globe"),
  badge: z.string().trim().max(50).optional().nullable(),
  badgeColor: z.string().trim().max(100).optional().nullable(),
  category: z
    .enum(["ECOSYSTEM", "FEATURED", "SOCIAL", "COMMUNITY", "RESOURCE"])
    .default("ECOSYSTEM"),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
})

export const updateBioLinkSchema = createBioLinkSchema.partial()

export const reorderBioLinksSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid("Invalid link ID"),
        displayOrder: z.coerce.number().int(),
      })
    )
    .min(1, "At least one item required for reordering"),
})
