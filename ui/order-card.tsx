"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, MapPin, MessageSquare, CreditCard } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { EnhancedOrder } from "@/lib/types"
import { formatDate, formatPrice } from "@/lib/utils"

interface OrderCardProps {
  order: EnhancedOrder
}

export function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const getStatusColor = (status: EnhancedOrder["status"]) => {
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

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "processing":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      case "pending":
      default:
        return "bg-blue-500"
    }
  }

  const getPaymentMethodDetails = () => {
    if (!order.paymentDetails) {
      return order.paymentMethod === "cash" ? "Cash on Delivery" : order.paymentMethod
    }

    const { paymentDetails } = order

    if (paymentDetails.method === "card" && paymentDetails.cardDetails) {
      return `${paymentDetails.cardDetails.brand} ending in ${paymentDetails.cardDetails.last4}`
    } else if (paymentDetails.method === "upi" && paymentDetails.upiDetails) {
      return `UPI: ${paymentDetails.upiDetails.id}`
    } else if (paymentDetails.method === "wallet" && paymentDetails.walletDetails) {
      return `${paymentDetails.walletDetails.provider} Wallet`
    }

    return order.paymentMethod
  }

  const handlePayNow = () => {
    router.push(`/payment/${order.id}`)
  }

  return (
    <Card className="w-full glass-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-audiowide">Order #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground">{formatDate(order.timestamp)}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
            {order.paymentStatus && (
              <Badge
                className={`${getPaymentStatusColor(order.paymentStatus)} hover:${getPaymentStatusColor(order.paymentStatus)}`}
              >
                {order.paymentStatus === "completed" ? "Paid" : order.paymentStatus}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </p>
            <p className="font-medium">{formatPrice(order.totalAmount)}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleExpand} className="gap-1">
            {isExpanded ? (
              <>
                <span>Hide details</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>View details</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="space-y-3 border-t pt-3">
              <h4 className="font-medium">Order Items</h4>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {item.quantity} × {item.foodItem.name}
                    </p>
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {item.customizations.map((customization, index) => (
                          <span key={index}>
                            {customization.name}: {customization.option.name}
                            {index < item.customizations!.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Payment details */}
            <div className="space-y-3">
              <h4 className="font-medium">Payment Information</h4>
              <div className="flex items-start gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground">Payment Method:</span>
                  <p>{getPaymentMethodDetails()}</p>
                </div>
              </div>

              {order.paymentDetails && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <p>{order.paymentDetails.id}</p>
                </div>
              )}
            </div>

            {/* Additional order details */}
            <div className="space-y-3">
              {order.deliveryAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-muted-foreground">Delivery Address:</span>
                    <p>{order.deliveryAddress}</p>
                  </div>
                </div>
              )}

              {order.specialInstructions && (
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-muted-foreground">Special Instructions:</span>
                    <p>{order.specialInstructions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {order.status === "Placed" && "Estimated pickup time: 15-20 mins"}
            {order.status === "Preparing" && "Estimated pickup time: 5-10 mins"}
            {order.status === "Ready for Pickup" && "Your order is ready!"}
            {order.status === "Completed" && "Order completed"}
          </span>

          <div className="flex gap-2">
            {order.status !== "Completed" && (
              <Button size="sm" variant="outline" onClick={() => router.push(`/track/${order.id}`)}>
                Track Order
              </Button>
            )}

            {order.paymentStatus === "pending" && order.paymentMethod !== "cash" && (
              <Button size="sm" onClick={handlePayNow}>
                Pay Now
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
