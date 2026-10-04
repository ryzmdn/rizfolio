import { NextResponse } from "next/server"
import crypto from "crypto"
import { db, eq } from "@workspace/db"
import { orders } from "@workspace/db/schema"
import { logMasterTransaction } from "@/lib/api/audit"

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

  if (webhookSecret && !verifyStripeSignature(rawBody, signatureHeader, webhookSecret)) {
    return NextResponse.json(
      { error: "Invalid Stripe signature" },
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
          await db
            .update(orders)
            .set({
              status: "PAID",
              paymentRef: dataObj.id,
              updatedAt: new Date(),
            })
            .where(eq(orders.id, existing.id))

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
            },
          })
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
