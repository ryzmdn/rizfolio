import {
  getStorageAdminClient,
  uploadFile,
  deleteFile,
  STORAGE_BUCKETS,
  type StorageBucket,
} from "@workspace/storage"
import { createApiHandler, apiSuccess, apiCreated, ValidationError } from "@/lib/api"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_READ",
  },
  async (request) => {
    const url = new URL(request.url)
    const bucket = (url.searchParams.get("bucket") ||
      STORAGE_BUCKETS.MEDIA) as StorageBucket
    const folderPath = url.searchParams.get("path") || ""

    const client = getStorageAdminClient()
    const { data, error } = await client.storage.from(bucket).list(folderPath, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    })

    if (error) {
      throw new Error(`Failed to list storage files: ${error.message}`)
    }

    return apiSuccess({
      bucket,
      path: folderPath,
      files: data || [],
    })
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    auditConfig: (created) => ({
      domain: "SYSTEM",
      actionType: "MEDIA_UPLOADED",
      entityType: "storage_file",
      entityId: (created as { path?: string })?.path || "file",
      status: "COMPLETED",
    }),
  },
  async (request) => {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const bucket = (formData.get("bucket")?.toString() ||
      STORAGE_BUCKETS.MEDIA) as StorageBucket
    const customPath = formData.get("path")?.toString()

    if (!file) {
      throw new ValidationError("No file provided in form data.")
    }

    const timestamp = Date.now()
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filePath = customPath || `uploads/${timestamp}-${safeFilename}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await uploadFile({
      bucket,
      path: filePath,
      file: buffer,
      contentType: file.type || "application/octet-stream",
    })

    return apiCreated({
      bucket,
      path: result.path,
      url: result.url,
      sizeBytes: file.size,
      mimeType: file.type,
    })
  }
)

export const DELETE = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    auditConfig: (_, { body }) => ({
      domain: "SYSTEM",
      actionType: "MEDIA_DELETED",
      entityType: "storage_file",
      entityId: (body as { path?: string })?.path || "file",
      status: "COMPLETED",
    }),
  },
  async (request) => {
    const body = (await request.json().catch(() => ({}))) as {
      bucket?: StorageBucket
      path?: string
    }

    if (!body.path) {
      throw new ValidationError("Storage 'path' is required for deletion.")
    }

    const bucket = body.bucket || STORAGE_BUCKETS.MEDIA
    await deleteFile(bucket, body.path)

    return apiSuccess({
      deleted: true,
      bucket,
      path: body.path,
    })
  }
)
