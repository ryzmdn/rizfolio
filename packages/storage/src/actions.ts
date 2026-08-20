import { getStorageAdminClient, getStoragePublicClient } from "./client"
import { StorageBucket } from "./buckets"

export interface UploadFileOptions {
  bucket: StorageBucket
  path: string
  file: File | Blob | Buffer | Uint8Array
  contentType?: string
  upsert?: boolean
}

export interface UploadFileResult {
  path: string
  url: string
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  options: UploadFileOptions
): Promise<UploadFileResult> {
  const client = getStorageAdminClient()
  const { data, error } = await client.storage
    .from(options.bucket)
    .upload(options.path, options.file, {
      contentType: options.contentType,
      upsert: options.upsert ?? true,
    })

  if (error) {
    throw new Error(`Failed to upload file to storage: ${error.message}`)
  }

  const url = getPublicUrl(options.bucket, data.path)
  return { path: data.path, url }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<void> {
  const client = getStorageAdminClient()
  const { error } = await client.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Failed to delete file from storage: ${error.message}`)
  }
}

/**
 * Get public CDN URL for a file
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const client = getStoragePublicClient()
  const { data } = client.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Generate a temporary signed download URL (for private digital products or private archives)
 * @param expiresInSeconds Duration in seconds (default 3600 = 1 hour)
 */
export async function createSignedDownloadUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  const client = getStorageAdminClient()
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds)

  if (error || !data?.signedUrl) {
    throw new Error(
      `Failed to create signed URL: ${error?.message || "Unknown error"}`
    )
  }

  return data.signedUrl
}
