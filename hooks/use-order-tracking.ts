"use client"

import { useEffect, useState, useCallback } from "react"
import { useOrderStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { orderTrackingService, type OrderStatusUpdate } from "@/lib/order-tracking-service"
import { useToast } from "@/components/ui/use-toast"
import type { EnhancedOrder } from "@/lib/types"

export function useOrderTracking() {
  const [isTracking, setIsTracking] = useState(false)
  const { orders, updateOrderStatus, getUserOrders } = useOrderStore()
  const { user, isAuthenticated } = useAuthStore()
  const { toast } = useToast()

  // Handle order status updates
  const handleOrderUpdate = useCallback(
    (orderId: string, status: EnhancedOrder["status"]) => {
      updateOrderStatus(orderId, status)
    },
    [updateOrderStatus],
  )

  // Handle real-time notifications
  const handleStatusUpdate = useCallback(
    (update: OrderStatusUpdate) => {
      // Only show notifications for the current user's orders
      if (isAuthenticated && user) {
        const userOrders = getUserOrders(user.id)
        const isUserOrder = userOrders.some((order) => order.id === update.orderId)

        if (isUserOrder) {
          toast({
            title: `Order #${update.orderId}`,
            description: update.message || `Status updated to ${update.status}`,
            duration: 5000,
          })
        }
      }
    },
    [isAuthenticated, user, getUserOrders, toast],
  )

  // Start tracking all active orders
  const startTracking = useCallback(() => {
    if (!isAuthenticated || !user) return

    const userOrders = getUserOrders(user.id)
    const activeOrders = userOrders.filter(
      (order) =>
        order.status !== "Completed" && (order.paymentStatus === "completed" || order.paymentMethod === "cash"),
    )

    activeOrders.forEach((order) => {
      orderTrackingService.startTracking(order, handleOrderUpdate)
    })

    setIsTracking(true)
  }, [isAuthenticated, user, getUserOrders, handleOrderUpdate])

  // Stop tracking all orders
  const stopTracking = useCallback(() => {
    if (!isAuthenticated || !user) return

    const userOrders = getUserOrders(user.id)
    userOrders.forEach((order) => {
      orderTrackingService.stopTracking(order.id)
    })

    setIsTracking(false)
  }, [isAuthenticated, user, getUserOrders])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isAuthenticated) return

    const unsubscribe = orderTrackingService.subscribeToAllOrders(handleStatusUpdate)

    return () => {
      unsubscribe()
    }
  }, [isAuthenticated, handleStatusUpdate])

  // Auto-start tracking when user logs in or orders change
  useEffect(() => {
    if (isAuthenticated && user) {
      startTracking()
    } else {
      stopTracking()
    }

    return () => {
      stopTracking()
    }
  }, [isAuthenticated, user, orders, startTracking, stopTracking])

  return {
    isTracking,
    startTracking,
    stopTracking,
  }
}

// Hook for tracking a specific order
export function useOrderStatus(orderId: string) {
  const [updates, setUpdates] = useState<OrderStatusUpdate[]>([])
  const { getOrderById } = useOrderStore()

  useEffect(() => {
    const unsubscribe = orderTrackingService.subscribeToOrder(orderId, (update) => {
      setUpdates((prev) => [...prev, update])
    })

    return unsubscribe
  }, [orderId])

  const order = getOrderById(orderId)
  const isTracking = orderTrackingService.isTracking(orderId)
  const estimatedCompletionTime = order ? orderTrackingService.getEstimatedCompletionTime(order) : null
  const trackingEvents = order ? orderTrackingService.getTrackingEvents(order) : []

  return {
    order,
    updates,
    isTracking,
    estimatedCompletionTime,
    trackingEvents,
  }
}
