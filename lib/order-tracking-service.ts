"use client"

import type { EnhancedOrder } from "./types"

export interface OrderStatusUpdate {
  orderId: string
  status: EnhancedOrder["status"]
  timestamp: number
  estimatedTime?: number
  message?: string
}

export interface OrderTrackingEvent {
  orderId: string
  status: EnhancedOrder["status"]
  timestamp: number
  title: string
  description: string
  estimatedTime?: number
}

// Simulated order progression times (in milliseconds)
const ORDER_PROGRESSION_TIMES = {
  Placed: 3000, // 3 seconds to start preparing
  Preparing: 8000, // 8 seconds to be ready
  "Ready for Pickup": 15000, // 15 seconds before marking as completed
}

// Status messages for different stages
const STATUS_MESSAGES = {
  Placed: "Your order has been received and is being processed",
  Preparing: "Our chefs are preparing your delicious meal",
  "Ready for Pickup": "Your order is ready! Please come to the pickup counter",
  Completed: "Order completed. Thank you for choosing Cantollege!",
}

// Estimated pickup times for each status
const ESTIMATED_TIMES = {
  Placed: 15, // 15 minutes from placed
  Preparing: 8, // 8 minutes from preparing
  "Ready for Pickup": 0, // Ready now
  Completed: 0, // Already completed
}

class OrderTrackingService {
  private activeTrackers = new Map<string, NodeJS.Timeout>()
  private subscribers = new Map<string, Set<(update: OrderStatusUpdate) => void>>()
  private globalSubscribers = new Set<(update: OrderStatusUpdate) => void>()

  // Start tracking an order
  startTracking(order: EnhancedOrder, onUpdate: (orderId: string, status: EnhancedOrder["status"]) => void) {
    // Don't track if already completed or if already tracking
    if (order.status === "Completed" || this.activeTrackers.has(order.id)) {
      return
    }

    // Don't track cash orders that are already placed (they don't need payment processing)
    if (order.paymentMethod === "cash" && order.status === "Placed") {
      this.scheduleStatusUpdate(order.id, "Preparing", ORDER_PROGRESSION_TIMES["Placed"], onUpdate)
    } else if (order.paymentStatus === "completed" && order.status === "Placed") {
      // Start tracking paid orders
      this.scheduleStatusUpdate(order.id, "Preparing", ORDER_PROGRESSION_TIMES["Placed"], onUpdate)
    }
  }

  // Schedule the next status update
  private scheduleStatusUpdate(
    orderId: string,
    nextStatus: EnhancedOrder["status"],
    delay: number,
    onUpdate: (orderId: string, status: EnhancedOrder["status"]) => void,
  ) {
    const timeout = setTimeout(() => {
      // Update the status
      onUpdate(orderId, nextStatus)

      // Notify subscribers
      this.notifySubscribers(orderId, nextStatus)

      // Schedule next update if not completed
      if (nextStatus !== "Completed") {
        const nextNextStatus = this.getNextStatus(nextStatus)
        if (nextNextStatus) {
          const nextDelay = ORDER_PROGRESSION_TIMES[nextStatus]
          this.scheduleStatusUpdate(orderId, nextNextStatus, nextDelay, onUpdate)
        }
      } else {
        // Remove tracker when completed
        this.activeTrackers.delete(orderId)
      }
    }, delay)

    this.activeTrackers.set(orderId, timeout)
  }

  // Get the next status in the progression
  private getNextStatus(currentStatus: EnhancedOrder["status"]): EnhancedOrder["status"] | null {
    switch (currentStatus) {
      case "Placed":
        return "Preparing"
      case "Preparing":
        return "Ready for Pickup"
      case "Ready for Pickup":
        return "Completed"
      default:
        return null
    }
  }

  // Subscribe to updates for a specific order
  subscribeToOrder(orderId: string, callback: (update: OrderStatusUpdate) => void) {
    if (!this.subscribers.has(orderId)) {
      this.subscribers.set(orderId, new Set())
    }
    this.subscribers.get(orderId)!.add(callback)

    // Return unsubscribe function
    return () => {
      const orderSubscribers = this.subscribers.get(orderId)
      if (orderSubscribers) {
        orderSubscribers.delete(callback)
        if (orderSubscribers.size === 0) {
          this.subscribers.delete(orderId)
        }
      }
    }
  }

  // Subscribe to all order updates
  subscribeToAllOrders(callback: (update: OrderStatusUpdate) => void) {
    this.globalSubscribers.add(callback)

    // Return unsubscribe function
    return () => {
      this.globalSubscribers.delete(callback)
    }
  }

  // Notify subscribers of status update
  private notifySubscribers(orderId: string, status: EnhancedOrder["status"]) {
    const update: OrderStatusUpdate = {
      orderId,
      status,
      timestamp: Date.now(),
      estimatedTime: ESTIMATED_TIMES[status],
      message: STATUS_MESSAGES[status],
    }

    // Notify order-specific subscribers
    const orderSubscribers = this.subscribers.get(orderId)
    if (orderSubscribers) {
      orderSubscribers.forEach((callback) => callback(update))
    }

    // Notify global subscribers
    this.globalSubscribers.forEach((callback) => callback(update))
  }

  // Stop tracking an order
  stopTracking(orderId: string) {
    const timeout = this.activeTrackers.get(orderId)
    if (timeout) {
      clearTimeout(timeout)
      this.activeTrackers.delete(orderId)
    }
  }

  // Get tracking events for an order (for timeline display)
  getTrackingEvents(order: EnhancedOrder): OrderTrackingEvent[] {
    const events: OrderTrackingEvent[] = []
    const orderTime = order.timestamp

    // Order placed event
    events.push({
      orderId: order.id,
      status: "Placed",
      timestamp: orderTime,
      title: "Order Placed",
      description: "Your order has been received and confirmed",
    })

    // Add events based on current status
    if (order.status === "Preparing" || order.status === "Ready for Pickup" || order.status === "Completed") {
      events.push({
        orderId: order.id,
        status: "Preparing",
        timestamp: orderTime + ORDER_PROGRESSION_TIMES["Placed"],
        title: "Preparing Your Order",
        description: "Our chefs have started preparing your meal",
        estimatedTime: ESTIMATED_TIMES["Preparing"],
      })
    }

    if (order.status === "Ready for Pickup" || order.status === "Completed") {
      events.push({
        orderId: order.id,
        status: "Ready for Pickup",
        timestamp: orderTime + ORDER_PROGRESSION_TIMES["Placed"] + ORDER_PROGRESSION_TIMES["Preparing"],
        title: "Ready for Pickup",
        description: "Your order is ready! Please come to the pickup counter",
      })
    }

    if (order.status === "Completed") {
      events.push({
        orderId: order.id,
        status: "Completed",
        timestamp:
          orderTime +
          ORDER_PROGRESSION_TIMES["Placed"] +
          ORDER_PROGRESSION_TIMES["Preparing"] +
          ORDER_PROGRESSION_TIMES["Ready for Pickup"],
        title: "Order Completed",
        description: "Thank you for choosing Cantollege!",
      })
    }

    return events
  }

  // Check if an order is being tracked
  isTracking(orderId: string): boolean {
    return this.activeTrackers.has(orderId)
  }

  // Get estimated completion time
  getEstimatedCompletionTime(order: EnhancedOrder): number {
    const now = Date.now()
    const orderTime = order.timestamp

    switch (order.status) {
      case "Placed":
        return orderTime + ORDER_PROGRESSION_TIMES["Placed"] + ORDER_PROGRESSION_TIMES["Preparing"]
      case "Preparing":
        return orderTime + ORDER_PROGRESSION_TIMES["Placed"] + ORDER_PROGRESSION_TIMES["Preparing"]
      case "Ready for Pickup":
        return now // Ready now
      case "Completed":
        return orderTime // Already completed
      default:
        return now + 15 * 60 * 1000 // Default 15 minutes
    }
  }
}

// Export singleton instance
export const orderTrackingService = new OrderTrackingService()
