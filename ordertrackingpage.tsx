"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { LiveOrderTracking } from "@/components/live-order-tracking"
import { Button } from "@/components/ui/button"
import { useOrderStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { EnhancedOrder } from "@/lib/types"

export default function TrackOrderPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<EnhancedOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const router = useRouter()
  const { getOrderById } = useOrderStore()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    setIsLoading(true)
    const orderData = getOrderById(params.orderId)

    if (orderData) {
      setOrder(orderData)

      // Check if user is authorized to view this order
      if (isAuthenticated && user && orderData.userId === user.id) {
        setIsAuthorized(true)
      } else if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push(`/login?redirect=/track/${params.orderId}`)
        return
      } else {
        // User is authenticated but not authorized
        setIsAuthorized(false)
      }
    } else {
      // Order not found
      setOrder(null)
      setIsAuthorized(false)
    }

    setIsLoading(false)
  }, [params.orderId, getOrderById, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading order details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Order not found</h2>
            <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/my-orders")}>Go to My Orders</Button>
          </div>
        </main>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">You don't have permission to view this order.</p>
            <Button onClick={() => router.push("/my-orders")}>Go to My Orders</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 relative z-10">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-audiowide gradient-text">Track Your Order</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <LiveOrderTracking orderId={order.id} />
        </div>
      </main>
    </div>
  )
}

