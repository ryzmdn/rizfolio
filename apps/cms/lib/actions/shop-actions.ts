"use server"

import { db, eq, desc } from "@workspace/db"
import { products, productFiles, orders } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"

export async function getProducts() {
  try {
    return await db.select().from(products).orderBy(desc(products.createdAt))
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

export async function createProduct(values: typeof products.$inferInsert) {
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
      payloadAfter: created,
    })
  }
  revalidatePath("/shop")
  return created
}

export async function updateProduct(
  id: string,
  values: Partial<typeof products.$inferInsert>
) {
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
      payloadAfter: updated,
    })
  }
  revalidatePath("/shop")
  return updated
}

export async function deleteProduct(id: string) {
  await db.delete(products).where(eq(products.id, id))
  logTransaction({
    domain: "COMMERCE",
    actionType: "PRODUCT_DELETED",
    status: "COMPLETED",
    entityType: "products",
    entityId: id,
    productId: id,
  })
  revalidatePath("/shop")
}

export async function getProductFiles(productId: string) {
  try {
    return await db
      .select()
      .from(productFiles)
      .where(eq(productFiles.productId, productId))
  } catch (error) {
    console.error(
      "[CMS Shop] Failed to fetch product files:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function addProductFile(values: typeof productFiles.$inferInsert) {
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
  }
  revalidatePath(`/shop`)
  return created
}

export async function deleteProductFile(id: string) {
  await db.delete(productFiles).where(eq(productFiles.id, id))
  logTransaction({
    domain: "COMMERCE",
    actionType: "PRODUCT_FILE_DELETED",
    status: "COMPLETED",
    entityType: "product_files",
    entityId: id,
  })
  revalidatePath(`/shop`)
}

export async function getOrders() {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt))
  } catch (error) {
    console.error(
      "[CMS Shop] Failed to fetch orders:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED"
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
      status:
        status === "PAID"
          ? "COMPLETED"
          : status === "FAILED"
            ? "FAILED"
            : "PENDING",
      entityType: "orders",
      entityId: updated.id,
      orderId: updated.id,
      amount: updated.totalAmount,
      currency: updated.currency,
      payloadAfter: updated,
    })
  }
  revalidatePath("/shop")
  return updated
}
