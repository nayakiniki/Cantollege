"use client"

import { useState, useEffect } from "react"
import { useRecommendations } from "@/hooks/use-recommendations"
import { FoodItemCard } from "@/components/food-item-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/lib/auth-store"
import { Sparkles, Brain, TrendingUp, History, ThumbsUp } from "lucide-react"

export function FoodRecommendations() {
  const { recommendations, isLoading, recordItemView } = useRecommendations(4)
  const { user, isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("personalized")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setActiveTab("trending")
    }
  }, [isAuthenticated])

  if (!mounted) return null

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8 animate-elegant-fade-in">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-elegant-800/50" />
            <Skeleton className="h-4 w-48 bg-elegant-800/50" />
          </div>
          <Skeleton className="h-10 w-32 bg-elegant-800/50 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-80 bg-elegant-800/50 rounded-2xl" />
            ))}
        </div>
      </div>
    )
  }

  // No recommendations yet
  if (!recommendations) {
    return null
  }

  const { personalizedItems, trendingItems, similarToLastOrdered, categoryRecommendations } = recommendations

  // Determine which recommendations to show based on user state
  const hasPersonalized = isAuthenticated && personalizedItems.length > 0
  const hasSimilar = similarToLastOrdered.length > 0
  const showTrending = trendingItems.length > 0

  return (
    <div className="space-y-8 animate-elegant-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-indigo-400" />
            <h2 className="text-3xl font-audiowide gradient-text">AI Recommendations</h2>
            <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
          </div>
          <p className="text-muted-foreground">
            {isAuthenticated
              ? "Personalized suggestions based on your preferences and order history"
              : "Popular items you might enjoy"}
          </p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8 bg-elegant-800/30 backdrop-blur-xl border border-elegant-700/30 rounded-2xl">
          {hasPersonalized && (
            <TabsTrigger
              value="personalized"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600 rounded-xl"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              For You
            </TabsTrigger>
          )}

          {showTrending && (
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600 rounded-xl"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
          )}

          {hasSimilar && (
            <TabsTrigger
              value="similar"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600 rounded-xl"
            >
              <History className="h-4 w-4 mr-2" />
              Similar
            </TabsTrigger>
          )}
        </TabsList>

        {hasPersonalized && (
          <TabsContent value="personalized" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {personalizedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-elegant-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => recordItemView(item.id)}
                >
                  <FoodItemCard item={item} />
                </div>
              ))}
            </div>
          </TabsContent>
        )}

        {showTrending && (
          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-elegant-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => recordItemView(item.id)}
                >
                  <FoodItemCard item={item} />
                </div>
              ))}
            </div>
          </TabsContent>
        )}

        {hasSimilar && (
          <TabsContent value="similar" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarToLastOrdered.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-elegant-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => recordItemView(item.id)}
                >
                  <FoodItemCard item={item} />
                </div>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {categoryRecommendations.length > 0 && isAuthenticated && (
        <div className="space-y-8 mt-12">
          {categoryRecommendations.slice(0, 2).map(
            ({ category, items }) =>
              items.length > 0 && (
                <div key={category.id} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-audiowide gradient-text">Because you like {category.name}</h3>
                    <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.slice(0, 4).map((item, index) => (
                      <div
                        key={item.id}
                        className="animate-elegant-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => recordItemView(item.id)}
                      >
                        <FoodItemCard item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  )
}
