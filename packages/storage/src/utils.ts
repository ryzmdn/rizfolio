import crypto from "crypto"

export interface StoragePathOptions {
  domain: "products" | "archives" | "media" | "avatars" | "blog"
  entityId?: string
  fileName: string
  withTimestamp?: boolean
}

export function sanitizeFileName(fileName: string): string {
  const trimmed = fileName.trim()
  const lastDot = trimmed.lastIndexOf(".")

  if (lastDot === -1) {
    return trimmed
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
  }

  const baseName = trimmed.substring(0, lastDot)
  const extension = trimmed.substring(lastDot + 1).toLowerCase()

  const cleanBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  const cleanExt = extension.replace(/[^a-z0-9]/g, "")

  return `${cleanBase || "file"}.${cleanExt}`
}

export function generateStoragePath(options: StoragePathOptions): string {
  const cleanName = sanitizeFileName(options.fileName)
  const timestamp = options.withTimestamp ? `-${Date.now()}` : ""

  const dotIndex = cleanName.lastIndexOf(".")
  const finalName =
    dotIndex !== -1 && options.withTimestamp
      ? `${cleanName.substring(0, dotIndex)}${timestamp}${cleanName.substring(dotIndex)}`
      : `${cleanName}${timestamp}`

  if (options.entityId) {
    const cleanEntityId = options.entityId.replace(/[^a-zA-Z0-9-_]/g, "")
    return `${options.domain}/${cleanEntityId}/${finalName}`
  }

  return `${options.domain}/${finalName}`
}

export function parseStoragePath(storagePath: string): {
  domain: string
  entityId: string | null
  fileName: string
  extension: string
} {
  const parts = storagePath.split("/").filter(Boolean)
  const fileName = parts[parts.length - 1] || ""
  const dotIndex = fileName.lastIndexOf(".")
  const extension =
    dotIndex !== -1 ? fileName.substring(dotIndex + 1).toLowerCase() : ""

  if (parts.length >= 3) {
    return {
      domain: parts[0] || "",
      entityId: parts[1] || null,
      fileName,
      extension,
    }
  }

  return {
    domain: parts[0] || "",
    entityId: null,
    fileName,
    extension,
  }
}

export function generateDownloadToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString("hex")
}

export function isDownloadTokenExpired(
  expiresAt: Date | string | null | undefined
): boolean {
  if (!expiresAt) return false
  const expiryDate =
    typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt
  return expiryDate.getTime() < Date.now()
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
