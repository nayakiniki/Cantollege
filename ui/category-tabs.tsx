"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FoodItemCard } from "@/components/food-item-card"
import { categories, foodItems } from "@/lib/data"

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id)

  return (
    <Tabs defaultValue={categories[0].id} onValueChange={setActiveCategory} className="w-full">
      <div className="sticky top-20 z-10 nav-elegant py-6 border-b border-elegant-700/30 mb-8">
        <TabsList className="w-full h-auto flex overflow-x-auto justify-start p-2 gap-3 bg-elegant-800/30 backdrop-blur-xl border border-elegant-700/30 rounded-2xl">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-glow hover:bg-elegant-700/50"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="pt-0">
          <div className="mb-8 animate-elegant-fade-in">
            <h2 className="text-4xl font-audiowide gradient-text mb-3">{category.name}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{category.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {foodItems
              .filter((item) => item.category === category.id)
              .map((item, index) => (
                <div key={item.id} className="animate-elegant-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <FoodItemCard item={item} />
                </div>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
