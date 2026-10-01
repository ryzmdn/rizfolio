export const MEDIA_FOLDERS = [
  "general",
  "blog",
  "portfolio",
  "products",
] as const

export type MediaFolder = (typeof MEDIA_FOLDERS)[number] | "all"

export interface MediaAssetItem {
  name: string
  path: string
  folder: string
  url: string
  size: number
  createdAt: string
  updatedAt: string
  mimeType: string
}
