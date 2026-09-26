import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { db, orders, orderItems, masterTransactions, eq } from "@workspace/db"
import { fallbackOrders } from "@/data"

export const dynamic = "force-dynamic"

function generateDownloadToken(): string {
  return `tok_${randomBytes(24).toString("hex")}`
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  if (webhookSecret && signature && stripe) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
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
          console.warn("Stripe Checkout completed without orderNumber reference.")
          break
        }

        const paymentRef =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.id

        // Update database order
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

            const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

            for (const item of existingItems) {
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
              entityId: dbOrder.id,
              orderId: dbOrder.id,
              amount: dbOrder.totalAmount,
              currency: (session.currency || dbOrder.currency).toUpperCase(),
              metadata: {
                stripeSessionId: session.id,
                paymentIntent: paymentRef,
                customerEmail: session.customer_details?.email || dbOrder.customerEmail,
                paymentStatus: session.payment_status,
              },
            })
          }
        } catch (dbErr) {
          console.warn(
            "Database update in webhook skipped, relying on resilient store:",
            dbErr instanceof Error ? dbErr.message : "DB unavailable"
          )
        }

        // Update in-memory fallback store
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
          } catch {
            // Ignored
          }

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
