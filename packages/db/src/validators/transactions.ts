import { z } from "zod"

export const insertMasterTransactionSchema = z.object({
  trxNumber: z.string().optional(),
  domain: z.enum([
    "COMMERCE",
    "CONTENT",
    "PORTFOLIO",
    "CODE_DOCS",
    "AUTH_SECURITY",
    "SYSTEM",
  ]),
  actionType: z.string().min(1),
  status: z
    .enum(["PENDING", "COMPLETED", "FAILED", "REVERTED", "EXPIRED"])
    .optional()
    .default("COMPLETED"),
  actorId: z.string().uuid().optional().nullable(),
  actorType: z
    .enum(["OWNER", "CUSTOMER", "SYSTEM", "CRON_JOB"])
    .optional()
    .default("SYSTEM"),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  orderId: z.string().uuid().optional().nullable(),
  productId: z.string().uuid().optional().nullable(),
  postId: z.string().uuid().optional().nullable(),
  repoId: z.string().uuid().optional().nullable(),
  caseStudyId: z.string().uuid().optional().nullable(),
  changelogId: z.string().uuid().optional().nullable(),
  amount: z.number().int().nonnegative().optional().default(0),
  currency: z.string().optional().default("IDR"),
  payloadBefore: z.any().optional().nullable(),
  payloadAfter: z.any().optional().nullable(),
  clientIp: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  traceId: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
})

export type InsertMasterTransactionInput = z.input<
  typeof insertMasterTransactionSchema
>
export type MasterTransactionOutput = z.output<
  typeof insertMasterTransactionSchema
>
