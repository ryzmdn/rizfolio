import {
  db,
  products,
  productFiles,
  eq,
  desc,
  and,
  ilike,
  or,
  ne,
} from "@workspace/db"

export interface ShopProductFile {
  id: string
  fileName: string
  fileSizeBytes: number
}

export interface ShopProduct {
  id: string
  slug: string
  title: string
  description: string
  price: number
  currency: string
  productType: "DIGITAL_DOWNLOAD" | "SERVICE" | "PHYSICAL" | string
  coverImageUrl: string | null
  galleryUrls: string[] | null
  stock: number
  isActive: boolean
  createdAt: Date | string
  files?: ShopProductFile[]
}

export const fallbackProducts: ShopProduct[] = [
  {
    id: "prod-1",
    slug: "turborepo-nextjs16-starter-kit",
    title: "Turborepo & Next.js 16 Enterprise Starter Kit",
    description:
      "Production-ready monorepo template featuring React 19, Tailwind CSS v4, Drizzle ORM, Supabase Auth, and pre-configured CI/CD pipelines for high-concurrency SaaS platforms.",
    price: 249000,
    currency: "IDR",
    productType: "DIGITAL_DOWNLOAD",
    coverImageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 999,
    isActive: true,
    createdAt: "2026-08-01T00:00:00.000Z",
    files: [
      {
        id: "file-1",
        fileName: "turborepo-enterprise-v1.0.0.zip",
        fileSizeBytes: 2457600,
      },
    ],
  },
  {
    id: "prod-2",
    slug: "tailwind-v4-component-system",
    title: "Tailwind CSS v4 & OKLCH Enterprise UI Kit",
    description:
      "A zero-runtime accessible design system component library with 60+ modular components, dark/light theme switching, and fluid typography tokens.",
    price: 199000,
    currency: "IDR",
    productType: "DIGITAL_DOWNLOAD",
    coverImageUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 999,
    isActive: true,
    createdAt: "2026-08-05T00:00:00.000Z",
    files: [
      {
        id: "file-2",
        fileName: "tailwind-v4-ui-kit.zip",
        fileSizeBytes: 1843200,
      },
    ],
  },
  {
    id: "prod-3",
    slug: "drizzle-supabase-boilerplate",
    title: "Drizzle ORM & Supabase Transaction Pooler Boilerplate",
    description:
      "Deterministic data access layer with type-safe schema definitions, automated migrations via Drizzle Kit, and high-throughput connection pooling handlers.",
    price: 149000,
    currency: "IDR",
    productType: "DIGITAL_DOWNLOAD",
    coverImageUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 999,
    isActive: true,
    createdAt: "2026-08-10T00:00:00.000Z",
    files: [
      {
        id: "file-3",
        fileName: "drizzle-supabase-kit.zip",
        fileSizeBytes: 1228800,
      },
    ],
  },
  {
    id: "prod-4",
    slug: "fullstack-architecture-consultation",
    title: "1-on-1 Full-Stack Architecture & Code Review Session",
    description:
      "A focused 60-minute technical consultation reviewing your system architecture, database modeling, query optimization, and frontend performance bottlenecks.",
    price: 750000,
    currency: "IDR",
    productType: "SERVICE",
    coverImageUrl:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop",
    ],
    stock: 5,
    isActive: true,
    createdAt: "2026-08-12T00:00:00.000Z",
  },
]

export function formatPrice(price: number, currency: string = "IDR"): string {
  if (currency === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price)
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(price)
}

export async function getActiveProducts(params?: {
  productType?: string
  query?: string
}): Promise<ShopProduct[]> {
  try {
    const conditions = [eq(products.isActive, true)]

    if (params?.productType && params.productType !== "all") {
      conditions.push(eq(products.productType, params.productType))
    }

    if (params?.query && params.query.trim()) {
      const q = `%${params.query.trim()}%`
      conditions.push(
        or(
          ilike(products.title, q),
          ilike(products.description, q)
        )!
      )
    }

    const rows = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))

    if (rows.length > 0) {
      return rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: p.price,
        currency: p.currency,
        productType: p.productType,
        coverImageUrl: p.coverImageUrl,
        galleryUrls: p.galleryUrls,
        stock: p.stock,
        isActive: p.isActive,
        createdAt: p.createdAt,
      }))
    }
  } catch (error) {
    console.warn(
      "[Shop Data Layer] Failed to fetch active products, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  let fallback = fallbackProducts
  if (params?.productType && params.productType !== "all") {
    fallback = fallback.filter((p: ShopProduct) => p.productType === params.productType)
  }
  if (params?.query && params.query.trim()) {
    const q = params.query.toLowerCase()
    fallback = fallback.filter(
      (p: ShopProduct) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }

  return fallback
}

export async function getProductBySlug(
  slug: string
): Promise<ShopProduct | null> {
  try {
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.isActive, true)))
      .limit(1)

    const p = rows[0]
    if (p) {
      const files = await db
        .select({
          id: productFiles.id,
          fileName: productFiles.fileName,
          fileSizeBytes: productFiles.fileSizeBytes,
        })
        .from(productFiles)
        .where(eq(productFiles.productId, p.id))

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: p.price,
        currency: p.currency,
        productType: p.productType,
        coverImageUrl: p.coverImageUrl,
        galleryUrls: p.galleryUrls,
        stock: p.stock,
        isActive: p.isActive,
        createdAt: p.createdAt,
        files,
      }
    }
  } catch (error) {
    console.warn(
      "[Shop Data Layer] Failed to fetch product by slug, checking fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  const fallback = fallbackProducts.find((p) => p.slug === slug)
  return fallback || null
}

export async function getRelatedProducts(
  currentSlug: string,
  limit: number = 3
): Promise<ShopProduct[]> {
  try {
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), ne(products.slug, currentSlug)))
      .orderBy(desc(products.createdAt))
      .limit(limit)

    if (rows.length > 0) {
      return rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: p.price,
        currency: p.currency,
        productType: p.productType,
        coverImageUrl: p.coverImageUrl,
        galleryUrls: p.galleryUrls,
        stock: p.stock,
        isActive: p.isActive,
        createdAt: p.createdAt,
      }))
    }
  } catch (error) {
    console.warn(
      "[Shop Data Layer] Failed to fetch related products, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  return fallbackProducts.filter((p: ShopProduct) => p.slug !== currentSlug).slice(0, limit)
}
