"use client"

import { useState, useEffect } from "react"
import { Bell, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { seasonalService } from "@/lib/seasonal-service"

export function SeasonalNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check for new seasonal items
    const checkForNewItems = () => {
      try {
        const currentItems = seasonalService.getCurrentSeasonalItems()
        const newItems = currentItems.filter((item) => {
          const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
          return item.startDate >= sevenDaysAgo
        })

        if (newItems.length > 0) {
          const notification = {
            id: `new-items-${Date.now()}`,
            title: "New Seasonal Items Available!",
            message: `Check out ${newItems.length} new seasonal specials`,
            type: "info",
            timestamp: Date.now(),
          }

          setNotifications((prev) => [notification, ...prev.slice(0, 2)])
        }
      } catch (error) {
        console.log("Error checking seasonal items:", error)
      }
    }

    checkForNewItems()
  }, [])

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (!mounted || notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card key={notification.id} className="glass-elegant shadow-glow animate-elegant-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="relative">
                <Bell className="h-5 w-5 text-indigo-400" />
                <div className="absolute inset-0 h-5 w-5 bg-indigo-400/20 rounded-full blur-sm animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dismissNotification(notification.id)}
                className="h-6 w-6 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
