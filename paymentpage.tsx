"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { PaymentForm } from "@/components/payment-form"
import { PaymentSuccess } from "@/components/payment-success"
import { Button } from "@/components/ui/button"
import { useOrderStore } from "@/lib/store"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { EnhancedOrder } from "@/lib/types"

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<EnhancedOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const router = useRouter()
  const { getOrderById } = useOrderStore()

  useEffect(() => {
    setIsLoading(true)
    const orderData = getOrderById(params.orderId)

    if (orderData) {
      setOrder(orderData)
      // Check if payment is already complete
      if (orderData.paymentStatus === "completed" && orderData.paymentDetails) {
        setPaymentComplete(true)
      }
    } else {
      // Order not found, redirect to orders page
      router.push("/my-orders")
    }

    setIsLoading(false)
  }, [params.orderId, getOrderById, router])

  const handlePaymentSuccess = () => {
    setPaymentComplete(true)
  }

  const handleCancel = () => {
    router.push("/my-orders")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading payment details...</p>
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
          <h1 className="text-3xl font-audiowide gradient-text">
            {paymentComplete ? "Payment Confirmation" : "Complete Payment"}
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {paymentComplete ? (
            <PaymentSuccess orderId={order.id} />
          ) : (
            <PaymentForm
              orderId={order.id}
              amount={order.totalAmount}
              onSuccess={handlePaymentSuccess}
              onCancel={handleCancel}
            />
          )}
        </div>
      </main>
    </div>
  )
}
