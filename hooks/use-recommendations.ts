"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useOrderStore } from "@/lib/store"
import { recommendationService, type RecommendationResult } from "@/lib/recommendation-service"

export function useRecommendations(limit = 5) {
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuthStore()
  const { getUserOrders } = useOrderStore()

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)

      if (isAuthenticated && user) {
        // Get user orders
        const userOrders = getUserOrders(user.id)

        // Update user preferences based on orders
        recommendationService.updateUserPreferences(user.id, userOrders, [], user)

        // Get recommendations
        const recs = recommendationService.getRecommendations(user.id, limit)
        setRecommendations(recs)
      } else {
        // Get default recommendations for non-authenticated users
        const recs = recommendationService.getRecommendations("guest", limit)
        setRecommendations(recs)
      }

      setIsLoading(false)
    }

    fetchRecommendations()
  }, [isAuthenticated, user, getUserOrders, limit])

  // Function to record item view
  const recordItemView = (itemId: string) => {
    if (isAuthenticated && user) {
      recommendationService.recordItemView(user.id, itemId)
    }
  }

  // Function to update user tags
  const updateUserTags = (tags: string[]) => {
    if (isAuthenticated && user) {
      recommendationService.updateUserTags(user.id, tags)

      // Also update in auth store
      if (user.preferences) {
        const updatedTags = [...new Set([...(user.preferences.tags || []), ...tags])]
        useAuthStore.getState().updatePreferences({
          ...user.preferences,
          tags: updatedTags,
        })
      }
    }
  }

  return {
    recommendations,
    isLoading,
    recordItemView,
    updateUserTags,
  }
}
