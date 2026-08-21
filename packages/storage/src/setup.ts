import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { getStorageAdminClient } from "./client"
import { STORAGE_BUCKETS, StorageBucket } from "./buckets"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, "../../../.env") })
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") })

export interface BucketConfig {
  id: StorageBucket
  name: string
  public: boolean
  fileSizeLimit: number
  allowedMimeTypes?: string[]
}

export const BUCKET_DEFINITIONS: BucketConfig[] = [
  {
    id: STORAGE_BUCKETS.MEDIA,
    name: "media",
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "application/pdf",
    ],
  },
  {
    id: STORAGE_BUCKETS.ARCHIVES,
    name: "archives",
    public: true,
    fileSizeLimit: 50 * 1024 * 1024,
    allowedMimeTypes: [
      "application/zip",
      "application/x-zip-compressed",
      "application/octet-stream",
      "application/x-tar",
      "application/gzip",
    ],
  },
  {
    id: STORAGE_BUCKETS.DIGITAL_PRODUCTS,
    name: "digital-products",
    public: false,
    fileSizeLimit: 100 * 1024 * 1024,
    allowedMimeTypes: [
      "application/zip",
      "application/x-zip-compressed",
      "application/pdf",
      "application/octet-stream",
    ],
  },
]

export async function setupStorageBuckets(): Promise<{
  success: boolean
  results: Array<{
    bucket: string
    action: "created" | "updated" | "failed"
    error?: string
  }>
}> {
  console.log("Inisialisasi Supabase Storage Buckets...")

  const results: Array<{
    bucket: string
    action: "created" | "updated" | "failed"
    error?: string
  }> = []

  try {
    const client = getStorageAdminClient()
    const { data: existingBuckets, error: listError } =
      await client.storage.listBuckets()

    if (listError) {
      throw new Error(
        `Gagal mengambil daftar bucket dari Supabase: ${listError.message}`
      )
    }

    const existingNames = new Set(existingBuckets?.map((b) => b.name) || [])

    for (const def of BUCKET_DEFINITIONS) {
      if (existingNames.has(def.name)) {
        console.log(`Mengupdate konfigurasi bucket "${def.name}"...`)
        const { error: updateError } = await client.storage.updateBucket(
          def.name,
          {
            public: def.public,
            fileSizeLimit: def.fileSizeLimit,
            allowedMimeTypes: def.allowedMimeTypes,
          }
        )

        if (updateError) {
          console.warn(
            `Gagal mengupdate bucket "${def.name}": ${updateError.message}`
          )
          results.push({
            bucket: def.name,
            action: "failed",
            error: updateError.message,
          })
        } else {
          console.log(
            `Bucket "${def.name}" berhasil diselaraskan (Public: ${def.public}).`
          )
          results.push({ bucket: def.name, action: "updated" })
        }
      } else {
        console.log(`Membuat bucket baru "${def.name}"...`)
        const { error: createError } = await client.storage.createBucket(
          def.name,
          {
            public: def.public,
            fileSizeLimit: def.fileSizeLimit,
            allowedMimeTypes: def.allowedMimeTypes,
          }
        )

        if (createError) {
          console.warn(
            `Gagal membuat bucket "${def.name}": ${createError.message}`
          )
          results.push({
            bucket: def.name,
            action: "failed",
            error: createError.message,
          })
        } else {
          console.log(
            `Bucket "${def.name}" berhasil dibuat (Public: ${def.public}).`
          )
          results.push({ bucket: def.name, action: "created" })
        }
      }
    }

    console.log("Penyelarasan Storage Buckets Selesai.")

    return { success: true, results }
  } catch (error) {
    console.error("Terjadi kesalahan saat inisialisasi bucket:", error)
    return {
      success: false,
      results: [
        {
          bucket: "all",
          action: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      ],
    }
  }
}

async function main() {
  const result = await setupStorageBuckets()
  if (!result.success) {
    process.exit(1)
  }
  process.exit(0)
}

if (
  typeof process !== "undefined" &&
  process.argv &&
  process.argv[1]?.includes("setup")
) {
  main()
}
