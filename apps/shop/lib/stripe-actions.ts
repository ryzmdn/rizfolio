"use server"

import { db, orders, orderItems, masterTransactions, eq } from "@workspace/db"
import { randomBytes } from "crypto"
import { stripe, isStripeConfigured } from "./stripe"
import {
  convertFromIdr,
  getStripeUnitAmount,
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
} from "./currencies"
import {
  fallbackOrders,
  getPromoCoupon,
  type DigitalOrder,
} from "./queries"
import type { OrderItemInput } from "./actions"

export interface StripeCheckoutInput {
  customerName: string
  customerEmail: string
  currency?: string
  couponCode?: string
  items: OrderItemInput[]
}

export interface StripeCheckoutResult {
  success: boolean
  checkoutUrl?: string | null
  orderNumber?: string
  isTestSimulation?: boolean
  error?: string
}

function generateOrderNumber(): string {
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

export async function createStripeCheckoutSessionAction(
  input: StripeCheckoutInput
): Promise<StripeCheckoutResult> {
  const name = input.customerName?.trim()
  const email = input.customerEmail?.trim().toLowerCase()
  const selectedCurrency = (
    input.currency && SUPPORTED_CURRENCIES[input.currency.toUpperCase()]
      ? input.currency.toUpperCase()
      : DEFAULT_CURRENCY
  )

  if (!name || name.length < 2) {
    return {
      success: false,
      error: "Please enter your full name with at least 2 characters.",
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
      error: "Cannot process checkout with an empty cart.",
    }
  }

  let discountPercent = 0
  if (input.couponCode) {
    const coupon = await getPromoCoupon(input.couponCode)
    if (coupon && coupon.discountPercent) {
      discountPercent = coupon.discountPercent
    }
  }

  const rawSubtotalIdr = input.items.reduce((acc, it) => acc + it.pricePaid, 0)
  const discountAmountIdr = Math.round((rawSubtotalIdr * discountPercent) / 100)
  const finalTotalIdr = Math.max(0, rawSubtotalIdr - discountAmountIdr)

  const finalTotalInCurrency = convertFromIdr(finalTotalIdr, selectedCurrency)
  const orderNumber = generateOrderNumber()
  const now = new Date().toISOString()
  const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const populatedItems = input.items.map((it) => {
    const itemPriceInCurrency = convertFromIdr(it.pricePaid, selectedCurrency)
    return {
      productId: it.productId,
      productTitle: it.productTitle,
      productSlug: it.productSlug,
      licenseType: it.licenseType,
      pricePaid: itemPriceInCurrency,
      downloadToken: generateDownloadToken(),
      licenseKey: generateLicenseKey(it.productSlug, it.licenseType),
      fileName: it.fileName || `${it.productSlug}-source.zip`,
      fileSizeBytes: it.fileSizeBytes || 2048576,
    }
  })

  let insertedOrderId: string = `ord-${randomBytes(8).toString("hex")}`

  try {
    const [insertedOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: name,
        customerEmail: email,
        totalAmount: Math.round(finalTotalInCurrency),
        currency: selectedCurrency,
        status: isStripeConfigured() ? "PENDING" : "COMPLETED",
        paymentProvider: isStripeConfigured() ? "STRIPE" : "Instant Sandbox Order",
        paymentRef: `REF-${orderNumber}`,
      })
      .returning()

    if (insertedOrder) {
      insertedOrderId = insertedOrder.id

      for (const it of populatedItems) {
        await db.insert(orderItems).values({
          orderId: insertedOrder.id,
          productId: it.productId,
          pricePaid: Math.round(it.pricePaid),
          downloadToken: it.downloadToken,
          tokenExpiresAt: expiryDate,
        })
      }

      if (!isStripeConfigured()) {
        await db.insert(masterTransactions).values({
          trxNumber: `TRX-${orderNumber}`,
          domain: "COMMERCE",
          actionType: "ORDER_CREATED_AND_PAID",
          status: "COMPLETED",
          actorType: "CUSTOMER",
          entityType: "ORDER",
          entityId: insertedOrder.id,
          orderId: insertedOrder.id,
          amount: Math.round(finalTotalInCurrency),
          currency: selectedCurrency,
          metadata: {
            customerEmail: email,
            itemsCount: populatedItems.length,
            discountPercent,
            paymentMode: "SANDBOX_SIMULATION",
          },
        })
      }
    }
  } catch (dbError) {
    console.warn(
      "Direct DB write bypassed, storing order in resilient in-memory store:",
      dbError instanceof Error ? dbError.message : "Database unavailable"
    )
  }

  const digitalOrder: DigitalOrder = {
    id: insertedOrderId,
    orderNumber,
    customerName: name,
    customerEmail: email,
    totalAmount: finalTotalInCurrency,
    currency: selectedCurrency,
    status: isStripeConfigured() ? "PENDING" : "COMPLETED",
    paymentMethod: isStripeConfigured() ? "Stripe Checkout" : "Instant Sandbox Order",
    createdAt: now,
    items: populatedItems,
  }

  fallbackOrders.unshift(digitalOrder)

  if (!isStripeConfigured() || !stripe) {
    return {
      success: true,
      orderNumber,
      isTestSimulation: true,
    }
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SHOP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3002"

  try {
    const lineItems = input.items.map((it) => {
      const itemPriceInCurrency = convertFromIdr(it.pricePaid, selectedCurrency)
      const discountedItemPrice = discountPercent > 0
        ? Math.max(0, itemPriceInCurrency * (1 - discountPercent / 100))
        : itemPriceInCurrency

      const unitAmount = getStripeUnitAmount(discountedItemPrice, selectedCurrency)

      return {
        price_data: {
          currency: selectedCurrency.toLowerCase(),
          product_data: {
            name: it.productTitle,
            description: `License: ${it.licenseType} (${it.productSlug})`,
          },
          unit_amount: Math.max(unitAmount, 1),
        },
        quantity: 1,
      }
    })

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      client_reference_id: orderNumber,
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/order/${orderNumber}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?canceled=true`,
      metadata: {
        orderNumber,
        orderId: insertedOrderId,
        customerName: name,
        customerEmail: email,
        currency: selectedCurrency,
        discountPercent: discountPercent.toString(),
      },
    })

    try {
      await db
        .update(orders)
        .set({
          paymentRef: session.id,
        })
        .where(eq(orders.orderNumber, orderNumber))
    } catch {
      // Ignored for resilient memory fallback
    }

    return {
      success: true,
      checkoutUrl: session.url,
      orderNumber,
      isTestSimulation: false,
    }
  } catch (stripeError) {
    console.error("Stripe Checkout Session Error:", stripeError)

    return {
      success: false,
      error:
        stripeError instanceof Error
          ? stripeError.message
          : "Failed to initialize Stripe secure payment session.",
    }
  }
}

export async function verifyAndFulfillStripeSession(
  sessionId: string,
  orderNumber: string
): Promise<boolean> {
  if (!stripe || !sessionId) return false

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status === "paid") {
      const paymentRef =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.id

      try {
        const matched = await db
          .select()
          .from(orders)
          .where(eq(orders.orderNumber, orderNumber))
          .limit(1)

        const ord = matched[0]
        if (ord && ord.status !== "COMPLETED") {
          await db
            .update(orders)
            .set({
              status: "COMPLETED",
              paymentRef,
              paymentProvider: "STRIPE",
              updatedAt: new Date(),
            })
            .where(eq(orders.id, ord.id))

          const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, ord.id))

          const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

          for (const item of items) {
            if (!item.downloadToken) {
              await db
                .update(orderItems)
                .set({
                  downloadToken: generateDownloadToken(),
                  tokenExpiresAt: expiryDate,
                })
                .where(eq(orderItems.id, item.id))
            }
          }

          await db.insert(masterTransactions).values({
            trxNumber: `TRX-${orderNumber}-${Date.now().toString().slice(-4)}`,
            domain: "COMMERCE",
            actionType: "STRIPE_CHECKOUT_COMPLETED",
            status: "COMPLETED",
            actorType: "CUSTOMER",
            entityType: "ORDER",
            entityId: ord.id,
            orderId: ord.id,
            amount: ord.totalAmount,
            currency: ord.currency,
            metadata: {
              stripeSessionId: session.id,
              source: "CLIENT_REDIRECT_VERIFICATION",
            },
          })
        }
      } catch (err) {
        console.warn("DB verification update skipped:", err)
      }

      const memOrder = fallbackOrders.find((o) => o.orderNumber === orderNumber)
      if (memOrder) {
        memOrder.status = "COMPLETED"
        memOrder.paymentMethod = "Stripe Checkout (Verified)"
      }

      return true
    }
  } catch (err) {
    console.error("Error verifying Stripe session:", err)
  }

  return false
}

