import { db } from "@workspace/db"
import { masterTransactions } from "@workspace/db/schema"
import type { RequestSecurityContext } from "./types"

export interface MasterAuditParams {
  domain:
    | "COMMERCE"
    | "CONTENT"
    | "PORTFOLIO"
    | "CODE_DOCS"
    | "AUTH_SECURITY"
    | "SYSTEM"
  actionType: string
  status?: "PENDING" | "COMPLETED" | "FAILED" | "REVERTED" | "EXPIRED"
  entityType: string
  entityId: string
  amount?: number
  currency?: string
  payloadBefore?: unknown
  payloadAfter?: unknown
  metadata?: Record<string, unknown>
  orderId?: string
  productId?: string
  postId?: string
  repoId?: string
  caseStudyId?: string
  changelogId?: string
}

export async function logMasterTransaction(
  params: MasterAuditParams,
  context?: RequestSecurityContext
): Promise<void> {
  const trxNumber = `TRX-${Date.now()}-${crypto.randomUUID().substring(0, 8).toUpperCase()}`

  const actorType =
    context?.user?.role === "OWNER"
      ? "OWNER"
      : context?.user?.role === "CUSTOMER"
        ? "CUSTOMER"
        : "SYSTEM"

  const actorId =
    context?.user?.id && context.user.id !== "m2m-service-account"
      ? context.user.id
      : null

  try {
    await db.insert(masterTransactions).values({
      trxNumber,
      domain: params.domain,
      actionType: params.actionType,
      status: params.status || "COMPLETED",
      actorId,
      actorType,
      entityType: params.entityType,
      entityId: params.entityId,
      amount: params.amount ?? 0,
      currency: params.currency || "IDR",
      payloadBefore: (params.payloadBefore as Record<string, unknown>) ?? null,
      payloadAfter: (params.payloadAfter as Record<string, unknown>) ?? null,
      clientIp: context?.clientIp,
      userAgent: context?.userAgent,
      traceId: context?.traceId,
      metadata: (params.metadata as Record<string, unknown>) ?? null,
      orderId: params.orderId,
      productId: params.productId,
      postId: params.postId,
      repoId: params.repoId,
      caseStudyId: params.caseStudyId,
      changelogId: params.changelogId,
    })
  } catch (error: unknown) {
    console.error(
      `[Audit Trail Error - Trace: ${context?.traceId || "none"}]: Failed to record master transaction:`,
      error instanceof Error ? error.message : String(error)
    )
  }
}
