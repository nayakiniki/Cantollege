"use client"

import { useState, useEffect } from "react"
import { Bell, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useOrderStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"

export function OrderStatusIndicator() {
  const [mounted, setMounted] = useState(false)
  const { getUserOrders } = useOrderStore()
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isAuthenticated || !user) {
    return null
  }

  const userOrders = getUserOrders(user.id)
  const activeOrders = userOrders.filter((order) => order.status !== "Completed")
  const readyOrders = userOrders.filter((order) => order.status === "Ready for Pickup")

  if (activeOrders.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {readyOrders.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-green-600 hover:bg-green-600">
              {readyOrders.length}
            </Badge>
          )}
          {activeOrders.length > 0 && readyOrders.length === 0 && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 glass-card">
        <DropdownMenuLabel>Active Orders</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {activeOrders.slice(0, 3).map((order) => (
          <DropdownMenuItem
            key={order.id}
            onClick={() => router.push(`/track/${order.id}`)}
            className="flex flex-col items-start p-3 cursor-pointer"
          >
            <div className="flex justify-between w-full items-start">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="font-medium">Order #{order.id}</span>
              </div>
              <Badge
                className={`text-xs ${
                  order.status === "Ready for Pickup"
                    ? "bg-green-600 hover:bg-green-600"
                    : order.status === "Preparing"
                      ? "bg-yellow-600 hover:bg-yellow-600"
                      : "bg-blue-600 hover:bg-blue-600"
                }`}
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(order.timestamp)}</p>
            <p className="text-xs text-muted-foreground">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </p>
          </DropdownMenuItem>
        ))}
        {activeOrders.length > 3 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/my-orders")} className="text-center">
              View all orders ({activeOrders.length})
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
