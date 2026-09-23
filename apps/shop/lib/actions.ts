"use server"

import { db, orders, orderItems, masterTransactions } from "@workspace/db"
import {
  fallbackOrders,
  fallbackReviews,
  getPromoCoupon,
  type DigitalOrder,
  type ProductReview,
} from "./queries"
import { randomBytes } from "crypto"

export interface OrderItemInput {
  productId: string
  productTitle: string
  productSlug: string
  licenseType: "STANDARD" | "EXTENDED"
  pricePaid: number
  fileName?: string
  fileSizeBytes?: number
}

export interface CreateOrderInput {
  customerName: string
  customerEmail: string
  paymentMethod: string
  couponCode?: string
  items: OrderItemInput[]
}

export interface CreateOrderResult {
  success: boolean
  orderNumber?: string
  order?: DigitalOrder
  error?: string
}

export interface ValidateCouponResult {
  valid: boolean
  code?: string
  discountPercent?: number
  description?: string
  error?: string
}

export interface SubmitReviewInput {
  productSlug: string
  authorName: string
  authorRole?: string
  rating: number
  content: string
}

export interface SubmitReviewResult {
  success: boolean
  review?: ProductReview
  error?: string
}

function generateRandomNumber(): string {
  const digits = Math.floor(100000 + Math.random() * 900000)
  return `RZ-${digits}`
}

function generateDownloadToken(): string {
  return `tok_${randomBytes(24).toString("hex")}`
}

function generateLicenseKey(slug: string, licenseType: string): string {
  const prefix = slug.slice(0, 3).toUpperCase()
  const lic = licenseType === "EXTENDED" ? "EXT" : "STD"
  const suffix = randomBytes(4).toString("hex").toUpperCase()
  const mid = Math.floor(1000 + Math.random() * 9000)
  return `RZ-${prefix}-${lic}-${mid}-${suffix}`
}

export async function validatePromoCodeAction(
  code: string
): Promise<ValidateCouponResult> {
  if (!code || !code.trim()) {
    return { valid: false, error: "Please provide a coupon code." }
  }

  const coupon = await getPromoCoupon(code)
  if (!coupon) {
    return { valid: false, error: "Invalid or expired promotional code." }
  }

  return {
    valid: true,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    description: coupon.description,
  }
}

export async function createOrderAction(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const name = input.customerName?.trim()
  const email = input.customerEmail?.trim().toLowerCase()

  if (!name || name.length < 2) {
    return {
      success: false,
      error: "Please provide a valid full name with at least 2 characters.",
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      error: "Please provide a valid delivery email address.",
    }
  }

  if (!input.items || input.items.length === 0) {
    return {
      success: false,
      error: "Cannot create an order with an empty shopping cart.",
    }
  }

  let discountPercent = 0
  if (input.couponCode) {
    const couponValidation = await validatePromoCodeAction(input.couponCode)
    if (couponValidation.valid && couponValidation.discountPercent) {
      discountPercent = couponValidation.discountPercent
    }
  }

  const rawSubtotal = input.items.reduce((acc, it) => acc + it.pricePaid, 0)
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100)
  const finalTotal = Math.max(0, rawSubtotal - discountAmount)

  const orderNumber = generateRandomNumber()
  const now = new Date().toISOString()
  const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const populatedItems = input.items.map((it) => ({
    productId: it.productId,
    productTitle: it.productTitle,
    productSlug: it.productSlug,
    licenseType: it.licenseType,
    pricePaid: it.pricePaid,
    downloadToken: generateDownloadToken(),
    licenseKey: generateLicenseKey(it.productSlug, it.licenseType),
    fileName: it.fileName || `${it.productSlug}-source.zip`,
    fileSizeBytes: it.fileSizeBytes || 2048576,
  }))

  const digitalOrder: DigitalOrder = {
    id: `ord-${randomBytes(8).toString("hex")}`,
    orderNumber,
    customerName: name,
    customerEmail: email,
    totalAmount: finalTotal,
    currency: "IDR",
    status: "COMPLETED",
    paymentMethod: input.paymentMethod || "Simulated Instant Order",
    createdAt: now,
    items: populatedItems,
  }

  fallbackOrders.unshift(digitalOrder)

  try {
    const [insertedOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: name,
        customerEmail: email,
        totalAmount: finalTotal,
        currency: "IDR",
        status: "COMPLETED",
        paymentProvider: input.paymentMethod || "Simulated Instant Order",
        paymentRef: `REF-${orderNumber}`,
      })
      .returning()

    if (insertedOrder) {
      for (const it of populatedItems) {
        await db.insert(orderItems).values({
          orderId: insertedOrder.id,
          productId: it.productId,
          pricePaid: it.pricePaid,
          downloadToken: it.downloadToken,
          tokenExpiresAt: expiryDate,
        })
      }

      await db.insert(masterTransactions).values({
        trxNumber: `TRX-${orderNumber}`,
        domain: "COMMERCE",
        actionType: "ORDER_CREATED_AND_PAID",
        status: "COMPLETED",
        actorType: "CUSTOMER",
        entityType: "ORDER",
        entityId: insertedOrder.id,
        orderId: insertedOrder.id,
        amount: finalTotal,
        currency: "IDR",
        metadata: {
          customerEmail: email,
          itemsCount: populatedItems.length,
          discountPercent,
        },
      })
    }
  } catch (error) {
    console.warn(
      "Database transaction skipped, using resilient memory store for order fulfillment:",
      error instanceof Error ? error.message : "Database unavailable"
    )
  }

  return {
    success: true,
    orderNumber,
    order: digitalOrder,
  }
}

export async function submitReviewAction(
  input: SubmitReviewInput
): Promise<SubmitReviewResult> {
  const name = input.authorName?.trim()
  const content = input.content?.trim()

  if (!name || name.length < 2) {
    return { success: false, error: "Please provide a valid author name." }
  }

  if (!content || content.length < 10) {
    return {
      success: false,
      error: "Review must contain at least 10 characters.",
    }
  }

  if (input.rating < 1 || input.rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5 stars." }
  }

  const newReview: ProductReview = {
    id: `rev-${randomBytes(6).toString("hex")}`,
    productSlug: input.productSlug,
    authorName: name,
    authorRole: input.authorRole?.trim() || "Verified Developer",
    rating: Math.round(input.rating),
    content,
    createdAt: new Date().toISOString(),
    verifiedPurchase: true,
  }

  fallbackReviews.unshift(newReview)

  return {
    success: true,
    review: newReview,
  }
}
