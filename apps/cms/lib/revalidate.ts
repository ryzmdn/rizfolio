import { logTransaction } from "./actions/transaction-actions"

export type RevalidatableApp =
  | "portfolio"
  | "blog"
  | "shop"
  | "changelog"
  | "docs"
  | "linkbio"
  | "archive"

const APP_URL_MAP: Record<RevalidatableApp, string> = {
  portfolio: process.env.NEXT_PUBLIC_PORTFOLIO_URL || "http://localhost:3000",
  blog: process.env.NEXT_PUBLIC_BLOG_URL || "http://localhost:3001",
  shop: process.env.NEXT_PUBLIC_SHOP_URL || "http://localhost:3002",
  changelog: process.env.NEXT_PUBLIC_CHANGELOG_URL || "http://localhost:3003",
  docs:
    process.env.NEXT_PUBLIC_DOCS_URL ||
    process.env.NEXT_PUBLIC_ARCHIVE_URL ||
    "http://localhost:3005",
  linkbio: process.env.NEXT_PUBLIC_LINKBIO_URL || "http://localhost:3006",
  archive:
    process.env.NEXT_PUBLIC_DOCS_URL ||
    process.env.NEXT_PUBLIC_ARCHIVE_URL ||
    "http://localhost:3005",
}

export interface TriggerRevalidateOptions {
  app: RevalidatableApp
  path?: string
  slug?: string
  tag?: string
}

export async function triggerAppRevalidation(
  options: TriggerRevalidateOptions
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const baseUrl = APP_URL_MAP[options.app]
  if (!baseUrl) {
    return { success: false, error: `Unknown application: ${options.app}` }
  }

  const revalidationSecret = process.env.REVALIDATION_SECRET_TOKEN
  if (!revalidationSecret || revalidationSecret.trim().length < 16) {
    return {
      success: false,
      error: "Revalidation service secret is not configured.",
    }
  }

  const query = new URLSearchParams()
  if (options.path) query.set("path", options.path)
  if (options.slug) query.set("slug", options.slug)
  if (options.tag) query.set("tag", options.tag)

  const queryString = query.toString()
  const targetUrl = `${baseUrl}/api/revalidate${queryString ? `?${queryString}` : ""}`

  try {
    // 1500ms hard timeout to prevent hanging when apps are offline
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "x-revalidate-secret": revalidationSecret,
        Authorization: `Bearer ${revalidationSecret}`,
      },
      signal: AbortSignal.timeout(1500),
    })

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}))
      logTransaction({
        domain: "SYSTEM",
        actionType: "REVALIDATION_FAILED",
        status: "FAILED",
        entityType: "app_cache",
        entityId: options.app,
        metadata: {
          app: options.app,
          status: res.status,
          path: options.path,
          tag: options.tag,
        },
      })
      return {
        success: false,
        error:
          errJson.message || `Failed to revalidate with status ${res.status}`,
      }
    }

    const data = await res.json()
    logTransaction({
      domain: "SYSTEM",
      actionType: "REVALIDATION_DISPATCHED",
      status: "COMPLETED",
      entityType: "app_cache",
      entityId: options.app,
      metadata: { app: options.app, path: options.path, tag: options.tag },
    })

    return { success: true, data }
  } catch (err) {
    logTransaction({
      domain: "SYSTEM",
      actionType: "REVALIDATION_SKIPPED",
      status: "FAILED",
      entityType: "app_cache",
      entityId: options.app,
      metadata: {
        error: err instanceof Error ? err.message : "Target offline/timeout",
      },
    })
    return {
      success: false,
      error: err instanceof Error ? err.message : "Target offline",
    }
  }
}

/**
 * Dispatches revalidation in the background (fire-and-forget).
 * Does not block server action execution or UI rendering.
 */
export function dispatchBackgroundRevalidation(
  options: TriggerRevalidateOptions | TriggerRevalidateOptions[]
) {
  const list = Array.isArray(options) ? options : [options]
  for (const opt of list) {
    void triggerAppRevalidation(opt).catch(() => {})
  }
}
