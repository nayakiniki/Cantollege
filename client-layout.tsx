"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ElegantAnimatedBackground } from "@/components/elegant-animated-background"
import { OrderTrackingProvider } from "@/components/order-tracking-provider"
import { SeasonalNotifications } from "@/components/seasonal-notifications"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ElegantAnimatedBackground />
        <OrderTrackingProvider>{children}</OrderTrackingProvider>
        <SeasonalNotifications />
        <Toaster />
      </ThemeProvider>
    </div>
  )
}
