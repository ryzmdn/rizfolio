"use server"

import { triggerAppRevalidation, type RevalidatableApp } from "../revalidate"

export interface RevalidationReport {
  success: boolean
  results: { app: RevalidatableApp; success: boolean; error?: string }[]
  successfulCount: number
  totalCount: number
}

export async function revalidateAllAppsAction(): Promise<RevalidationReport> {
  const apps: RevalidatableApp[] = [
    "portfolio",
    "blog",
    "shop",
    "docs",
    "changelog",
    "linkbio",
  ]

  const results = await Promise.all(
    apps.map(async (app) => {
      const res = await triggerAppRevalidation({ app, path: "/" })
      return {
        app,
        success: res.success,
        error: res.error,
      }
    })
  )

  const successfulCount = results.filter((r) => r.success).length

  return {
    success: successfulCount > 0,
    results,
    successfulCount,
    totalCount: apps.length,
  }
}
