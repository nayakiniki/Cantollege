"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, ShoppingCart, Leaf, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { FoodItem, CartItem } from "@/lib/data"
import { useCartStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface FoodItemCardProps {
  item: FoodItem
}

export function FoodItemCard({ item }: FoodItemCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCustomizations, setSelectedCustomizations] = useState<CartItem["customizations"]>([])
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const addToCart = useCartStore((state) => state.addToCart)
  const { toast } = useToast()

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    if (item.customizations && item.customizations.length > 0 && !isDialogOpen) {
      setIsDialogOpen(true)
      return
    }

    addToCart(item, quantity, selectedCustomizations)
    toast({
      title: "Added to cart",
      description: `${quantity} × ${item.name} added to your cart`,
    })
    setQuantity(1)
    setSelectedCustomizations([])
    setIsDialogOpen(false)
  }

  const handleCustomizationChange = (customizationName: string, optionId: string) => {
    const customization = item.customizations?.find((c) => c.name === customizationName)
    if (!customization) return

    const option = customization.options.find((o) => o.id === optionId)
    if (!option) return

    setSelectedCustomizations((prev) => {
      const existing = prev?.findIndex((c) => c.name === customizationName)
      if (existing !== undefined && existing >= 0) {
        const updated = [...prev!]
        updated[existing] = { name: customizationName, option }
        return updated
      } else {
        return [...(prev || []), { name: customizationName, option }]
      }
    })
  }

  // Generate a background color based on the food category
  const getBgColor = () => {
    switch (item.category) {
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
    <>
      <Card
        className="overflow-hidden card-elegant card-elegant-hover group animate-elegant-fade-in"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden rounded-t-2xl">
          {imageError ? (
            <div className={`absolute inset-0 flex items-center justify-center ${getBgColor()}`}>
              <span className="font-audiowide text-2xl text-white drop-shadow-md text-center px-2">{item.name}</span>
            </div>
          ) : (
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className={`object-cover transition-all duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={item.category === "snacks"}
              onError={() => setImageError(true)}
              unoptimized={item.image.startsWith("http")}
            />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {item.isVeg && (
              <Badge className="badge-elegant badge-elegant-success flex items-center gap-1 backdrop-blur-sm">
                <Leaf className="h-3 w-3" />
                <span>Veg</span>
              </Badge>
            )}
            <Badge className="badge-elegant badge-elegant-primary backdrop-blur-sm">
              <Star className="h-3 w-3 mr-1" />
              4.5
            </Badge>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="font-audiowide text-xl gradient-text group-hover:scale-105 transition-transform duration-300 origin-left">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-2xl gradient-text">{formatPrice(item.price)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          <div className="flex items-center bg-elegant-800/30 rounded-xl p-1 backdrop-blur-sm border border-elegant-700/30">
            <Button
              variant="ghost"
              size="icon"
              onClick={decreaseQuantity}
              className="h-8 w-8 hover:bg-elegant-700/50 rounded-lg"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={increaseQuantity}
              className="h-8 w-8 hover:bg-elegant-700/50 rounded-lg"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={handleAddToCart} className="btn-elegant-primary gap-2 shadow-glow">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>

      {item.customizations && item.customizations.length > 0 && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-elegant max-w-md">
            <DialogHeader>
              <DialogTitle className="gradient-text font-audiowide text-xl">Customize {item.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {item.customizations.map((customization) => (
                <div key={customization.name} className="space-y-4">
                  <h4 className="font-medium text-lg">{customization.name}</h4>
                  <RadioGroup
                    defaultValue={customization.options[0].id}
                    onValueChange={(value) => handleCustomizationChange(customization.name, value)}
                  >
                    {customization.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between space-x-2 border border-elegant-700/30 p-4 rounded-xl bg-elegant-800/20 hover:bg-elegant-800/40 transition-colors duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="border-indigo-500 text-indigo-500"
                          />
                          <Label htmlFor={option.id} className="font-medium">
                            {option.name}
                          </Label>
                        </div>
                        <span className="text-sm font-medium gradient-text">
                          {option.price > 0
                            ? `+${formatPrice(option.price)}`
                            : option.price < 0
                              ? formatPrice(option.price)
                              : "Free"}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
            <DialogFooter className="gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="btn-elegant-secondary">
                Cancel
              </Button>
              <Button onClick={handleAddToCart} className="btn-elegant-primary">
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
