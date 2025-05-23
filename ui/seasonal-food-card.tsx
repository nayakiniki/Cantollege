"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, ShoppingCart, Leaf, Star, Clock, Flame, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CountdownTimer } from "@/components/countdown-timer"
import type { SeasonalItem } from "@/lib/seasonal-service"
import { useCartStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { seasonalService } from "@/lib/seasonal-service"

interface SeasonalFoodCardProps {
  item: SeasonalItem
}

export function SeasonalFoodCard({ item }: SeasonalFoodCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const addToCart = useCartStore((state) => state.addToCart)
  const { toast } = useToast()

  const timeRemaining = seasonalService.getTimeRemaining(item)
  const isAvailable = seasonalService.isItemAvailable(item)

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    if (!isAvailable) {
      toast({
        title: "Item not available",
        description: timeRemaining.isComingSoon ? "This item is coming soon!" : "This item is no longer available.",
        variant: "destructive",
      })
      return
    }

    // Check quantity availability
    if (item.availableQuantity && quantity > item.availableQuantity) {
      toast({
        title: "Limited quantity",
        description: `Only ${item.availableQuantity} items remaining.`,
        variant: "destructive",
      })
      return
    }

    // Purchase the seasonal item (reduce quantity)
    const success = seasonalService.purchaseSeasonalItem(item.id, quantity)

    if (!success) {
      toast({
        title: "Purchase failed",
        description: "Unable to add item to cart. Please try again.",
        variant: "destructive",
      })
      return
    }

    addToCart(item, quantity)
    toast({
      title: "Added to cart",
      description: `${quantity} × ${item.name} added to your cart`,
    })
    setQuantity(1)
  }

  // Generate gradient based on seasonal theme
  const getSeasonalGradient = () => {
    const colors = item.theme.colors
    return `linear-gradient(135deg, ${colors[0]}20, ${colors[1]}20, ${colors[2]}20)`
  }

  const getSeasonalBorder = () => {
    return `border-[${item.theme.colors[0]}]/30`
  }

  const getBadgeColor = () => {
    switch (item.season) {
      case "spring":
        return "bg-green-600/20 text-green-300 border-green-500/30"
      case "summer":
        return "bg-yellow-600/20 text-yellow-300 border-yellow-500/30"
      case "fall":
        return "bg-red-600/20 text-red-300 border-red-500/30"
      case "winter":
        return "bg-blue-600/20 text-blue-300 border-blue-500/30"
      case "special":
        return "bg-purple-600/20 text-purple-300 border-purple-500/30"
      default:
        return "bg-indigo-600/20 text-indigo-300 border-indigo-500/30"
    }
  }

  return (
    <Card
      className="overflow-hidden card-elegant card-elegant-hover group animate-elegant-fade-in relative"
      style={{ background: getSeasonalGradient() }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Seasonal glow effect */}
      <div
        className="absolute inset-0 opacity-20 blur-xl"
        style={{
          background: `linear-gradient(135deg, ${item.theme.colors[0]}, ${item.theme.colors[1]}, ${item.theme.colors[2]})`,
        }}
      />

      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        {imageError ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: getSeasonalGradient() }}
          >
            <div className="text-center">
              <span className="text-4xl mb-2 block">{item.theme.icon}</span>
              <span className="font-audiowide text-lg text-white drop-shadow-md">{item.name}</span>
            </div>
          </div>
        ) : (
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className={`object-cover transition-all duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            unoptimized={item.image.startsWith("http")}
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {item.specialBadge && (
              <Badge className={`${getBadgeColor()} backdrop-blur-sm font-bold text-xs animate-pulse`}>
                <Sparkles className="h-3 w-3 mr-1" />
                {item.specialBadge}
              </Badge>
            )}

            {item.isVeg && (
              <Badge className="badge-elegant badge-elegant-success flex items-center gap-1 backdrop-blur-sm">
                <Leaf className="h-3 w-3" />
                <span>Veg</span>
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Badge className="badge-elegant badge-elegant-primary backdrop-blur-sm">
              <Star className="h-3 w-3 mr-1" />
              4.8
            </Badge>

            {item.availableQuantity && item.availableQuantity <= 10 && (
              <Badge className="bg-red-600/20 text-red-300 border-red-500/30 backdrop-blur-sm text-xs animate-pulse">
                Only {item.availableQuantity} left!
              </Badge>
            )}
          </div>
        </div>

        {/* Seasonal icon overlay */}
        <div className="absolute bottom-3 right-3">
          <div className="text-3xl opacity-80 animate-float">{item.theme.icon}</div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4 relative">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-audiowide text-xl gradient-text group-hover:scale-105 transition-transform duration-300 origin-left">
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
          </div>

          <div className="text-right">
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-sm text-muted-foreground line-through block">
                {formatPrice(item.originalPrice)}
              </span>
            )}
            <span className="font-bold text-2xl gradient-text">{formatPrice(item.price)}</span>
            {item.originalPrice && item.originalPrice > item.price && (
              <div className="text-xs text-green-400 font-medium">
                Save {formatPrice(item.originalPrice - item.price)}
              </div>
            )}
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-elegant-800/30 rounded-xl p-3 backdrop-blur-sm border border-elegant-700/30">
          {timeRemaining.isComingSoon ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Coming Soon</span>
              </div>
              <CountdownTimer
                targetDate={item.startDate}
                isComingSoon={true}
                showIcon={false}
                className="text-indigo-300"
              />
            </div>
          ) : timeRemaining.isExpired ? (
            <div className="flex items-center gap-2 text-red-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">No longer available</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-400">
                <Flame className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Limited Time</span>
              </div>
              <CountdownTimer targetDate={item.endDate} showIcon={false} className="text-orange-300" />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        {isAvailable ? (
          <>
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
                disabled={item.availableQuantity ? quantity >= item.availableQuantity : false}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleAddToCart} className="btn-elegant-primary gap-2 shadow-glow">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </>
        ) : (
          <div className="w-full text-center">
            <Button disabled className="w-full opacity-50">
              {timeRemaining.isComingSoon ? "Coming Soon" : "Not Available"}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
