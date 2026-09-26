import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as any,
      appInfo: {
        name: "RizShop Commerce",
        version: "1.0.0",
        url: "https://shop.rizkyramadhan.dev",
      },
    })
  : null

export function isStripeConfigured(): boolean {
  return Boolean(stripe && stripeSecretKey && stripeSecretKey.startsWith("sk_"))
}

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
}
