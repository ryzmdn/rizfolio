export function sanitizeString(input: string): string {
  if (typeof input !== "string") return ""

  let clean = input.replace(/\0/g, "").trim()

  clean = clean
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "blocked-script:")
    .replace(/vbscript:/gi, "blocked-script:")
    .replace(/data:text\/html/gi, "blocked-data:")

  return clean
}

export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj

  if (typeof obj === "string") {
    return sanitizeString(obj) as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T
  }

  if (typeof obj === "object" && !(obj instanceof Date)) {
    const sanitizedRecord: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      sanitizedRecord[key] = sanitizeObject(value)
    }
    return sanitizedRecord as T
  }

  return obj
}
