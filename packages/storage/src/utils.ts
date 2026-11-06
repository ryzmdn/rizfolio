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

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
] as const

export const ALLOWED_MEDIA_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "svg",
  "pdf",
] as const

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_DOCUMENT_SIZE_BYTES = 20 * 1024 * 1024

export interface MediaValidationResult {
  valid: boolean
  error?: string
  sanitizedName?: string
  extension?: string
  mimeType?: string
}

export function validateMediaUpload(file: {
  name: string
  size: number
  type?: string
}): MediaValidationResult {
  if (!file || !file.name || file.size <= 0) {
    return { valid: false, error: "Berkas tidak valid atau kosong." }
  }

  const dotIndex = file.name.lastIndexOf(".")
  if (dotIndex === -1) {
    return {
      valid: false,
      error: "Berkas harus memiliki ekstensi yang valid.",
    }
  }

  const extension = file.name.substring(dotIndex + 1).toLowerCase()
  const rawMime = (file.type || "").toLowerCase().trim()

  const blockedExtensions = [
    "exe",
    "sh",
    "bat",
    "cmd",
    "com",
    "pif",
    "scr",
    "vbs",
    "js",
    "mjs",
    "html",
    "htm",
    "php",
    "py",
    "rb",
    "jar",
    "wasm",
  ]
  if (blockedExtensions.includes(extension)) {
    return {
      valid: false,
      error: "Format berkas executable atau script berbahaya tidak diizinkan.",
    }
  }

  const isImage =
    (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(rawMime) ||
    ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(extension)

  const isDocument =
    (ALLOWED_DOCUMENT_MIME_TYPES as readonly string[]).includes(rawMime) ||
    extension === "pdf"

  if (!isImage && !isDocument) {
    return {
      valid: false,
      error:
        "Format berkas tidak diizinkan. Hanya gambar (JPEG, PNG, WebP, GIF, SVG) dan PDF yang didukung.",
    }
  }

  if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Ukuran berkas gambar melebihi batas maksimal 5MB.",
    }
  }

  if (isDocument && file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return {
      valid: false,
      error: "Ukuran berkas dokumen melebihi batas maksimal 20MB.",
    }
  }

  const sanitizedName = sanitizeFileName(file.name)
  const mimeType = isDocument
    ? "application/pdf"
    : rawMime ||
      (extension === "svg"
        ? "image/svg+xml"
        : `image/${extension === "jpg" ? "jpeg" : extension}`)

  return {
    valid: true,
    sanitizedName,
    extension,
    mimeType,
  }
}
