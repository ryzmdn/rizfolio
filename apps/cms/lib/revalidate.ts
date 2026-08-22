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
    console.error(
      "[ISR Revalidation Helper] REVALIDATION_SECRET_TOKEN is not configured in CMS environment."
    )
    return {
      success: false,
      error: "Revalidation service secret is not configured.",
    }
  }

  // Only pass non-sensitive route targets in query params (Secret is sent strictly via headers)
  const query = new URLSearchParams()
  if (options.path) query.set("path", options.path)
  if (options.slug) query.set("slug", options.slug)
  if (options.tag) query.set("tag", options.tag)

  const queryString = query.toString()
  const targetUrl = `${baseUrl}/api/revalidate${queryString ? `?${queryString}` : ""}`

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "x-revalidate-secret": revalidationSecret,
        Authorization: `Bearer ${revalidationSecret}`,
      },
    })

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}))
      return {
        success: false,
        error:
          errJson.message || `Failed to revalidate with status ${res.status}`,
      }
    }

    const data = await res.json()
    return { success: true, data }
  } catch (err) {
    console.warn(
      `[ISR Revalidation] Failed to contact ${options.app} target:`,
      err instanceof Error ? err.message : "Network error"
    )
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    }
  }
}
