"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CategoryTabs } from "@/components/category-tabs"
import { SearchFilter } from "@/components/search-filter"
import { FoodItemCard } from "@/components/food-item-card"
import { FoodRecommendations } from "@/components/food-recommendations"
import { SeasonalSpecials } from "@/components/seasonal-specials"
import { PreferenceQuiz } from "@/components/preference-quiz"
import { foodItems, type FoodItem } from "@/lib/data"
import { Sparkles, ChefHat, Brain, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAuthStore } from "@/lib/auth-store"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<{ isVeg: boolean | null; priceRange: [number, number] | null }>({
    isVeg: null,
    priceRange: null,
  })
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showPreferenceQuiz, setShowPreferenceQuiz] = useState(false)
  const [showQuizPrompt, setShowQuizPrompt] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Show quiz prompt for authenticated users without preferences
    if (isAuthenticated && user && (!user.preferences?.tags || user.preferences.tags.length === 0)) {
      // Wait a bit before showing the prompt
      const timer = setTimeout(() => {
        setShowQuizPrompt(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (searchQuery || filters.isVeg !== null || filters.priceRange !== null) {
      const filtered = foodItems.filter((item) => {
        // Search query filter
        const matchesSearch = searchQuery
          ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true

        // Veg filter
        const matchesVeg = filters.isVeg !== null ? item.isVeg === filters.isVeg : true

        // Price range filter
        const matchesPrice = filters.priceRange
          ? item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
          : true

        return matchesSearch && matchesVeg && matchesPrice
      })

      setFilteredItems(filtered)
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }, [searchQuery, filters])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: { isVeg: boolean | null; priceRange: [number, number] | null }) => {
    setFilters(newFilters)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setFilters({ isVeg: null, priceRange: null })
    setIsSearching(false)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8 relative z-10">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-6 animate-elegant-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <ChefHat className="h-12 w-12 text-indigo-400 animate-float" />
              <div className="absolute inset-0 h-12 w-12 bg-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h1 className="text-6xl font-audiowide gradient-text">Cantollege</h1>
            <div className="relative">
              <Sparkles className="h-12 w-12 text-violet-400 animate-float" style={{ animationDelay: "2s" }} />
              <div
                className="absolute inset-0 h-12 w-12 bg-violet-400/20 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience culinary excellence at your college canteen. Fresh ingredients, bold flavors, and unforgettable
            meals await you.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live order tracking</span>
            <span>•</span>
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span>Fresh daily</span>
            <span>•</span>
            <div className="h-2 w-2 bg-violet-500 rounded-full animate-pulse"></div>
            <span>Quick delivery</span>
            <span>•</span>
            <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>Seasonal specials</span>
          </div>

          {isAuthenticated && (
            <div className="flex justify-center">
              <Button onClick={() => setShowPreferenceQuiz(true)} className="btn-elegant-primary gap-2">
                <Brain className="h-4 w-4" />
                Customize Your Recommendations
              </Button>
            </div>
          )}
        </div>

        {/* Seasonal Specials Section */}
        <div id="seasonal-specials" className="mb-16">
          <SeasonalSpecials />
        </div>

        {/* AI Recommendations Section */}
        <div className="mb-16">
          <FoodRecommendations />
        </div>

        {/* Search and Filter */}
        <div className="mb-8 animate-elegant-fade-in" style={{ animationDelay: "0.2s" }}>
          <SearchFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />
        </div>

        {/* Content */}
        <div className="animate-elegant-fade-in" style={{ animationDelay: "0.4s" }}>
          {isSearching ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-audiowide gradient-text">
                  {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"} found
                </h2>
                <button
                  onClick={clearSearch}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-300 hover:underline"
                >
                  Clear search
                </button>
              </div>

              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-elegant-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <FoodItemCard item={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="relative mb-6">
                    <ChefHat className="h-24 w-24 text-muted-foreground/50 mx-auto" />
                    <div className="absolute inset-0 h-24 w-24 bg-muted-foreground/10 rounded-full blur-xl mx-auto"></div>
                  </div>
                  <h3 className="text-2xl font-medium mb-3">No items found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                  <button onClick={clearSearch} className="btn-elegant-primary">
                    Browse All Items
                  </button>
                </div>
              )}
            </div>
          ) : (
            <CategoryTabs />
          )}
        </div>
      </main>

      {/* Preference Quiz Dialog */}
      <Dialog open={showPreferenceQuiz} onOpenChange={setShowPreferenceQuiz}>
        <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none">
          <PreferenceQuiz onClose={() => setShowPreferenceQuiz(false)} />
        </DialogContent>
      </Dialog>

      {/* Quiz Prompt */}
      {showQuizPrompt && (
        <div className="fixed bottom-6 right-6 max-w-sm animate-elegant-fade-in z-50">
          <Card className="glass-elegant shadow-glow p-4 border border-indigo-500/30">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Brain className="h-10 w-10 text-indigo-400" />
                <div className="absolute inset-0 h-10 w-10 bg-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-lg mb-2">Personalize Your Experience</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Take a quick quiz to help us recommend food you'll love!
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowQuizPrompt(false)} className="text-sm">
                    Later
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPreferenceQuiz(true)
                      setShowQuizPrompt(false)
                    }}
                    className="btn-elegant-primary text-sm"
                  >
                    Take Quiz
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQuizPrompt(false)}
                className="h-6 w-6 rounded-full -mt-1 -mr-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
