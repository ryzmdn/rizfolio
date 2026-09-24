import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { CmsShell } from "../components/cms-shell"
import { getCurrentUser } from "@/lib/auth-actions"

export const metadata: Metadata = {
  title: "Personal CMS",
  description: "Exclusive administrative dashboard",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser()

  return (
    <html lang="en" className="w-full scroll-smooth" suppressHydrationWarning>
      <body className={cn(fontVariables)}>
        <AppProvider>
          <CmsShell userEmail={user?.email}>{children}</CmsShell>
        </AppProvider>
      </body>
    </html>
  )
}
