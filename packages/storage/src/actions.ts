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

export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const client = getStoragePublicClient()
  const { data } = client.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export interface SignedDownloadOptions {
  expiresInSeconds?: number
  download?: boolean | string
}

export async function createSignedDownloadUrl(
  bucket: StorageBucket,
  path: string,
  optionsOrSeconds: number | SignedDownloadOptions = 3600
): Promise<string> {
  const client = getStorageAdminClient()
  const expiresIn =
    typeof optionsOrSeconds === "number"
      ? optionsOrSeconds
      : optionsOrSeconds.expiresInSeconds || 3600
  const downloadOption =
    typeof optionsOrSeconds === "object" && optionsOrSeconds.download
      ? optionsOrSeconds.download
      : undefined

  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn, {
      download: downloadOption,
    })

  if (error || !data?.signedUrl) {
    throw new Error(
      `Failed to create signed URL: ${error?.message || "Unknown error"}`
    )
  }

  return data.signedUrl
}

export async function downloadFile(
  bucket: StorageBucket,
  path: string
): Promise<Blob> {
  const client = getStorageAdminClient()
  const { data, error } = await client.storage.from(bucket).download(path)

  if (error || !data) {
    throw new Error(`Failed to download file from storage: ${error?.message || "Unknown error"}`)
  }

  return data
}
