import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout | Rizfolio Store",
  description: "Secure digital checkout for architectural packages and consultation bookings.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
