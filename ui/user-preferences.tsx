"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PreferenceQuiz } from "@/components/preference-quiz"
import { useAuthStore } from "@/lib/auth-store"
import { Brain, Sparkles, Flame, Leaf, Settings } from "lucide-react"

export function UserPreferences() {
  const [showPreferenceQuiz, setShowPreferenceQuiz] = useState(false)
  const { user } = useAuthStore()

  if (!user) return null

  const preferences = user.preferences || {
    favoriteCategories: [],
    dietaryRestrictions: [],
    spiceLevel: "medium",
    tags: [],
  }

  const getSpiceLevelIcon = () => {
    switch (preferences.spiceLevel) {
      case "mild":
        return <Flame className="h-4 w-4 text-blue-400" />
      case "medium":
        return <Flame className="h-4 w-4 text-yellow-500" />
      case "hot":
        return <Flame className="h-4 w-4 text-red-500" />
      default:
        return <Flame className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <>
      <Card className="w-full glass-elegant animate-elegant-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-indigo-400" />
              <CardTitle className="text-2xl font-audiowide gradient-text">Taste Preferences</CardTitle>
              <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowPreferenceQuiz(true)}
              className="rounded-full hover:bg-elegant-700/50"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Your preferences help us recommend food you'll love</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Dietary Preferences */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Dietary Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {preferences.dietaryRestrictions && preferences.dietaryRestrictions.length > 0 ? (
                preferences.dietaryRestrictions.map((restriction) => (
                  <Badge key={restriction} className="badge-elegant badge-elegant-primary">
                    {restriction === "Vegetarian" && <Leaf className="h-3 w-3 mr-1" />}
                    {restriction}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No dietary preferences set</p>
              )}
            </div>
          </div>

          {/* Spice Level */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Spice Preference</h3>
            <Badge className="badge-elegant flex items-center gap-1">
              {getSpiceLevelIcon()}
              <span className="capitalize">{preferences.spiceLevel || "Medium"}</span>
            </Badge>
          </div>

          {/* Flavor Tags */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Flavor Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {preferences.tags && preferences.tags.length > 0 ? (
                preferences.tags.map((tag) => (
                  <Badge key={tag} className="badge-elegant badge-elegant-primary">
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No flavor preferences set</p>
              )}
            </div>
          </div>

          {/* Favorite Categories */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Favorite Categories</h3>
            <div className="flex flex-wrap gap-2">
              {preferences.favoriteCategories && preferences.favoriteCategories.length > 0 ? (
                preferences.favoriteCategories.map((categoryId) => (
                  <Badge key={categoryId} className="badge-elegant badge-elegant-primary">
                    {categoryId === "snacks" && "Snacks"}
                    {categoryId === "main-course" && "Main Course"}
                    {categoryId === "beverages" && "Beverages"}
                    {categoryId === "desserts" && "Desserts"}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No favorite categories set</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={() => setShowPreferenceQuiz(true)} className="btn-elegant-primary w-full">
            Update Preferences
          </Button>
        </CardFooter>
      </Card>

      {/* Preference Quiz Dialog */}
      <Dialog open={showPreferenceQuiz} onOpenChange={setShowPreferenceQuiz}>
        <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none">
          <PreferenceQuiz onClose={() => setShowPreferenceQuiz(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
