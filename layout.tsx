import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ElegantAnimatedBackground } from "@/components/elegant-animated-background"
import { OrderTrackingProvider } from "@/components/order-tracking-provider"
import { SeasonalNotifications } from "@/components/seasonal-notifications"

export const metadata: Metadata = {
  title: "Cantollege - College Canteen Food Ordering",
  description: "Order delicious food from your college canteen",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ElegantAnimatedBackground />
          <OrderTrackingProvider>{children}</OrderTrackingProvider>
          <SeasonalNotifications />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
