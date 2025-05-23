"use client"

import { ShoppingCart, Menu, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    setMounted(true)
    setTotalItems(getTotalItems())

    // Subscribe to cart changes
    const unsubscribe = useCartStore.subscribe(
      (state) => state.cart,
      () => setTotalItems(getTotalItems()),
    )

    return () => unsubscribe()
  }, [getTotalItems])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-indigo-400 animate-glow" />
            <div className="absolute inset-0 h-8 w-8 bg-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <span className="font-audiowide text-3xl text-indigo-400">Cantollege</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-8">
            <Link href="/" className="text-sm font-medium text-gray-200 hover:text-indigo-400">
              Menu
            </Link>
            <Link href="/my-orders" className="text-sm font-medium text-gray-200 hover:text-indigo-400">
              My Orders
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button
                variant="outline"
                size="icon"
                className="relative elegant-card-hover border-elegant-700/50 bg-elegant-800/30 backdrop-blur-sm"
              >
                <ShoppingCart className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-xs font-bold shadow-glow animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart">
            <Button
              variant="outline"
              size="icon"
              className="relative elegant-card-hover border border-elegant-700/50 bg-elegant-800/30 backdrop-blur-sm"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-xs font-bold shadow-glow animate-pulse">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="elegant-card-hover border border-elegant-700/50 bg-elegant-800/30 backdrop-blur-sm"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-20 z-50 w-full bg-gray-900 border-b border-gray-800 transition-transform duration-500",
          isMenuOpen ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <nav className="container py-6 flex flex-col gap-6">
          <Link
            href="/"
            className="text-lg font-medium text-gray-200 hover:text-indigo-400"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </Link>
          <Link
            href="/my-orders"
            className="text-lg font-medium text-gray-200 hover:text-indigo-400"
            onClick={() => setIsMenuOpen(false)}
          >
            My Orders
          </Link>
        </nav>
      </div>
    </header>
  )
}
