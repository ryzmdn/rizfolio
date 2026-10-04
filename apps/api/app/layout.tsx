import type { Metadata } from "next";
import "@workspace/ui/styles/globals.css";
import { fontVariables } from "@workspace/ui/lib/fonts";
import { cn } from "@workspace/ui/lib/utils";
import { AppProvider } from "@workspace/ui/components/app-provider";
import { THEMED_FAVICON_METADATA } from "@workspace/ui/lib/seo";

export const metadata: Metadata = {
  title: {
    default: "Rizfolio Developer Gateway & Core REST API",
    template: "%s | Rizfolio API Gateway",
  },
  description:
    "High-performance, secure unified REST API and Developer Portal for the Rizfolio ecosystem with interactive testing console and OpenAPI 3.1 specifications.",
  icons: THEMED_FAVICON_METADATA,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          fontVariables,
          "min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary"
        )}
      >
        <AppProvider disableCookieConsent>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

