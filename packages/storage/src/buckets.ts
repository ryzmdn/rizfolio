export const STORAGE_BUCKETS = {
  MEDIA: "media",
  ARCHIVES: "archives",
  DIGITAL_PRODUCTS: "digital-products",
} as const

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS]
