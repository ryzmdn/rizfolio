"use server"

import {
  listFiles,
  uploadFile,
  deleteFile,
  getPublicUrl,
  StorageFileItem,
} from "@workspace/storage"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"
import {
  MEDIA_FOLDERS,
  type MediaAssetItem,
} from "../media-types"

function mapFileToAsset(file: StorageFileItem, folder: string): MediaAssetItem {
  const fullPath = folder ? `${folder}/${file.name}` : file.name
  const metadata = file.metadata || {}
  const size = typeof metadata.size === "number" ? metadata.size : 0
  const mimeType =
    typeof metadata.mimetype === "string"
      ? metadata.mimetype
      : "application/octet-stream"

  return {
    name: file.name,
    path: fullPath,
    folder: folder || "general",
    url: getPublicUrl("media", fullPath),
    size,
    createdAt: file.created_at || new Date().toISOString(),
    updatedAt: file.updated_at || file.created_at || new Date().toISOString(),
    mimeType,
  }
}

export async function listMediaAssets(
  folder?: string
): Promise<MediaAssetItem[]> {
  try {
    if (folder && folder !== "all") {
      const files = await listFiles({
        bucket: "media",
        path: folder,
        limit: 100,
      })

      return files
        .filter(
          (f) =>
            f.name !== ".emptyFolderPlaceholder" &&
            f.name !== "" &&
            !f.name.endsWith("/")
        )
        .map((f) => mapFileToAsset(f, folder))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }

    const folderPromises = MEDIA_FOLDERS.map(async (fld) => {
      try {
        const files = await listFiles({
          bucket: "media",
          path: fld,
          limit: 50,
        })
        return files
          .filter(
            (f) =>
              f.name !== ".emptyFolderPlaceholder" &&
              f.name !== "" &&
              !f.name.endsWith("/")
          )
          .map((f) => mapFileToAsset(f, fld))
      } catch {
        return []
      }
    })

    const rootPromise = listFiles({
      bucket: "media",
      path: "",
      limit: 50,
    })
      .then((files) =>
        files
          .filter(
            (f) =>
              f.name !== ".emptyFolderPlaceholder" &&
              f.name !== "" &&
              !f.name.endsWith("/") &&
              !MEDIA_FOLDERS.includes(f.name as (typeof MEDIA_FOLDERS)[number])
          )
          .map((f) => mapFileToAsset(f, "general"))
      )
      .catch(() => [])

    const results = await Promise.all([...folderPromises, rootPromise])
    const allAssets = results.flat()

    return allAssets.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (error) {
    console.error(
      "[CMS Media Browser] Failed to list assets:",
      error instanceof Error ? error.message : String(error)
    )
    return []
  }
}

export async function uploadMediaAsset(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "general"

    if (!file || file.size === 0) {
      return { error: "Berkas tidak valid atau kosong." }
    }

    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-")

    const uniquePath = `${folder}/${Date.now()}-${sanitizedName}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadRes = await uploadFile({
      bucket: "media",
      path: uniquePath,
      file: buffer,
      contentType: file.type || "application/octet-stream",
      upsert: true,
    })

    logTransaction({
      domain: "CONTENT",
      actionType: "MEDIA_ASSET_UPLOADED",
      status: "COMPLETED",
      entityType: "media_asset",
      entityId: uploadRes.path,
      payloadAfter: {
        path: uploadRes.path,
        url: uploadRes.url,
        size: file.size,
        mimeType: file.type,
      },
    })

    revalidatePath("/media")

    return {
      success: true,
      path: uploadRes.path,
      url: uploadRes.url,
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat mengunggah media ke Supabase Storage."
    console.error("[CMS Media Browser] Upload error:", error)
    return { error: message }
  }
}

export async function deleteMediaAsset(path: string) {
  try {
    await deleteFile("media", path)

    logTransaction({
      domain: "CONTENT",
      actionType: "MEDIA_ASSET_DELETED",
      status: "COMPLETED",
      entityType: "media_asset",
      entityId: path,
      payloadBefore: { path },
    })

    revalidatePath("/media")
    return { success: true }
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Gagal menghapus berkas dari penyimpanan."
    console.error("[CMS Media Browser] Delete error:", error)
    return { success: false, error: message }
  }
}
