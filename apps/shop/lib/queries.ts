import { unstable_cache } from "next/cache"
import {
  db,
  products,
  productFiles,
  orders,
  orderItems,
  eq,
  desc,
  asc,
  and,
  ilike,
  or,
  ne,
} from "@workspace/db"
import {
  fallbackProducts,
  fallbackReviews,
  fallbackCoupons,
  fallbackOrders,
  type ShopProduct,
  type ShopProductFile,
  type ProductReview,
  type PromoCoupon,
  type DigitalOrder,
} from "../data"

export {
  fallbackProducts,
  fallbackReviews,
  fallbackCoupons,
  fallbackOrders,
}

export type {
  ShopProduct,
  ShopProductFile,
  ProductReview,
  PromoCoupon,
  DigitalOrder,
}

export interface ProductFilterParams {
  productType?: string
  category?: string
  query?: string
  sortBy?: "featured" | "rating" | "price-low" | "price-high" | "newest"
  minPrice?: number
  maxPrice?: number
}

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

function filterFallbackProducts(params?: ProductFilterParams): ShopProduct[] {
  let list = [...fallbackProducts]

  if (params?.productType && params.productType !== "all") {
    list = list.filter((p) => p.productType === params.productType)
  }

  if (params?.category && params.category !== "all") {
    list = list.filter((p) => p.category === params.category)
  }

  if (params?.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim()
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
    )
  }

  if (params?.minPrice !== undefined) {
    list = list.filter((p) => p.price >= params.minPrice!)
  }

  if (params?.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= params.maxPrice!)
  }

  switch (params?.sortBy) {
    case "price-low":
      list.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      list.sort((a, b) => b.price - a.price)
      break
    case "rating":
      list.sort((a, b) => b.rating - a.rating)
      break
    case "newest":
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      break
    case "featured":
    default:
      list.sort((a, b) => b.reviewCount - a.reviewCount)
      break
  }

  return list
}

async function fetchActiveProducts(
  params?: ProductFilterParams
): Promise<ShopProduct[]> {
  try {
    const conditions = [eq(products.isActive, true)]

    if (params?.productType && params.productType !== "all") {
      conditions.push(eq(products.productType, params.productType))
    }

    if (params?.query && params.query.trim()) {
      const q = `%${params.query.trim()}%`
      conditions.push(
        or(ilike(products.title, q), ilike(products.description, q))!
      )
    }

    let orderByClause = desc(products.createdAt)
    if (params?.sortBy === "price-low") {
      orderByClause = asc(products.price)
    } else if (params?.sortBy === "price-high") {
      orderByClause = desc(products.price)
    }

    const rows = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(orderByClause)

    if (rows && rows.length > 0) {
      return rows.map((p) => {
        const fallbackMatch = fallbackProducts.find((f) => f.slug === p.slug)
        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description,
          price: p.price,
          extendedPrice: fallbackMatch?.extendedPrice || Math.round(p.price * 1.75),
          currency: p.currency,
          productType: (p.productType as "DIGITAL_DOWNLOAD" | "SERVICE" | "PHYSICAL") || "DIGITAL_DOWNLOAD",
          category: fallbackMatch?.category || "STARTER_KIT",
          coverImageUrl: p.coverImageUrl || fallbackMatch?.coverImageUrl || "",
          galleryUrls: p.galleryUrls || fallbackMatch?.galleryUrls || [],
          features: fallbackMatch?.features || [],
          techStack: fallbackMatch?.techStack || [],
          rating: fallbackMatch?.rating || 4.9,
          reviewCount: fallbackMatch?.reviewCount || 10,
          stock: p.stock,
          isActive: p.isActive,
          createdAt: typeof p.createdAt === "string" ? p.createdAt : p.createdAt.toISOString(),
          demoUrl: fallbackMatch?.demoUrl,
          faq: fallbackMatch?.faq || [],
        }
      })
    }

    return filterFallbackProducts(params)
  } catch (error) {
    console.error(
      "Failed to fetch active products, serving resilient fallback data:",
      error
    )
    return filterFallbackProducts(params)
  }
}

export async function getActiveProducts(
  params?: ProductFilterParams
): Promise<ShopProduct[]> {
  const cacheKey = `shop-products-${params?.productType || "all"}-${params?.category || "all"}-${params?.sortBy || "featured"}-${params?.query || ""}`
  return unstable_cache(
    () => fetchActiveProducts(params),
    ["shop-products", cacheKey],
    {
      revalidate: 3600,
      tags: ["shop"],
    }
  )()
}

async function fetchProductBySlug(slug: string): Promise<ShopProduct | null> {
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

      const fallbackMatch = fallbackProducts.find((f) => f.slug === slug)

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: p.price,
        extendedPrice: fallbackMatch?.extendedPrice || Math.round(p.price * 1.75),
        currency: p.currency,
        productType: (p.productType as "DIGITAL_DOWNLOAD" | "SERVICE" | "PHYSICAL") || "DIGITAL_DOWNLOAD",
        category: fallbackMatch?.category || "STARTER_KIT",
        coverImageUrl: p.coverImageUrl || fallbackMatch?.coverImageUrl || "",
        galleryUrls: p.galleryUrls || fallbackMatch?.galleryUrls || [],
        features: fallbackMatch?.features || [],
        techStack: fallbackMatch?.techStack || [],
        rating: fallbackMatch?.rating || 4.9,
        reviewCount: fallbackMatch?.reviewCount || 10,
        stock: p.stock,
        isActive: p.isActive,
        createdAt: typeof p.createdAt === "string" ? p.createdAt : p.createdAt.toISOString(),
        demoUrl: fallbackMatch?.demoUrl,
        files: files && files.length > 0 ? files : fallbackMatch?.files,
        faq: fallbackMatch?.faq || [],
      }
    }

    return fallbackProducts.find((item) => item.slug === slug) || null
  } catch (error) {
    console.error(
      `Failed to fetch product by slug (${slug}), serving resilient fallback data:`,
      error
    )
    return fallbackProducts.find((item) => item.slug === slug) || null
  }
}

export async function getProductBySlug(
  slug: string
): Promise<ShopProduct | null> {
  return unstable_cache(
    () => fetchProductBySlug(slug),
    ["shop-product", slug],
    {
      revalidate: 3600,
      tags: ["shop", `product-${slug}`],
    }
  )()
}

async function fetchRelatedProducts(
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

    if (rows && rows.length > 0) {
      return rows.map((p) => {
        const fallbackMatch = fallbackProducts.find((f) => f.slug === p.slug)
        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description,
          price: p.price,
          extendedPrice: fallbackMatch?.extendedPrice || Math.round(p.price * 1.75),
          currency: p.currency,
          productType: (p.productType as "DIGITAL_DOWNLOAD" | "SERVICE" | "PHYSICAL") || "DIGITAL_DOWNLOAD",
          category: fallbackMatch?.category || "STARTER_KIT",
          coverImageUrl: p.coverImageUrl || fallbackMatch?.coverImageUrl || "",
          galleryUrls: p.galleryUrls || fallbackMatch?.galleryUrls || [],
          features: fallbackMatch?.features || [],
          techStack: fallbackMatch?.techStack || [],
          rating: fallbackMatch?.rating || 4.9,
          reviewCount: fallbackMatch?.reviewCount || 10,
          stock: p.stock,
          isActive: p.isActive,
          createdAt: typeof p.createdAt === "string" ? p.createdAt : p.createdAt.toISOString(),
          demoUrl: fallbackMatch?.demoUrl,
          faq: fallbackMatch?.faq || [],
        }
      })
    }

    return fallbackProducts
      .filter((p) => p.slug !== currentSlug)
      .slice(0, limit)
  } catch (error) {
    console.error(
      `Failed to fetch related products for (${currentSlug}), serving fallback:`,
      error
    )
    return fallbackProducts
      .filter((p) => p.slug !== currentSlug)
      .slice(0, limit)
  }
}

export async function getRelatedProducts(
  currentSlug: string,
  limit: number = 3
): Promise<ShopProduct[]> {
  return unstable_cache(
    () => fetchRelatedProducts(currentSlug, limit),
    ["shop-related-products", currentSlug, String(limit)],
    {
      revalidate: 3600,
      tags: ["shop"],
    }
  )()
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const rows = await db
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.isActive, true))

    if (rows && rows.length > 0) {
      return rows.map((r) => r.slug)
    }

    return fallbackProducts.map((p) => p.slug)
  } catch {
    return fallbackProducts.map((p) => p.slug)
  }
}

export async function getProductReviews(
  productSlug: string
): Promise<ProductReview[]> {
  return fallbackReviews.filter((r) => r.productSlug === productSlug)
}

export async function getPromoCoupon(
  code: string
): Promise<PromoCoupon | null> {
  const normalized = code.trim().toUpperCase()
  const found = fallbackCoupons.find((c) => c.code === normalized)
  if (!found) return null
  if (new Date(found.expiresAt) < new Date()) return null
  return found
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<DigitalOrder | null> {
  try {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1)

    const ord = rows[0]
    if (ord) {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, ord.id))

      return {
        id: ord.id,
        orderNumber: ord.orderNumber,
        customerName: ord.customerName,
        customerEmail: ord.customerEmail,
        totalAmount: ord.totalAmount,
        currency: ord.currency,
        status: (ord.status as "COMPLETED" | "PENDING" | "FAILED") || "COMPLETED",
        paymentMethod: ord.paymentProvider || "Simulated Instant Order",
        createdAt: ord.createdAt.toISOString(),
        items: items.map((it) => ({
          productId: it.productId,
          productTitle: "Purchased Engineering Asset",
          productSlug: "product",
          licenseType: "STANDARD",
          pricePaid: it.pricePaid,
          downloadToken: it.downloadToken || undefined,
          licenseKey: `RZ-LIC-${it.id.slice(0, 8).toUpperCase()}`,
        })),
      }
    }

    return fallbackOrders.find((o) => o.orderNumber === orderNumber) || null
  } catch {
    return fallbackOrders.find((o) => o.orderNumber === orderNumber) || null
  }
}

export async function getShopStats(): Promise<{
  totalProducts: number
  totalSales: number
  averageRating: number
  totalReviews: number
}> {
  const totalProducts = fallbackProducts.length
  const totalReviews = fallbackProducts.reduce(
    (acc, curr) => acc + curr.reviewCount,
    0
  )
  const averageRating = 4.9
  const totalSales = 340

  return {
    totalProducts,
    totalSales,
    averageRating,
    totalReviews,
  }
}
