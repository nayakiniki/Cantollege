"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useOrderStore } from "@/lib/store"
import { formatDate, formatPrice } from "@/lib/utils"
import { CheckCircle2, ChevronRight, Download, Receipt } from "lucide-react"
import type { EnhancedOrder } from "@/lib/types"

interface PaymentSuccessProps {
  orderId: string
}

export function PaymentSuccess({ orderId }: PaymentSuccessProps) {
  const [order, setOrder] = useState<EnhancedOrder | null>(null)
  const router = useRouter()
  const { getOrderById } = useOrderStore()

  useEffect(() => {
    const orderData = getOrderById(orderId)
    if (orderData) {
      setOrder(orderData)
    }
  }, [orderId, getOrderById])

  if (!order || !order.paymentDetails) {
    return null
  }

  const { paymentDetails } = order

  const getPaymentMethodDetails = () => {
    if (paymentDetails.method === "card" && paymentDetails.cardDetails) {
      return `${paymentDetails.cardDetails.brand} ending in ${paymentDetails.cardDetails.last4}`
    } else if (paymentDetails.method === "upi" && paymentDetails.upiDetails) {
      return `UPI ID: ${paymentDetails.upiDetails.id}`
    } else if (paymentDetails.method === "wallet" && paymentDetails.walletDetails) {
      return `${paymentDetails.walletDetails.provider} Wallet`
    }
    return "Payment completed"
  }

  return (
    <Card className="w-full glass-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl font-audiowide gradient-text">Payment Successful!</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted/30 p-4">
          <div className="mb-2 text-sm font-medium text-muted-foreground">Transaction Details</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Payment ID</span>
              <span className="font-medium">{paymentDetails.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time</span>
              <span className="font-medium">{formatDate(paymentDetails.timestamp)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-medium">{getPaymentMethodDetails()}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount</span>
              <span className="font-medium">{formatPrice(paymentDetails.amount)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/30 p-4">
          <div className="mb-2 text-sm font-medium text-muted-foreground">Order Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Items</span>
              <span className="font-medium">{order.items.length} items</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-medium">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full" onClick={() => router.push("/my-orders")}>
          <Receipt className="mr-2 h-4 w-4" />
          View Order Details
        </Button>

        <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
          Continue Shopping
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>

        {paymentDetails.receiptUrl && (
          <Button variant="ghost" className="w-full" onClick={() => window.open(paymentDetails.receiptUrl, "_blank")}>
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
