"use server"

import { db, eq, desc, isDbConfigured } from "@workspace/db"
import {
  products,
  productFiles,
  orders,
  orderItems,
  coupons,
} from "@workspace/db/schema"
import {
  insertProductSchema,
  insertProductFileSchema,
  insertCouponSchema,
} from "@workspace/db"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"
import { dispatchBackgroundRevalidation } from "../revalidate"
import {
  fallbackCmsProducts,
  fallbackCmsOrders,
  fallbackCmsCoupons,
} from "../fallback-data"

export type CreateProductInput = typeof products.$inferInsert
export type UpdateProductInput = Partial<typeof products.$inferInsert>
export type CreateProductFileInput = typeof productFiles.$inferInsert
export type CreateCouponInput = typeof coupons.$inferInsert
export type UpdateCouponInput = Partial<typeof coupons.$inferInsert>

export async function getProducts() {
  if (!isDbConfigured) {
    return fallbackCmsProducts
  }
  try {
    const rows = await db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        description: products.description,
        price: products.price,
        currency: products.currency,
        productType: products.productType,
        coverImageUrl: products.coverImageUrl,
        galleryUrls: products.galleryUrls,
        stock: products.stock,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .orderBy(desc(products.createdAt))

    return rows.length > 0 ? rows : fallbackCmsProducts
  } catch (error) {
    console.warn(
      "[CMS Shop] Database query fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsProducts
  }
}

export async function getProductById(id: string) {
  if (!isDbConfigured) {
    return fallbackCmsProducts.find((p) => p.id === id) || null
  }
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
    return product || fallbackCmsProducts.find((p) => p.id === id) || null
  } catch (error) {
    console.warn(
      "[CMS Shop] Database query fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsProducts.find((p) => p.id === id) || null
  }
}

export async function createProduct(values: CreateProductInput) {
  const validated = insertProductSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(products).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Shop] Create product warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  logTransaction({
    domain: "COMMERCE",
    actionType: "PRODUCT_CREATED",
    status: "COMPLETED",
    entityType: "products",
    entityId: created.id,
    productId: created.id,
    amount: 0,
    currency: created.currency,
    metadata: { catalogPrice: created.price },
    payloadAfter: { slug: created.slug, title: created.title, price: created.price },
  })
  dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  revalidatePath("/shop")
  revalidatePath("/")
  return created
}

export async function updateProduct(id: string, values: UpdateProductInput) {
  const validated = insertProductSchema.partial().parse(values)
  let updated = null

  if (isDbConfigured) {
    try {
      const [res] = await db
        .update(products)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning()
      updated = res
    } catch (err) {
      console.warn(
        "[CMS Shop] Update product warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!updated) {
    updated = {
      id,
      ...validated,
      updatedAt: new Date(),
    }
  }

  logTransaction({
    domain: "COMMERCE",
    actionType: "PRODUCT_UPDATED",
    status: "COMPLETED",
    entityType: "products",
    entityId: updated.id,
    productId: updated.id,
    amount: 0,
    currency: updated.currency || "IDR",
    payloadAfter: validated,
  })
  if (updated.slug) {
    dispatchBackgroundRevalidation([
      { app: "shop", path: "/" },
      { app: "shop", slug: updated.slug, path: `/product/${updated.slug}` },
    ])
  }
  revalidatePath("/shop")
  revalidatePath("/")
  return updated
}

export async function deleteProduct(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(products).where(eq(products.id, id))
    } catch (err) {
      console.warn(
        "[CMS Shop] Delete product warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  logTransaction({
    domain: "COMMERCE",
    actionType: "PRODUCT_DELETED",
    status: "COMPLETED",
    entityType: "products",
    entityId: id,
    productId: id,
  })
  dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  revalidatePath("/shop")
  revalidatePath("/")
}

export async function getAllProductFiles() {
  if (!isDbConfigured) {
    return []
  }
  try {
    return await db.select().from(productFiles)
  } catch (error) {
    console.warn(
      "[CMS Shop] Database files fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return []
  }
}

export async function getProductFiles(productId: string) {
  if (!isDbConfigured) {
    return []
  }
  try {
    return await db
      .select()
      .from(productFiles)
      .where(eq(productFiles.productId, productId))
  } catch (error) {
    console.warn(
      "[CMS Shop] Database files fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return []
  }
}

export async function createProductFile(values: CreateProductFileInput) {
  const validated = insertProductFileSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(productFiles).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Shop] Create file warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: new Date(),
    }
  }

  dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  revalidatePath("/shop")
  return created
}

export async function deleteProductFile(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(productFiles).where(eq(productFiles.id, id))
    } catch (err) {
      console.warn(
        "[CMS Shop] Delete file warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
  dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  revalidatePath("/shop")
}

export async function getOrders() {
  if (!isDbConfigured) {
    return fallbackCmsOrders
  }
  try {
    const rows = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerName: orders.customerName,
        customerEmail: orders.customerEmail,
        totalAmount: orders.totalAmount,
        currency: orders.currency,
        status: orders.status,
        paymentProvider: orders.paymentProvider,
        paymentRef: orders.paymentRef,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))

    return rows.length > 0 ? rows : fallbackCmsOrders
  } catch (error) {
    console.warn(
      "[CMS Shop] Database orders fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsOrders
  }
}

export async function getAllOrderItems() {
  if (!isDbConfigured) {
    return []
  }
  try {
    return await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        productTitle: orderItems.productTitle,
        pricePaid: orderItems.pricePaid,
        downloadToken: orderItems.downloadToken,
        tokenExpiresAt: orderItems.tokenExpiresAt,
      })
      .from(orderItems)
  } catch (error) {
    console.warn(
      "[CMS Shop] Database order items fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return []
  }
}

export async function getOrderItems(orderId: string) {
  if (!isDbConfigured) {
    return []
  }
  try {
    return await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        productTitle: orderItems.productTitle,
        pricePaid: orderItems.pricePaid,
        downloadToken: orderItems.downloadToken,
        tokenExpiresAt: orderItems.tokenExpiresAt,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
  } catch (error) {
    console.warn(
      "[CMS Shop] Database order items fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return []
  }
}

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
) {
  let updated = null

  if (isDbConfigured) {
    try {
      const [res] = await db
        .update(orders)
        .set({ status, updatedAt: new Date() })
        .where(eq(orders.id, id))
        .returning()
      updated = res
    } catch (err) {
      console.warn(
        "[CMS Shop] Update order status warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!updated) {
    updated = {
      id,
      status,
      currency: "IDR",
      totalAmount: 0,
      updatedAt: new Date(),
    }
  }

  const ledgerStatus =
    status === "PAID"
      ? "COMPLETED"
      : status === "REFUNDED"
        ? "REVERTED"
        : status === "FAILED"
          ? "FAILED"
          : "PENDING"

  const ledgerAmount =
    status === "PAID" || status === "REFUNDED" ? updated.totalAmount : 0

  logTransaction({
    domain: "COMMERCE",
    actionType: `ORDER_STATUS_${status}`,
    status: ledgerStatus,
    entityType: "orders",
    entityId: updated.id,
    orderId: updated.id,
    amount: ledgerAmount,
    currency: updated.currency,
    payloadAfter: { status },
  })
  dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  revalidatePath("/shop")
  revalidatePath("/")
  return updated
}

export async function getCoupons() {
  if (!isDbConfigured) {
    return fallbackCmsCoupons
  }
  try {
    const rows = await db
      .select({
        id: coupons.id,
        code: coupons.code,
        discountPercent: coupons.discountPercent,
        description: coupons.description,
        expiresAt: coupons.expiresAt,
        minSpend: coupons.minSpend,
        maxUses: coupons.maxUses,
        usedCount: coupons.usedCount,
        isActive: coupons.isActive,
        createdAt: coupons.createdAt,
        updatedAt: coupons.updatedAt,
      })
      .from(coupons)
      .orderBy(desc(coupons.createdAt))

    return rows.length > 0 ? rows : fallbackCmsCoupons
  } catch (error) {
    console.warn(
      "[CMS Shop] Database coupons fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsCoupons
  }
}

export async function createCoupon(values: CreateCouponInput) {
  const validated = insertCouponSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(coupons).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Shop] Create coupon warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
      usedCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  logTransaction({
    domain: "COMMERCE",
    actionType: "COUPON_CREATED",
    status: "COMPLETED",
    entityType: "coupons",
    entityId: created.id,
    metadata: {
      code: created.code,
      discountPercent: created.discountPercent,
    },
  })
  dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  revalidatePath("/shop")
  return created
}

export async function updateCoupon(id: string, values: UpdateCouponInput) {
  const validated = insertCouponSchema.partial().parse(values)
  let updated = null

  if (isDbConfigured) {
    try {
      const [res] = await db
        .update(coupons)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(coupons.id, id))
        .returning()
      updated = res
    } catch (err) {
      console.warn(
        "[CMS Shop] Update coupon warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!updated) {
    updated = {
      id,
      ...validated,
      updatedAt: new Date(),
    }
  }

  logTransaction({
    domain: "COMMERCE",
    actionType: "COUPON_UPDATED",
    status: "COMPLETED",
    entityType: "coupons",
    entityId: updated.id,
    payloadAfter: validated,
  })
  dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  revalidatePath("/shop")
  return updated
}

export async function deleteCoupon(id: string) {
  let deleted = null

  if (isDbConfigured) {
    try {
      const [res] = await db
        .delete(coupons)
        .where(eq(coupons.id, id))
        .returning()
      deleted = res
    } catch (err) {
      console.warn(
        "[CMS Shop] Delete coupon warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  logTransaction({
    domain: "COMMERCE",
    actionType: "COUPON_DELETED",
    status: "COMPLETED",
    entityType: "coupons",
    entityId: id,
  })
  dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  revalidatePath("/shop")
  return deleted
}
