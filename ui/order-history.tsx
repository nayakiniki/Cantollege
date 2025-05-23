"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderCard } from "@/components/order-card"
import { useOrderStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { Package, ShoppingBag } from "lucide-react"
import type { EnhancedOrder } from "@/lib/types"

export function OrderHistory() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { orders, getUserOrders } = useOrderStore()
  const [userOrders, setUserOrders] = useState<EnhancedOrder[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (isAuthenticated && user) {
      const filteredOrders = getUserOrders(user.id)
      setUserOrders(filteredOrders)
    }
  }, [isAuthenticated, user, orders, getUserOrders])

  if (!isAuthenticated || !user) {
    return (
      <Card className="w-full glass-card">
        <CardHeader>
          <CardTitle>Not Logged In</CardTitle>
          <CardDescription>Please log in to view your order history</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-medium mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your orders</p>
          <Button onClick={() => router.push("/login")}>Login</Button>
        </CardContent>
      </Card>
    )
  }

  // Filter orders based on active tab
  const filteredOrders = userOrders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return order.status === "Placed" || order.status === "Preparing"
    if (activeTab === "completed") return order.status === "Completed" || order.status === "Ready for Pickup"
    return true
  })

  return (
    <Card className="w-full glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-audiowide gradient-text">Your Orders</CardTitle>
        <CardDescription>View and track your order history</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-medium mb-2">No orders found</h2>
                <p className="text-muted-foreground mb-6">
                  {activeTab === "all"
                    ? "You haven't placed any orders yet"
                    : activeTab === "active"
                      ? "You don't have any active orders"
                      : "You don't have any completed orders"}
                </p>
                <Button onClick={() => router.push("/")}>Browse Menu</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
