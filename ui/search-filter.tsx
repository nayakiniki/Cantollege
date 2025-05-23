"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: { isVeg: boolean | null; priceRange: [number, number] | null }) => void
}

export function SearchFilter({ onSearch, onFilterChange }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isVegOnly, setIsVegOnly] = useState<boolean | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleVegFilter = (checked: boolean) => {
    const newIsVegOnly = checked ? true : null
    setIsVegOnly(newIsVegOnly)
    onFilterChange({ isVeg: newIsVegOnly, priceRange })
  }

  const handlePriceFilter = (min: number, max: number, checked: boolean) => {
    const newPriceRange = checked ? ([min, max] as [number, number]) : null
    setPriceRange(newPriceRange)
    onFilterChange({ isVeg: isVegOnly, priceRange: newPriceRange })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <form onSubmit={handleSearch} className="relative flex-1">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for delicious food..."
            className="pl-12 pr-4 py-3 bg-elegant-800/30 border-elegant-700/30 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20 backdrop-blur-sm text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-glow" />
          </div>
        </div>
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 px-6 py-3 bg-elegant-800/30 border-elegant-700/30 rounded-xl hover:bg-elegant-700/50 backdrop-blur-sm"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(isVegOnly || priceRange) && <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass-elegant">
          <DropdownMenuLabel className="gradient-text font-medium">Dietary Preferences</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={isVegOnly === true}
            onCheckedChange={handleVegFilter}
            className="hover:bg-elegant-800/50 focus:bg-elegant-800/50"
          >
            Vegetarian Only
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator className="bg-elegant-700/50" />

          <DropdownMenuLabel className="gradient-text font-medium">Price Range</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={priceRange?.[0] === 0 && priceRange?.[1] === 50}
            onCheckedChange={(checked) => handlePriceFilter(0, 50, checked)}
            className="hover:bg-elegant-800/50 focus:bg-elegant-800/50"
          >
            Under ₹50
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={priceRange?.[0] === 50 && priceRange?.[1] === 100}
            onCheckedChange={(checked) => handlePriceFilter(50, 100, checked)}
            className="hover:bg-elegant-800/50 focus:bg-elegant-800/50"
          >
            ₹50 - ₹100
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={priceRange?.[0] === 100 && priceRange?.[1] === 1000}
            onCheckedChange={(checked) => handlePriceFilter(100, 1000, checked)}
            className="hover:bg-elegant-800/50 focus:bg-elegant-800/50"
          >
            Above ₹100
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
