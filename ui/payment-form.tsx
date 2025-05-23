"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useOrderStore } from "@/lib/store"
import {
  processPayment,
  validateCardNumber,
  validateCardExpiry,
  validateCVC,
  validateUpiId,
  formatCardNumber,
} from "@/lib/payment-service"
import { formatPrice } from "@/lib/utils"
import { AlertCircle, CreditCard, Loader2, Smartphone, Wallet } from "lucide-react"
import type { PaymentMethod } from "@/lib/types"

interface PaymentFormProps {
  orderId: string
  amount: number
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentForm({ orderId, amount, onSuccess, onCancel }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Card payment state
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  // UPI payment state
  const [upiId, setUpiId] = useState("")

  // Wallet payment state
  const [walletProvider, setWalletProvider] = useState("paytm")

  const router = useRouter()
  const { toast } = useToast()
  const { updateOrderPayment } = useOrderStore()

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 16) {
      setCardNumber(value)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
    }

    if (value.length <= 5) {
      setCardExpiry(value)
    }
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setCardCvc(value)
    }
  }

  const validatePaymentDetails = (): boolean => {
    setError(null)

    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
        setError("Please fill in all card details")
        return false
      }

      if (!validateCardNumber(cardNumber)) {
        setError("Invalid card number")
        return false
      }

      if (!validateCardExpiry(cardExpiry)) {
        setError("Invalid expiry date (MM/YY)")
        return false
      }

      if (!validateCVC(cardCvc)) {
        setError("Invalid CVC code")
        return false
      }
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        setError("Please enter your UPI ID")
        return false
      }

      if (!validateUpiId(upiId)) {
        setError("Invalid UPI ID format (username@provider)")
        return false
      }
    } else if (paymentMethod === "wallet") {
      if (!walletProvider) {
        setError("Please select a wallet provider")
        return false
      }
    }

    return true
  }

  const handlePayment = async () => {
    if (!validatePaymentDetails()) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      let paymentDetails

      if (paymentMethod === "card") {
        paymentDetails = await processPayment(amount, "card", {
          number: cardNumber,
          name: cardName,
          expiry: cardExpiry,
          cvc: cardCvc,
        })
      } else if (paymentMethod === "upi") {
        paymentDetails = await processPayment(amount, "upi", {
          id: upiId,
        })
      } else if (paymentMethod === "wallet") {
        paymentDetails = await processPayment(amount, "wallet", {
          provider: walletProvider,
        })
      }

      if (paymentDetails) {
        // Update order with payment details
        updateOrderPayment(orderId, paymentDetails)

        toast({
          title: "Payment successful!",
          description: `Your payment of ${formatPrice(amount)} has been processed.`,
        })

        onSuccess()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full glass-card">
      <CardContent className="pt-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Payment Details</h2>
          <p className="text-muted-foreground">Choose your preferred payment method</p>
        </div>

        <Tabs
          defaultValue="card"
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Card</span>
            </TabsTrigger>
            <TabsTrigger value="upi" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>UPI</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>Wallet</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(cardNumber)}
                onChange={handleCardNumberChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Expiry Date (MM/YY)</Label>
                <Input id="cardExpiry" placeholder="MM/YY" value={cardExpiry} onChange={handleExpiryChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardCvc">CVC</Label>
                <Input id="cardCvc" placeholder="123" value={cardCvc} onChange={handleCvcChange} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upi" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input id="upiId" placeholder="username@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
              <p className="text-xs text-muted-foreground">Enter your UPI ID in the format username@provider</p>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4">
            <div className="space-y-2">
              <Label>Select Wallet Provider</Label>
              <RadioGroup value={walletProvider} onValueChange={setWalletProvider}>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="paytm" id="paytm" />
                  <Label htmlFor="paytm">Paytm</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="phonepe" id="phonepe" />
                  <Label htmlFor="phonepe">PhonePe</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="amazonpay" id="amazonpay" />
                  <Label htmlFor="amazonpay">Amazon Pay</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-md mb-6">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">This is a simulation</p>
            <p className="text-muted-foreground">No actual payment will be processed.</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex justify-between font-medium">
            <span>Total Amount:</span>
            <span>{formatPrice(amount)}</span>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onCancel} disabled={isProcessing} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isProcessing} className="flex-1">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatPrice(amount)}`
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
