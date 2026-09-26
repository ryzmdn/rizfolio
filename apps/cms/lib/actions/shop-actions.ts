"use server"

import { db, eq, desc } from "@workspace/db"
import {
  products,
  productFiles,
  orders,
  orderItems,
  coupons,
} from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"
import { dispatchBackgroundRevalidation } from "../revalidate"

export type CreateProductInput = typeof products.$inferInsert
export type UpdateProductInput = Partial<typeof products.$inferInsert>
export type CreateProductFileInput = typeof productFiles.$inferInsert
export type CreateCouponInput = typeof coupons.$inferInsert
export type UpdateCouponInput = Partial<typeof coupons.$inferInsert>

export async function getProducts() {
  try {
    return await db
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
  } catch (error) {
    console.error(
      "[CMS Shop] Failed to fetch products:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
    return product || null
  } catch (error) {
    console.error(
      "[CMS Shop] Failed to fetch product by ID:",
      error instanceof Error ? error.message : error
    )
    return null
  }
}

export async function createProduct(values: CreateProductInput) {
  const [created] = await db.insert(products).values(values).returning()
  if (created) {
    logTransaction({
      domain: "COMMERCE",
      actionType: "PRODUCT_CREATED",
      status: "COMPLETED",
      entityType: "products",
      entityId: created.id,
      productId: created.id,
      amount: created.price,
      currency: created.currency,
      payloadAfter: { slug: created.slug, title: created.title },
    })
    dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  }
  revalidatePath("/shop")
  revalidatePath("/")
  return created
}

export async function updateProduct(id: string, values: UpdateProductInput) {
  const [updated] = await db
    .update(products)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning()
  if (updated) {
    logTransaction({
      domain: "COMMERCE",
      actionType: "PRODUCT_UPDATED",
      status: "COMPLETED",
      entityType: "products",
      entityId: updated.id,
      productId: updated.id,
      amount: updated.price,
      currency: updated.currency,
      payloadAfter: values,
    })
    if (updated.slug) {
      dispatchBackgroundRevalidation([
        { app: "shop", path: "/" },
        { app: "shop", slug: updated.slug, path: `/product/${updated.slug}` },
      ])
    }
  }
  revalidatePath("/shop")
  revalidatePath("/")
  return updated
}

export async function deleteProduct(id: string) {
  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning()
  if (deleted) {
    logTransaction({
      domain: "COMMERCE",
      actionType: "PRODUCT_DELETED",
      status: "COMPLETED",
      entityType: "products",
      entityId: id,
      productId: id,
    })
    dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  }
  revalidatePath("/shop")
  revalidatePath("/")
  return deleted
}

export async function getAllProductFiles() {
  try {
    return await db
      .select({
        id: productFiles.id,
        productId: productFiles.productId,
        fileName: productFiles.fileName,
        fileSizeBytes: productFiles.fileSizeBytes,
        storagePath: productFiles.storagePath,
        createdAt: productFiles.createdAt,
      })
      .from(productFiles)
      .orderBy(desc(productFiles.createdAt))
  } catch (error) {
    console.error(
      "[CMS Shop] Failed to fetch all product files:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getProductFiles(productId: string) {
  try {
    return await db
      .select()
      .from(productFiles)
      .where(eq(productFiles.productId, productId))
      .orderBy(desc(productFiles.createdAt))
  } catch (error) {
    console.error(
      "[CMS Shop] Failed to fetch product files:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createProductFile(values: CreateProductFileInput) {
  const [created] = await db.insert(productFiles).values(values).returning()
  if (created) {
    logTransaction({
      domain: "COMMERCE",
      actionType: "PRODUCT_FILE_UPLOADED",
      status: "COMPLETED",
      entityType: "product_files",
      entityId: created.id,
      productId: created.productId,
      metadata: { fileName: created.fileName, size: created.fileSizeBytes },
    })
    dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  }
  revalidatePath("/shop")
  return created
}

export async function deleteProductFile(id: string) {
  await db.delete(productFiles).where(eq(productFiles.id, id))
  dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  revalidatePath("/shop")
}

export async function getOrders() {
  try {
    return await db
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
  } catch (error) {
    console.error(
      "[CMS Shop] Failed to fetch orders:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getAllOrderItems() {
  try {
    return await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        pricePaid: orderItems.pricePaid,
        downloadToken: orderItems.downloadToken,
        tokenExpiresAt: orderItems.tokenExpiresAt,
      })
      .from(orderItems)
  } catch (error) {
    console.error(
      "[CMS Shop] Failed to fetch all order items:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getOrderItems(orderId: string) {
  try {
    return await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        pricePaid: orderItems.pricePaid,
        downloadToken: orderItems.downloadToken,
        tokenExpiresAt: orderItems.tokenExpiresAt,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
  } catch (error) {
    console.error(
      "[CMS Shop] Failed to fetch order items:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
) {
  const [updated] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning()
  if (updated) {
    logTransaction({
      domain: "COMMERCE",
      actionType: `ORDER_STATUS_${status}`,
      status: status === "PAID" ? "COMPLETED" : "PENDING",
      entityType: "orders",
      entityId: updated.id,
      orderId: updated.id,
      amount: updated.totalAmount,
      currency: updated.currency,
      payloadAfter: { status },
    })
    dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  }
  revalidatePath("/shop")
  revalidatePath("/")
  return updated
}

export async function getCoupons() {
  try {
    return await db
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
  } catch (error) {
    console.error(
      "[CMS Shop] Failed to fetch coupons:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createCoupon(values: CreateCouponInput) {
  const [created] = await db.insert(coupons).values(values).returning()
  if (created) {
    logTransaction({
      domain: "COMMERCE",
      actionType: "COUPON_CREATED",
      status: "COMPLETED",
      entityType: "coupons",
      entityId: created.id,
      metadata: { code: created.code, discountPercent: created.discountPercent },
    })
    dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  }
  revalidatePath("/shop")
  return created
}

export async function updateCoupon(id: string, values: UpdateCouponInput) {
  const [updated] = await db
    .update(coupons)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(coupons.id, id))
    .returning()
  if (updated) {
    logTransaction({
      domain: "COMMERCE",
      actionType: "COUPON_UPDATED",
      status: "COMPLETED",
      entityType: "coupons",
      entityId: updated.id,
      payloadAfter: values,
    })
    dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  }
  revalidatePath("/shop")
  return updated
}

export async function deleteCoupon(id: string) {
  const [deleted] = await db
    .delete(coupons)
    .where(eq(coupons.id, id))
    .returning()
  if (deleted) {
    logTransaction({
      domain: "COMMERCE",
      actionType: "COUPON_DELETED",
      status: "COMPLETED",
      entityType: "coupons",
      entityId: id,
    })
    dispatchBackgroundRevalidation({ app: "shop", path: "/" })
  }
  revalidatePath("/shop")
  return deleted
}
