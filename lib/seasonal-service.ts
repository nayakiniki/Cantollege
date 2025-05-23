"use client"

import type { FoodItem } from "./data"

export interface SeasonalItem extends FoodItem {
  seasonalId: string
  season: "spring" | "summer" | "fall" | "winter" | "special"
  startDate: number // timestamp
  endDate: number // timestamp
  isLimitedTime: boolean
  originalPrice?: number // for special pricing
  specialBadge?: string // e.g., "NEW", "LIMITED", "SEASONAL"
  availableQuantity?: number // for limited quantity items
  theme: {
    colors: string[]
    icon: string
    description: string
  }
}

export interface SeasonalPromotion {
  id: string
  title: string
  description: string
  startDate: number
  endDate: number
  items: SeasonalItem[]
  bannerImage?: string
  discountPercentage?: number
}

// Seasonal themes
const SEASONAL_THEMES = {
  spring: {
    colors: ["#10b981", "#34d399", "#6ee7b7"],
    icon: "🌸",
    description: "Fresh spring flavors",
  },
  summer: {
    colors: ["#f59e0b", "#fbbf24", "#fcd34d"],
    icon: "☀️",
    description: "Cool summer treats",
  },
  fall: {
    colors: ["#dc2626", "#ef4444", "#f87171"],
    icon: "🍂",
    description: "Warm autumn comfort",
  },
  winter: {
    colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
    icon: "❄️",
    description: "Cozy winter warmth",
  },
  special: {
    colors: ["#8b5cf6", "#a78bfa", "#c4b5fd"],
    icon: "✨",
    description: "Special limited edition",
  },
}

// Sample seasonal items
const SEASONAL_ITEMS: SeasonalItem[] = [
  // Spring Items
  {
    id: "spring-mango-lassi",
    seasonalId: "spring-2024-1",
    name: "Fresh Mango Lassi Supreme",
    description: "Premium mango lassi with fresh seasonal mangoes and cardamom",
    price: 55,
    originalPrice: 65,
    image: "https://annikaeats.com/wp-content/uploads/2024/03/DSC_1071.jpg",
    category: "beverages",
    isVeg: true,
    season: "spring",
    startDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // Started 7 days ago
    endDate: Date.now() + 23 * 24 * 60 * 60 * 1000, // Ends in 23 days
    isLimitedTime: true,
    specialBadge: "SPRING SPECIAL",
    availableQuantity: 50,
    theme: SEASONAL_THEMES.spring,
  },
  {
    id: "spring-garden-salad",
    seasonalId: "spring-2024-2",
    name: "Garden Fresh Spring Salad",
    description: "Crisp greens, radishes, peas, chickpeas, avocado and feta with mint dressing",
    price: 45,
    image:
      "https://sjc.microlink.io/DRAm7YbUBydzFje6vj7qg15jL2kH3zXc5AMZH5alwx2mR_sf5-CS_Ys26o6yGOsyBPXXGWg0WmNWHjA4cyywhw.jpeg",
    category: "snacks",
    isVeg: true,
    season: "spring",
    startDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 25 * 24 * 60 * 60 * 1000,
    isLimitedTime: true,
    specialBadge: "NEW",
    theme: SEASONAL_THEMES.spring,
  },

  // Summer Items
  {
    id: "summer-ice-kulfi",
    seasonalId: "summer-2024-1",
    name: "Traditional Kulfi Ice Cream",
    description: "Creamy traditional kulfi with pistachios and cardamom",
    price: 40,
    image: "/placeholder.svg?height=300&width=300",
    category: "desserts",
    isVeg: true,
    season: "summer",
    startDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // Starts in 30 days
    endDate: Date.now() + 90 * 24 * 60 * 60 * 1000, // Ends in 90 days
    isLimitedTime: true,
    specialBadge: "COMING SOON",
    theme: SEASONAL_THEMES.summer,
  },
  {
    id: "summer-watermelon-juice",
    seasonalId: "summer-2024-2",
    name: "Fresh Watermelon Juice",
    description: "Refreshing watermelon juice with mint and lime",
    price: 35,
    image: "/placeholder.svg?height=300&width=300",
    category: "beverages",
    isVeg: true,
    season: "summer",
    startDate: Date.now() + 25 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 85 * 24 * 60 * 60 * 1000,
    isLimitedTime: true,
    specialBadge: "SUMMER SPECIAL",
    theme: SEASONAL_THEMES.summer,
  },

  // Fall Items
  {
    id: "fall-pumpkin-soup",
    seasonalId: "fall-2024-1",
    name: "Spiced Pumpkin Soup",
    description: "Creamy pumpkin soup with warming spices and herbs",
    price: 60,
    image: "/placeholder.svg?height=300&width=300",
    category: "main-course",
    isVeg: true,
    season: "fall",
    startDate: Date.now() + 60 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 120 * 24 * 60 * 60 * 1000,
    isLimitedTime: true,
    specialBadge: "FALL SPECIAL",
    theme: SEASONAL_THEMES.fall,
  },

  // Winter Items
  {
    id: "winter-hot-chocolate",
    seasonalId: "winter-2024-1",
    name: "Premium Hot Chocolate",
    description: "Rich hot chocolate with marshmallows and whipped cream",
    price: 50,
    image: "/placeholder.svg?height=300&width=300",
    category: "beverages",
    isVeg: true,
    season: "winter",
    startDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 150 * 24 * 60 * 60 * 1000,
    isLimitedTime: true,
    specialBadge: "WINTER SPECIAL",
    theme: SEASONAL_THEMES.winter,
  },

  // Special Limited Edition
  {
    id: "special-fusion-burger",
    seasonalId: "special-2024-1",
    name: "Fusion Masala Burger",
    description: "Limited edition burger with Indian spices and chutneys",
    price: 85,
    originalPrice: 95,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf4miXrTod6ywzs84_LANNd_tsnwQ9mikngA&s",
    category: "main-course",
    isVeg: false,
    season: "special",
    startDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 5 * 24 * 60 * 60 * 1000, // Only 5 days left!
    isLimitedTime: true,
    specialBadge: "LIMITED EDITION",
    availableQuantity: 25,
    theme: SEASONAL_THEMES.special,
  },
]

// Sample promotions
const SEASONAL_PROMOTIONS: SeasonalPromotion[] = [
  {
    id: "spring-fresh-2024",
    title: "Spring Fresh Collection",
    description: "Celebrate spring with our fresh, seasonal menu items",
    startDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 23 * 24 * 60 * 60 * 1000,
    items: SEASONAL_ITEMS.filter((item) => item.season === "spring"),
    discountPercentage: 15,
  },
  {
    id: "limited-fusion-2024",
    title: "Limited Edition Fusion",
    description: "Exclusive fusion items available for a limited time only",
    startDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 5 * 24 * 60 * 60 * 1000,
    items: SEASONAL_ITEMS.filter((item) => item.season === "special"),
    discountPercentage: 10,
  },
]

class SeasonalService {
  private seasonalItems: SeasonalItem[] = SEASONAL_ITEMS
  private promotions: SeasonalPromotion[] = SEASONAL_PROMOTIONS

  // Get currently available seasonal items
  getCurrentSeasonalItems(): SeasonalItem[] {
    const now = Date.now()
    return this.seasonalItems.filter((item) => now >= item.startDate && now <= item.endDate)
  }

  // Get upcoming seasonal items
  getUpcomingSeasonalItems(): SeasonalItem[] {
    const now = Date.now()
    return this.seasonalItems.filter((item) => now < item.startDate)
  }

  // Get expired seasonal items
  getExpiredSeasonalItems(): SeasonalItem[] {
    const now = Date.now()
    return this.seasonalItems.filter((item) => now > item.endDate)
  }

  // Get items by season
  getItemsBySeason(season: SeasonalItem["season"]): SeasonalItem[] {
    return this.seasonalItems.filter((item) => item.season === season)
  }

  // Get current promotions
  getCurrentPromotions(): SeasonalPromotion[] {
    const now = Date.now()
    return this.promotions.filter((promo) => now >= promo.startDate && now <= promo.endDate)
  }

  // Get time remaining for an item
  getTimeRemaining(item: SeasonalItem): {
    days: number
    hours: number
    minutes: number
    seconds: number
    isExpired: boolean
    isComingSoon: boolean
  } {
    const now = Date.now()

    if (now < item.startDate) {
      // Coming soon
      const diff = item.startDate - now
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
        isComingSoon: true,
      }
    } else if (now > item.endDate) {
      // Expired
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        isComingSoon: false,
      }
    } else {
      // Currently available
      const diff = item.endDate - now
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
        isComingSoon: false,
      }
    }
  }

  // Get current season based on date
  getCurrentSeason(): SeasonalItem["season"] {
    const month = new Date().getMonth() + 1 // 1-12

    if (month >= 3 && month <= 5) return "spring"
    if (month >= 6 && month <= 8) return "summer"
    if (month >= 9 && month <= 11) return "fall"
    return "winter"
  }

  // Check if item is available for purchase
  isItemAvailable(item: SeasonalItem): boolean {
    const now = Date.now()
    const isInTimeRange = now >= item.startDate && now <= item.endDate
    const hasQuantity = !item.availableQuantity || item.availableQuantity > 0

    return isInTimeRange && hasQuantity
  }

  // Purchase seasonal item (reduce quantity)
  purchaseSeasonalItem(itemId: string, quantity = 1): boolean {
    const item = this.seasonalItems.find((item) => item.id === itemId)

    if (!item || !this.isItemAvailable(item)) {
      return false
    }

    if (item.availableQuantity) {
      if (item.availableQuantity >= quantity) {
        item.availableQuantity -= quantity
        return true
      }
      return false
    }

    return true
  }

  // Get seasonal item by ID
  getSeasonalItem(itemId: string): SeasonalItem | undefined {
    return this.seasonalItems.find((item) => item.id === itemId)
  }

  // Add new seasonal item (for admin functionality)
  addSeasonalItem(item: SeasonalItem): void {
    this.seasonalItems.push(item)
  }

  // Remove seasonal item
  removeSeasonalItem(itemId: string): void {
    this.seasonalItems = this.seasonalItems.filter((item) => item.id !== itemId)
  }

  // Get featured seasonal items (currently available and ending soon)
  getFeaturedSeasonalItems(): SeasonalItem[] {
    const current = this.getCurrentSeasonalItems()
    const now = Date.now()
    const threeDaysFromNow = now + 3 * 24 * 60 * 60 * 1000

    // Items ending within 3 days
    const endingSoon = current.filter((item) => item.endDate <= threeDaysFromNow)

    // New items (started within last 7 days)
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
    const newItems = current.filter((item) => item.startDate >= sevenDaysAgo)

    // Combine and remove duplicates
    const featured = [...endingSoon, ...newItems]
    return featured.filter((item, index, self) => self.findIndex((i) => i.id === item.id) === index)
  }
}

// Export singleton instance
export const seasonalService = new SeasonalService()
