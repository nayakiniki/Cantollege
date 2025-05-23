"use client"

import { foodItems, type FoodItem, type Category, categories } from "./data"
import type { EnhancedOrder, User } from "./types"

// Types for recommendation system
export interface UserPreference {
  userId: string
  categoryPreferences: Record<string, number> // category id -> preference score
  itemPreferences: Record<string, number> // item id -> preference score
  dietaryPreference: "all" | "veg" | "non-veg"
  lastOrderedItems: string[] // item ids
  viewedItems: string[] // item ids
  tags: string[] // preference tags like "spicy", "sweet", etc.
}

export interface RecommendationResult {
  personalizedItems: FoodItem[]
  trendingItems: FoodItem[]
  similarToLastOrdered: FoodItem[]
  categoryRecommendations: {
    category: Category
    items: FoodItem[]
  }[]
}

// Recommendation weights
const WEIGHTS = {
  orderHistory: 0.5,
  categoryPreference: 0.3,
  viewHistory: 0.2,
  recency: 0.7,
}

class RecommendationService {
  private userPreferences: Map<string, UserPreference> = new Map()
  private trendingItems: FoodItem[] = []
  private itemSimilarity: Map<string, string[]> = new Map() // item id -> similar item ids

  constructor() {
    // Initialize with some trending items
    this.initializeTrendingItems()
    // Initialize item similarity matrix
    this.initializeItemSimilarity()
  }

  // Initialize trending items (would normally be calculated from all user data)
  private initializeTrendingItems() {
    // Simulate trending items with a subset of food items
    this.trendingItems = [
      foodItems.find((item) => item.id === "chicken-biryani")!,
      foodItems.find((item) => item.id === "masala-dosa")!,
      foodItems.find((item) => item.id === "cold-coffee")!,
      foodItems.find((item) => item.id === "chocolate-brownie")!,
    ].filter(Boolean)
  }

  // Initialize item similarity (would normally use collaborative filtering or content-based similarity)
  private initializeItemSimilarity() {
    // Create a simple content-based similarity matrix
    foodItems.forEach((item) => {
      // Find items in the same category
      const sameCategory = foodItems
        .filter((other) => other.id !== item.id && other.category === item.category)
        .map((other) => other.id)

      // Find items with similar dietary preference
      const sameDietary = foodItems
        .filter((other) => other.id !== item.id && other.isVeg === item.isVeg)
        .map((other) => other.id)

      // Combine and limit to top 5
      const similar = [...new Set([...sameCategory, ...sameDietary])].slice(0, 5)
      this.itemSimilarity.set(item.id, similar)
    })
  }

  // Initialize or update user preferences based on orders and behavior
  public updateUserPreferences(
    userId: string,
    orders: EnhancedOrder[],
    viewedItems: string[] = [],
    user?: User,
  ): UserPreference {
    // Get existing preferences or create new ones
    let preferences = this.userPreferences.get(userId) || {
      userId,
      categoryPreferences: {},
      itemPreferences: {},
      dietaryPreference: "all",
      lastOrderedItems: [],
      viewedItems: [],
      tags: [],
    }

    // Reset counters
    const categoryCounter: Record<string, number> = {}
    const itemCounter: Record<string, number> = {}
    const lastOrderedItems: string[] = []

    // Count dietary preferences
    let vegCount = 0
    let nonVegCount = 0

    // Process orders (with recency bias - newer orders have more weight)
    const sortedOrders = [...orders].sort((a, b) => b.timestamp - a.timestamp)

    sortedOrders.forEach((order, index) => {
      // Apply recency weight (more recent orders have more influence)
      const recencyWeight = Math.pow(WEIGHTS.recency, index)

      order.items.forEach((cartItem) => {
        const { foodItem, quantity } = cartItem

        // Update category preferences
        const category = foodItem.category
        categoryCounter[category] = (categoryCounter[category] || 0) + quantity * recencyWeight

        // Update item preferences
        itemCounter[foodItem.id] = (itemCounter[foodItem.id] || 0) + quantity * recencyWeight

        // Track dietary preference
        if (foodItem.isVeg) {
          vegCount += quantity
        } else {
          nonVegCount += quantity
        }

        // Add to last ordered items (avoid duplicates)
        if (!lastOrderedItems.includes(foodItem.id)) {
          lastOrderedItems.push(foodItem.id)
        }
      })
    })

    // Determine dietary preference
    let dietaryPreference: "all" | "veg" | "non-veg" = "all"
    if (vegCount > 0 && nonVegCount === 0) {
      dietaryPreference = "veg"
    } else if (nonVegCount > vegCount * 2) {
      dietaryPreference = "non-veg"
    }

    // Update viewed items
    const updatedViewedItems = [...new Set([...preferences.viewedItems, ...viewedItems])].slice(0, 20)

    // Extract tags from user profile if available
    const tags: string[] = []
    if (user?.preferences?.tags) {
      tags.push(...user.preferences.tags)
    }

    // Update preferences
    preferences = {
      ...preferences,
      categoryPreferences: categoryCounter,
      itemPreferences: itemCounter,
      dietaryPreference,
      lastOrderedItems: lastOrderedItems.slice(0, 10),
      viewedItems: updatedViewedItems,
      tags,
    }

    // Save updated preferences
    this.userPreferences.set(userId, preferences)

    return preferences
  }

  // Get recommendations for a user
  public getRecommendations(userId: string, limit = 5): RecommendationResult {
    const preferences = this.userPreferences.get(userId)

    // Default recommendations for new users
    if (!preferences || Object.keys(preferences.itemPreferences).length === 0) {
      return this.getDefaultRecommendations()
    }

    // Get personalized recommendations
    return this.getPersonalizedRecommendations(preferences, limit)
  }

  // Get default recommendations for new users
  private getDefaultRecommendations(): RecommendationResult {
    // For new users, return trending items and a selection from each category
    const categoryRecommendations = categories.map((category) => {
      const items = foodItems.filter((item) => item.category === category.id).slice(0, 3)

      return { category, items }
    })

    return {
      personalizedItems: this.trendingItems,
      trendingItems: this.trendingItems,
      similarToLastOrdered: [],
      categoryRecommendations,
    }
  }

  // Get personalized recommendations based on user preferences
  private getPersonalizedRecommendations(preferences: UserPreference, limit: number): RecommendationResult {
    // Calculate scores for all items
    const scores = this.calculateItemScores(preferences)

    // Sort items by score
    const sortedItems = [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => foodItems.find((item) => item.id === id)!)
      .filter(Boolean)

    // Filter by dietary preference if needed
    const filteredItems =
      preferences.dietaryPreference === "veg"
        ? sortedItems.filter((item) => item.isVeg)
        : preferences.dietaryPreference === "non-veg"
          ? sortedItems.filter((item) => !item.isVeg)
          : sortedItems

    // Get top items as personalized recommendations
    const personalizedItems = filteredItems.slice(0, limit)

    // Get similar items to last ordered
    const similarItems = this.getSimilarToLastOrdered(preferences, limit)

    // Get category recommendations
    const categoryRecommendations = this.getCategoryRecommendations(preferences)

    return {
      personalizedItems,
      trendingItems: this.trendingItems,
      similarToLastOrdered: similarItems,
      categoryRecommendations,
    }
  }

  // Calculate scores for all items based on user preferences
  private calculateItemScores(preferences: UserPreference): Map<string, number> {
    const scores = new Map<string, number>()

    // Get total weights for normalization
    const totalCategoryWeight = Object.values(preferences.categoryPreferences).reduce((sum, val) => sum + val, 0) || 1
    const totalItemWeight = Object.values(preferences.itemPreferences).reduce((sum, val) => sum + val, 0) || 1

    // Calculate scores for all items
    foodItems.forEach((item) => {
      // Skip items the user has already ordered a lot
      if (preferences.itemPreferences[item.id] > 5) {
        scores.set(item.id, 0)
        return
      }

      let score = 0

      // Category preference score
      const categoryScore = (preferences.categoryPreferences[item.category] || 0) / totalCategoryWeight
      score += categoryScore * WEIGHTS.categoryPreference

      // View history score
      if (preferences.viewedItems.includes(item.id)) {
        score += WEIGHTS.viewHistory
      }

      // Dietary preference score
      if (preferences.dietaryPreference === "veg" && item.isVeg) {
        score += 0.2
      } else if (preferences.dietaryPreference === "non-veg" && !item.isVeg) {
        score += 0.2
      }

      // Tag matching score
      if (preferences.tags.length > 0) {
        const itemTags = this.extractItemTags(item)
        const matchingTags = preferences.tags.filter((tag) => itemTags.includes(tag))
        if (matchingTags.length > 0) {
          score += 0.3 * (matchingTags.length / preferences.tags.length)
        }
      }

      scores.set(item.id, score)
    })

    return scores
  }

  // Extract tags from item name and description
  private extractItemTags(item: FoodItem): string[] {
    const tags: string[] = []
    const text = `${item.name} ${item.description}`.toLowerCase()

    // Check for common flavor profiles and ingredients
    if (text.includes("spicy") || text.includes("spiced")) tags.push("spicy")
    if (text.includes("sweet")) tags.push("sweet")
    if (text.includes("crispy")) tags.push("crispy")
    if (text.includes("creamy")) tags.push("creamy")
    if (text.includes("chocolate")) tags.push("chocolate")
    if (text.includes("cheese")) tags.push("cheese")
    if (text.includes("paneer")) tags.push("paneer")
    if (text.includes("chicken")) tags.push("chicken")

    return tags
  }

  // Get similar items to last ordered
  private getSimilarToLastOrdered(preferences: UserPreference, limit: number): FoodItem[] {
    if (preferences.lastOrderedItems.length === 0) {
      return []
    }

    // Get similar items to the last ordered items
    const similarItemIds = new Set<string>()

    // Look at the 3 most recent items
    preferences.lastOrderedItems.slice(0, 3).forEach((itemId) => {
      const similar = this.itemSimilarity.get(itemId) || []
      similar.forEach((id) => similarItemIds.add(id))
    })

    // Filter out items the user has already ordered
    const filteredSimilarIds = [...similarItemIds].filter((id) => !preferences.lastOrderedItems.includes(id))

    // Get the items and limit
    return filteredSimilarIds
      .map((id) => foodItems.find((item) => item.id === id)!)
      .filter(Boolean)
      .slice(0, limit)
  }

  // Get category recommendations
  private getCategoryRecommendations(preferences: UserPreference): { category: Category; items: FoodItem[] }[] {
    // Sort categories by preference
    const sortedCategories = categories
      .map((category) => ({
        category,
        score: preferences.categoryPreferences[category.id] || 0,
      }))
      .sort((a, b) => b.score - a.score)

    // Get top items from each category
    return sortedCategories.map(({ category }) => {
      // Get items from this category
      const categoryItems = foodItems.filter((item) => item.category === category.id)

      // Sort by preference score
      const sortedItems = categoryItems
        .map((item) => ({
          item,
          score: preferences.itemPreferences[item.id] || 0,
        }))
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item)

      // Filter out items the user orders frequently
      const filteredItems = sortedItems.filter((item) => !preferences.lastOrderedItems.slice(0, 3).includes(item.id))

      return {
        category,
        items: filteredItems.slice(0, 3),
      }
    })
  }

  // Record that a user viewed an item
  public recordItemView(userId: string, itemId: string): void {
    const preferences = this.userPreferences.get(userId)

    if (preferences) {
      // Add to viewed items if not already there
      if (!preferences.viewedItems.includes(itemId)) {
        preferences.viewedItems = [itemId, ...preferences.viewedItems].slice(0, 20)
        this.userPreferences.set(userId, preferences)
      }
    }
  }

  // Update user preference tags
  public updateUserTags(userId: string, tags: string[]): void {
    const preferences = this.userPreferences.get(userId)

    if (preferences) {
      preferences.tags = [...new Set([...preferences.tags, ...tags])]
      this.userPreferences.set(userId, preferences)
    }
  }
}

// Export singleton instance
export const recommendationService = new RecommendationService()
