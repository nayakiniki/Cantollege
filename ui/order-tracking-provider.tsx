"use client"

import type React from "react"
import { useOrderTracking } from "@/hooks/use-order-tracking"

interface OrderTrackingProviderProps {
  children: React.ReactNode
}

export function OrderTrackingProvider({ children }: OrderTrackingProviderProps) {
  // This will automatically start tracking orders when the user is authenticated
  useOrderTracking()

  return <>{children}</>
}
