import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Container } from "@workspace/ui/components/layouts/container"
import { getOrderByNumber } from "@/lib/queries"
import { verifyAndFulfillStripeSession } from "@/lib/stripe-actions"
import { OrderFulfillmentHub } from "@/components/order-fulfillment-hub"

interface OrderPageProps {
  params: Promise<{
    orderId: string
  }>
  searchParams?: Promise<{
    session_id?: string
  }>
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { orderId } = await params
  const order = await getOrderByNumber(orderId)

  if (!order) {
    return {
      title: "Order Not Found | Rizfolio Store",
    }
  }

  return {
    title: `Order Receipt #${order.orderNumber} | Rizfolio Store`,
    description: `Order fulfillment, license certificate keys, and digital asset downloads for order ${order.orderNumber}.`,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: OrderPageProps) {
  const { orderId } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const sessionId = resolvedSearchParams?.session_id

  if (sessionId) {
    await verifyAndFulfillStripeSession(sessionId, orderId)
  }

  const order = await getOrderByNumber(orderId)

  if (!order) {
    notFound()
  }

  return (
    <Container className="max-w-4xl py-12 md:py-20">
      <OrderFulfillmentHub order={order} />
    </Container>
  )
}
