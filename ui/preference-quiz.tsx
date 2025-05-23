"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/lib/auth-store"
import { useRecommendations } from "@/hooks/use-recommendations"
import { categories } from "@/lib/data"
import { Sparkles, X, Brain, Flame, Leaf } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface PreferenceQuizProps {
  onClose: () => void
}

export function PreferenceQuiz({ onClose }: PreferenceQuizProps) {
  const [step, setStep] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
  const [spiceLevel, setSpiceLevel] = useState<"mild" | "medium" | "hot">("medium")
  const [flavorTags, setFlavorTags] = useState<string[]>([])

  const { user, updatePreferences } = useAuthStore()
  const { updateUserTags } = useRecommendations()
  const { toast } = useToast()

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleDietaryToggle = (restriction: string) => {
    setDietaryRestrictions((prev) =>
      prev.includes(restriction) ? prev.filter((r) => r !== restriction) : [...prev, restriction],
    )
  }

  const handleFlavorToggle = (tag: string) => {
    setFlavorTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!user) return

    try {
      // Update user preferences
      await updatePreferences({
        favoriteCategories: selectedCategories,
        dietaryRestrictions,
        spiceLevel,
        tags: flavorTags,
      })

      // Update recommendation tags
      updateUserTags(flavorTags)

      toast({
        title: "Preferences updated!",
        description: "Your recommendations will now be more personalized.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error updating preferences",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto glass-elegant animate-elegant-fade-in">
      <CardHeader className="relative">
        <div className="absolute right-4 top-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-elegant-700/50">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-indigo-400" />
          <CardTitle className="text-2xl font-audiowide gradient-text">Taste Preferences</CardTitle>
          <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
        </div>
        <CardDescription>Help us understand your food preferences to provide better recommendations</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-elegant-fade-in">
            <div>
              <h3 className="text-lg font-medium mb-3">What types of food do you enjoy?</h3>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      selectedCategories.includes(category.id)
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-elegant-700/30 hover:border-indigo-500/50 bg-elegant-800/30"
                    }`}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                      <div>
                        <Label className="font-medium">{category.name}</Label>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-elegant-fade-in">
            <div>
              <h3 className="text-lg font-medium mb-3">Any dietary preferences?</h3>
              <div className="space-y-3">
                {["Vegetarian", "Non-vegetarian", "Vegan", "Gluten-free", "Dairy-free"].map((restriction) => (
                  <div
                    key={restriction}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      dietaryRestrictions.includes(restriction)
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-elegant-700/30 hover:border-indigo-500/50 bg-elegant-800/30"
                    }`}
                    onClick={() => handleDietaryToggle(restriction)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={dietaryRestrictions.includes(restriction)}
                        onCheckedChange={() => handleDietaryToggle(restriction)}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                      <div className="flex items-center gap-2">
                        {restriction === "Vegetarian" && <Leaf className="h-4 w-4 text-green-500" />}
                        <Label className="font-medium">{restriction}</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">How spicy do you like your food?</h3>
              <RadioGroup value={spiceLevel} onValueChange={(value: "mild" | "medium" | "hot") => setSpiceLevel(value)}>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      spiceLevel === "mild"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-elegant-700/30 hover:border-indigo-500/50 bg-elegant-800/30"
                    }`}
                    onClick={() => setSpiceLevel("mild")}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <RadioGroupItem value="mild" id="mild" className="sr-only" />
                      <Flame className="h-6 w-6 text-blue-400" />
                      <Label htmlFor="mild" className="font-medium">
                        Mild
                      </Label>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      spiceLevel === "medium"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-elegant-700/30 hover:border-indigo-500/50 bg-elegant-800/30"
                    }`}
                    onClick={() => setSpiceLevel("medium")}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <RadioGroupItem value="medium" id="medium" className="sr-only" />
                      <Flame className="h-6 w-6 text-yellow-500" />
                      <Label htmlFor="medium" className="font-medium">
                        Medium
                      </Label>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      spiceLevel === "hot"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-elegant-700/30 hover:border-indigo-500/50 bg-elegant-800/30"
                    }`}
                    onClick={() => setSpiceLevel("hot")}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <RadioGroupItem value="hot" id="hot" className="sr-only" />
                      <Flame className="h-6 w-6 text-red-500" />
                      <Label htmlFor="hot" className="font-medium">
                        Hot
                      </Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-elegant-fade-in">
            <div>
              <h3 className="text-lg font-medium mb-3">What flavors do you enjoy?</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  "Spicy",
                  "Sweet",
                  "Sour",
                  "Savory",
                  "Crispy",
                  "Creamy",
                  "Cheesy",
                  "Tangy",
                  "Smoky",
                  "Grilled",
                  "Fried",
                  "Baked",
                ].map((flavor) => (
                  <div
                    key={flavor}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      flavorTags.includes(flavor)
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-elegant-700/30 hover:border-indigo-500/50 bg-elegant-800/30"
                    }`}
                    onClick={() => handleFlavorToggle(flavor)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={flavorTags.includes(flavor)}
                        onCheckedChange={() => handleFlavorToggle(flavor)}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                      <Label className="font-medium">{flavor}</Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handleBack} className="btn-elegant-secondary">
            Back
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose} className="btn-elegant-secondary">
            Skip
          </Button>
        )}

        {step < 3 ? (
          <Button onClick={handleNext} className="btn-elegant-primary">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="btn-elegant-primary">
            Save Preferences
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
