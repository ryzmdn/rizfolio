import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"

export const metadata: Metadata = {
  title: "Personal CMS",
  description: "Exclusive administrative dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="w-full scroll-smooth" suppressHydrationWarning>
      <body className={cn(fontVariables)}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
