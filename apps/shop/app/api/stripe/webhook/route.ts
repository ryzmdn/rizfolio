import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import {
  db,
  orders,
  orderItems,
  products,
  masterTransactions,
  eq,
} from "@workspace/db"
import { sendOrderConfirmationEmail } from "@workspace/email"
import { fallbackOrders } from "@/data"

export const dynamic = "force-dynamic"

function generateDownloadToken(): string {
  return randomBytes(32).toString("hex")
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (signature) {
    const parts = signature.split(",")
    let timestamp = ""
    for (const part of parts) {
      const [key, val] = part.split("=")
      if (key === "t" && val) timestamp = val
    }
    if (timestamp) {
      const timestampSec = Number(timestamp)
      const currentSec = Math.floor(Date.now() / 1000)
      if (isNaN(timestampSec) || Math.abs(currentSec - timestampSec) > 300) {
        return new NextResponse("Webhook signature timestamp expired", {
          status: 400,
        })
      }
    }
  }

  let event: Stripe.Event

  if (webhookSecret && signature && stripe) {
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret,
        300
      )
    } catch (err) {
      console.error(
        "Stripe webhook signature verification failed:",
        err instanceof Error ? err.message : err
      )
      return new NextResponse("Webhook signature verification failed", {
        status: 400,
      })
    }
  } else {
    try {
      event = JSON.parse(body) as Stripe.Event
    } catch {
      return new NextResponse("Invalid webhook payload format", { status: 400 })
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderNumber =
          session.client_reference_id || session.metadata?.orderNumber

        if (!orderNumber) {
          console.warn(
            "Stripe Checkout completed without orderNumber reference."
          )
          break
        }

        const paymentRef =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.id

        try {
          const matchedOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.orderNumber, orderNumber))
            .limit(1)

          const dbOrder = matchedOrders[0]

          if (dbOrder) {
            await db
              .update(orders)
              .set({
                status: "COMPLETED",
                paymentRef,
                paymentProvider: "STRIPE",
                updatedAt: new Date(),
              })
              .where(eq(orders.id, dbOrder.id))

            const existingItems = await db
              .select()
              .from(orderItems)
              .where(eq(orderItems.orderId, dbOrder.id))

            const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            const shopBaseUrl =
              process.env.NEXT_PUBLIC_SHOP_URL || "http://localhost:3002"

            const emailItems = []

            for (const item of existingItems) {
              const assignedToken =
                item.downloadToken || generateDownloadToken()
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

            await db.insert(masterTransactions).values({
              trxNumber: `TRX-${orderNumber}-${Date.now().toString().slice(-4)}`,
              domain: "COMMERCE",
              actionType: "STRIPE_CHECKOUT_COMPLETED",
              status: "COMPLETED",
              actorType: "CUSTOMER",
              entityType: "ORDER",
              entityId: dbOrder.id,
              orderId: dbOrder.id,
              amount: dbOrder.totalAmount,
              currency: (session.currency || dbOrder.currency).toUpperCase(),
              metadata: {
                stripeSessionId: session.id,
                paymentIntent: paymentRef,
                customerEmail:
                  session.customer_details?.email || dbOrder.customerEmail,
                paymentStatus: session.payment_status,
              },
            })

            try {
              const customerEmail =
                session.customer_details?.email || dbOrder.customerEmail
              if (customerEmail) {
                await sendOrderConfirmationEmail({
                  customerName: session.customer_details?.name || undefined,
                  customerEmail,
                  orderNumber,
                  orderDate: dbOrder.createdAt,
                  items: emailItems,
                  totalAmount: Number(dbOrder.totalAmount),
                  currency: (
                    session.currency || dbOrder.currency
                  ).toUpperCase(),
                  shopUrl: shopBaseUrl,
                  downloadTokenExpiresInDays: 7,
                })
              }
            } catch (mailError) {
              console.warn(
                "[Shop Webhook] Order confirmation email dispatch failed:",
                mailError instanceof Error ? mailError.message : "Email error"
              )
            }
          }
        } catch (dbErr) {
          console.warn(
            "Database update in webhook skipped, relying on resilient store:",
            dbErr instanceof Error ? dbErr.message : "DB unavailable"
          )
        }

        const memoryOrder = fallbackOrders.find(
          (o) => o.orderNumber === orderNumber
        )
        if (memoryOrder) {
          memoryOrder.status = "COMPLETED"
          memoryOrder.paymentMethod = "Stripe Checkout (Verified)"
        }

        revalidatePath("/")
        revalidatePath(`/order/${orderNumber}`)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderNumber = paymentIntent.metadata?.orderNumber

        if (orderNumber) {
          try {
            await db
              .update(orders)
              .set({
                status: "FAILED",
                updatedAt: new Date(),
              })
              .where(eq(orders.orderNumber, orderNumber))
          } catch {}

          const memoryOrder = fallbackOrders.find(
            (o) => o.orderNumber === orderNumber
          )
          if (memoryOrder) {
            memoryOrder.status = "FAILED"
          }
        }
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (handlerError) {
    console.error("Error processing Stripe webhook event:", handlerError)
    return new NextResponse("Internal webhook processing error", {
      status: 500,
    })
  }
}
