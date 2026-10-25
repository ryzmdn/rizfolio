import { NextResponse } from "next/server"
import crypto from "crypto"
import { db, eq } from "@workspace/db"
import { orders, orderItems, products } from "@workspace/db/schema"
import { logMasterTransaction } from "@/lib/api/audit"
import { sendOrderConfirmationEmail } from "@workspace/email"

export const dynamic = "force-dynamic"

function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !secret) return false

  const parts = signatureHeader.split(",")
  let timestamp = ""
  let signature = ""

  for (const part of parts) {
    const [key, val] = part.split("=")
    if (key === "t" && val) timestamp = val
    if (key === "v1" && val) signature = val
  }

  if (!timestamp || !signature) return false

  const timestampSec = Number(timestamp)
  if (isNaN(timestampSec)) return false

  const currentSec = Math.floor(Date.now() / 1000)
  if (Math.abs(currentSec - timestampSec) > 300) {
    return false
  }

  const payload = `${timestamp}.${rawBody}`
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex")

  try {
    const expectedBuf = Buffer.from(expectedSignature)
    const actualBuf = Buffer.from(signature)
    if (expectedBuf.length !== actualBuf.length) return false
    return crypto.timingSafeEqual(expectedBuf, actualBuf)
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (
    webhookSecret &&
    !verifyStripeSignature(rawBody, signatureHeader, webhookSecret)
  ) {
    return NextResponse.json(
      { error: "Invalid Stripe signature or timestamp expired" },
      { status: 400 }
    )
  }

  try {
    const event = JSON.parse(rawBody)

    if (
      event.type === "checkout.session.completed" ||
      event.type === "payment_intent.succeeded"
    ) {
      const dataObj = event.data?.object || {}
      const orderNumber =
        dataObj.client_reference_id ||
        dataObj.metadata?.orderNumber ||
        dataObj.metadata?.order_number

      if (orderNumber) {
        const [existing] = await db
          .select()
          .from(orders)
          .where(eq(orders.orderNumber, orderNumber))
          .limit(1)

        if (existing) {
          const paymentRef =
            typeof dataObj.payment_intent === "string"
              ? dataObj.payment_intent
              : dataObj.id

          await db
            .update(orders)
            .set({
              status: "COMPLETED",
              paymentRef,
              paymentProvider: "STRIPE",
              updatedAt: new Date(),
            })
            .where(eq(orders.id, existing.id))

          const existingItems = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, existing.id))

          const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          const shopBaseUrl =
            process.env.NEXT_PUBLIC_SHOP_URL || "https://shop.ryzmdn.me"
          const emailItems = []

          for (const item of existingItems) {
            const assignedToken =
              item.downloadToken || crypto.randomBytes(32).toString("hex")

            if (!item.downloadToken) {
              await db
                .update(orderItems)
                .set({
                  downloadToken: assignedToken,
                  tokenExpiresAt: expiryDate,
                })
                .where(eq(orderItems.id, item.id))
            }

            const [prod] = await db
              .select({ title: products.title })
              .from(products)
              .where(eq(products.id, item.productId))
              .limit(1)

            emailItems.push({
              title: prod?.title || "Digital Download Asset",
              price: item.pricePaid,
              quantity: 1,
              downloadToken: assignedToken,
              downloadUrl: `${shopBaseUrl}/order/${orderNumber}?token=${assignedToken}`,
            })
          }

          await logMasterTransaction({
            domain: "COMMERCE",
            actionType: "PAYMENT_SUCCEEDED",
            entityType: "orders",
            entityId: existing.orderNumber,
            orderId: existing.id,
            amount: existing.totalAmount,
            currency: existing.currency,
            status: "COMPLETED",
            metadata: {
              stripeEventId: event.id,
              stripeEventType: event.type,
              paymentIntentId: dataObj.id,
              itemsCount: emailItems.length,
            },
          })

          try {
            const customerEmail =
              dataObj.customer_details?.email ||
              dataObj.customer_email ||
              existing.customerEmail

            if (customerEmail) {
              await sendOrderConfirmationEmail({
                customerName:
                  dataObj.customer_details?.name ||
                  existing.customerName ||
                  undefined,
                customerEmail,
                orderNumber,
                orderDate: existing.createdAt,
                items: emailItems,
                totalAmount: existing.totalAmount,
                currency: existing.currency,
                shopUrl: shopBaseUrl,
                downloadTokenExpiresInDays: 7,
              })
            }
          } catch (mailError) {
            console.warn(
              "[Stripe Webhook] Order confirmation email dispatch failed:",
              mailError instanceof Error ? mailError.message : "Email error"
            )
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    console.error("[Stripe Webhook Error]:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
