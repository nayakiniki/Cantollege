"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { CartItemCard } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore, useOrderStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { formatPrice } from "@/lib/utils"
import { AlertCircle, CreditCard, Truck, MessageSquare, Smartphone, Wallet } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  const cart = useCartStore((state) => state.cart)
  const getTotalAmount = useCartStore((state) => state.getTotalAmount)
  const clearCart = useCartStore((state) => state.clearCart)
  const placeOrder = useOrderStore((state) => state.placeOrder)
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    setMounted(true)

    // Pre-fill delivery address if user is logged in
    if (isAuthenticated && user && user.address) {
      setDeliveryAddress(user.address)
    }
  }, [isAuthenticated, user])

  const handlePlaceOrder = () => {
    if (cart.length === 0) return

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsOrderConfirmOpen(true)
  }

  const confirmOrder = () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      })
      return
    }

    const order = placeOrder(user.id, cart, getTotalAmount(), paymentMethod, deliveryAddress, specialInstructions)

    if (paymentMethod === "cash") {
      // For cash payments, just clear cart and redirect to orders
      clearCart()
      setIsOrderConfirmOpen(false)

      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id} has been placed.`,
      })

      router.push("/my-orders")
    } else {
      // For other payment methods, redirect to payment page
      clearCart()
      setIsOrderConfirmOpen(false)
      router.push(`/payment/${order.id}`)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Header />

      <main className="flex-1 container py-8">
        <h1 className="text-4xl font-audiowide text-indigo-400 mb-8 text-center">Your Cart</h1>

        {cart.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {cart.map((item) => (
                      <CartItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24 glass-card">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(getTotalAmount())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(getTotalAmount())}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handlePlaceOrder} className="w-full">
                    Place Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">Your cart is empty.</p>
            <a href="/" className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md">
              Browse Menu
            </a>
          </div>
        )}
      </main>

      <Dialog open={isOrderConfirmOpen} onOpenChange={setIsOrderConfirmOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>Provide delivery details to complete your order</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Payment Method</Label>
                <RadioGroup defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Card Payment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      UPI Payment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4" />
                      Wallet Payment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-medium">
                  <Truck className="inline-block mr-2 h-4 w-4" />
                  Delivery Address
                </Label>
                <Input
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-base font-medium">
                  <MessageSquare className="inline-block mr-2 h-4 w-4" />
                  Special Instructions (Optional)
                </Label>
                <Textarea
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special instructions for your order?"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-md">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">This is a simulation</p>
                <p className="text-muted-foreground">No actual payment will be processed.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>{formatPrice(getTotalAmount())}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Estimated Pickup Time:</span>
                <span>15-20 minutes</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmOrder}>{paymentMethod === "cash" ? "Place Order" : "Proceed to Payment"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
