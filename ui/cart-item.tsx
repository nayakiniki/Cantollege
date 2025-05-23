"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CartItem } from "@/lib/data"
import { useCartStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"

interface CartItemProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCartStore()
  const [imageError, setImageError] = useState(false)

  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    } else {
      removeFromCart(item.id)
    }
  }

  const handleRemove = () => {
    removeFromCart(item.id)
  }

  // Generate a background color based on the food category
  const getBgColor = () => {
    switch (item.foodItem.category) {
      case "snacks":
        return "bg-gradient-to-br from-orange-500/20 to-yellow-500/20"
      case "main-course":
        return "bg-gradient-to-br from-red-500/20 to-orange-500/20"
      case "beverages":
        return "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
      case "desserts":
        return "bg-gradient-to-br from-pink-500/20 to-purple-500/20"
      default:
        return "bg-gradient-to-br from-gray-500/20 to-gray-700/20"
    }
  }

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border border-muted">
        {imageError ? (
          <div className={`absolute inset-0 flex items-center justify-center ${getBgColor()}`}>
            <span className="font-audiowide text-xs text-white drop-shadow-md text-center px-1">
              {item.foodItem.name}
            </span>
          </div>
        ) : (
          <Image
            src={item.foodItem.image || "/placeholder.svg"}
            alt={item.foodItem.name}
            fill
            className="object-cover"
            sizes="80px"
            onError={() => setImageError(true)}
            unoptimized={item.foodItem.image.startsWith("http")}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.foodItem.name}</h3>
          <Button variant="ghost" size="icon" onClick={handleRemove} className="h-8 w-8">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mb-2">
          {item.customizations && item.customizations.length > 0 && (
            <div className="mt-1">
              {item.customizations.map((customization, index) => (
                <div key={index} className="text-xs">
                  {customization.name}: {customization.option.name}
                  {customization.option.price > 0 && ` (+${formatPrice(customization.option.price)})`}
                  {customization.option.price < 0 && ` (${formatPrice(customization.option.price)})`}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecreaseQuantity}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncreaseQuantity}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="font-medium">{formatPrice(item.totalPrice)}</div>
        </div>
      </div>
    </div>
  )
}
