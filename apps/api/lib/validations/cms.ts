import { z } from "zod"
import { paginationQuerySchema } from "./common"

export const settingItemSchema = z.object({
  key: z.string().trim().min(1, "Key is required").max(100),
  valueJson: z.unknown(),
  description: z.string().trim().optional().nullable(),
})

export const updateSettingsSchema = z.object({
  settings: z.array(settingItemSchema).min(1, "At least one setting required"),
})

export const queryTransactionsSchema = paginationQuerySchema.extend({
  domain: z
    .enum([
      "COMMERCE",
      "CONTENT",
      "PORTFOLIO",
      "CODE_DOCS",
      "AUTH_SECURITY",
      "SYSTEM",
    ])
    .optional(),
  status: z
    .enum(["PENDING", "COMPLETED", "FAILED", "REVERTED", "EXPIRED"])
    .optional(),
  actorType: z.enum(["OWNER", "CUSTOMER", "SYSTEM", "CRON_JOB"]).optional(),
  entityType: z.string().trim().optional(),
  entityId: z.string().trim().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export const revalidateRequestSchema = z.object({
  tag: z.string().trim().optional(),
  path: z.string().trim().optional(),
  secret: z.string().trim().min(1, "Secret token is required"),
})
