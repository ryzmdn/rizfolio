"use server"

import { uploadFile, deleteFile } from "@workspace/storage"
import { revalidatePath } from "next/cache"

export async function uploadMediaAsset(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "general"

    if (!file || file.size === 0) {
      return { error: "Berkas tidak valid atau kosong." }
    }

    const ext = file.name.split(".").pop() || "bin"
    const uniqueName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadRes = await uploadFile({
      bucket: "media",
      path: uniqueName,
      file: buffer,
      contentType: file.type || "application/octet-stream",
      upsert: true,
    })

    revalidatePath("/media")

    return {
      success: true,
      path: uploadRes.path,
      url: uploadRes.url,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal saat mengunggah media."
    console.error("Media upload error:", error)
    return { error: message }
  }
}

export async function deleteMediaAsset(path: string) {
  try {
    await deleteFile("media", path)
    revalidatePath("/media")
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus berkas."
    console.error("Media delete error:", error)
    return { success: false, error: message }
  }
}
