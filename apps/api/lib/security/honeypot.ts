const HONEYPOT_FIELDS = ["honeypot", "_hp_website", "_hp_email", "_hp_phone", "company_website_url"]


export interface HoneypotCheckResult {
  isSpam: boolean
  reason?: string
}

export function evaluateHoneypot(data: unknown): HoneypotCheckResult {
  if (!data || typeof data !== "object") {
    return { isSpam: false }
  }

  const record = data as Record<string, unknown>

  for (const field of HONEYPOT_FIELDS) {
    const value = record[field]
    if (typeof value === "string" && value.trim().length > 0) {
      return {
        isSpam: true,
        reason: `Honeypot field '${field}' was populated by automated agent.`,
      }
    }
  }

  if ("_hp_timestamp" in record) {
    const renderTime = Number(record._hp_timestamp)
    if (!isNaN(renderTime)) {
      const durationMs = Date.now() - renderTime
      if (durationMs < 1200) {
        return {
          isSpam: true,
          reason: `Submission occurred abnormally fast (${durationMs}ms), flagged as automated bot.`,
        }
      }
    }
  }

  return { isSpam: false }
}

export function sanitizeHoneypotFields<T extends Record<string, unknown>>(data: T): Partial<T> {
  const result: Record<string, unknown> = { ...data }
  for (const field of HONEYPOT_FIELDS) {
    delete result[field]
  }
  delete result._hp_timestamp
  return result as Partial<T>
}
