"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useOrderStatus } from "@/hooks/use-order-tracking"
import { formatDate, formatPrice } from "@/lib/utils"
import { Clock, CheckCircle2, Package, ChefHat, Bell } from "lucide-react"
import type { OrderTrackingEvent } from "@/lib/order-tracking-service"

interface LiveOrderTrackingProps {
  orderId: string
}

export function LiveOrderTracking({ orderId }: LiveOrderTrackingProps) {
  const { order, isTracking, estimatedCompletionTime, trackingEvents } = useOrderStatus(orderId)
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Update current time every second for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!order) {
    return (
      <Card className="w-full glass-card">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Order not found</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusProgress = () => {
    switch (order.status) {
      case "Placed":
        return 25
      case "Preparing":
        return 50
      case "Ready for Pickup":
        return 75
      case "Completed":
        return 100
      default:
        return 0
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Placed":
        return <Package className="h-5 w-5" />
      case "Preparing":
        return <ChefHat className="h-5 w-5" />
      case "Ready for Pickup":
        return <Bell className="h-5 w-5" />
      case "Completed":
        return <CheckCircle2 className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed":
        return "bg-blue-500"
      case "Preparing":
        return "bg-yellow-500"
      case "Ready for Pickup":
        return "bg-green-500"
      case "Completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTimeRemaining = (targetTime: number) => {
    const remaining = Math.max(0, targetTime - currentTime)
    const minutes = Math.floor(remaining / (1000 * 60))
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

    if (remaining <= 0) {
      return "Ready now!"
    }

    return `${minutes}m ${seconds}s remaining`
  }

  const isEventCompleted = (event: OrderTrackingEvent) => {
    return currentTime >= event.timestamp
  }

  const isEventCurrent = (event: OrderTrackingEvent, index: number) => {
    const isCompleted = isEventCompleted(event)
    const nextEvent = trackingEvents[index + 1]
    const isNextCompleted = nextEvent ? isEventCompleted(nextEvent) : false

    return isCompleted && !isNextCompleted
  }

  return (
    <Card className="w-full glass-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-audiowide">Order #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground">{formatDate(order.timestamp)}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
            {isTracking && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Live Tracking
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Order Progress</span>
            <span>{getStatusProgress()}%</span>
          </div>
          <Progress value={getStatusProgress()} className="h-2" />
        </div>

        {/* Estimated Time */}
        {estimatedCompletionTime && order.status !== "Completed" && (
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Estimated Ready Time</p>
              <p className="text-sm text-muted-foreground">{formatTimeRemaining(estimatedCompletionTime)}</p>
            </div>
          </div>
        )}

        {/* Order Items Summary */}
        <div className="space-y-3">
          <h4 className="font-medium">Order Items</h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity} × {item.foodItem.name}
                </span>
                <span>{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="space-y-4">
          <h4 className="font-medium">Order Timeline</h4>
          <div className="space-y-4">
            {trackingEvents.map((event, index) => {
              const isCompleted = isEventCompleted(event)
              const isCurrent = isEventCurrent(event, index)

              return (
                <div key={`${event.orderId}-${event.status}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isCurrent
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-muted border-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {getStatusIcon(event.status)}
                    </div>
                    {index < trackingEvents.length - 1 && (
                      <div className={`w-0.5 h-8 mt-2 ${isCompleted ? "bg-primary" : "bg-muted-foreground/20"}`} />
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className={`font-medium ${isCurrent ? "text-primary" : ""}`}>{event.title}</h5>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        {isCompleted && (
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(event.timestamp)}</p>
                        )}
                      </div>
                      {isCurrent && event.estimatedTime && event.estimatedTime > 0 && (
                        <Badge variant="outline" className="text-xs">
                          ~{event.estimatedTime}m
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Live Updates Indicator */}
        {isTracking && order.status !== "Completed" && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-green-700 dark:text-green-300">
              Live tracking active - You'll receive updates as your order progresses
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
