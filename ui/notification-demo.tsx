"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { seasonalNotificationManager } from "@/lib/seasonal-notification-manager"
import { seasonalService } from "@/lib/seasonal-service"
import { notificationService } from "@/lib/notification-service"
import { Bell, Zap, Clock, Gift, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NotificationDemo() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDemo = async (type: string, action: () => Promise<void>) => {
    setIsLoading(type)
    try {
      await action()
      toast({
        title: "Demo Notification Sent",
        description: "Check for the notification!",
      })
    } catch (error) {
      toast({
        title: "Demo Failed",
        description: "Could not send demo notification.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const demoNewItem = async () => {
    const currentItems = seasonalService.getCurrentSeasonalItems()
    if (currentItems.length > 0) {
      await seasonalNotificationManager.triggerNewItemNotification(currentItems[0].id)
    }
  }

  const demoEndingItem = async () => {
    const currentItems = seasonalService.getCurrentSeasonalItems()
    if (currentItems.length > 0) {
      await seasonalNotificationManager.triggerEndingItemNotification(currentItems[0].id)
    }
  }

  const demoPromotion = async () => {
    await notificationService.notifyPromotion("Flash Sale", "Limited time offer on all seasonal items", 25)
  }

  const resetNotifications = () => {
    seasonalNotificationManager.resetNotificationState()
    toast({
      title: "Notifications Reset",
      description: "All notification states have been cleared.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Demo
        </CardTitle>
        <CardDescription>Test different types of push notifications for seasonal items.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Button
            variant="outline"
            onClick={() => handleDemo("new", demoNewItem)}
            disabled={isLoading === "new"}
            className="flex items-center gap-2 justify-start"
          >
            <Zap className="h-4 w-4 text-green-500" />
            {isLoading === "new" ? "Sending..." : "Demo New Item Notification"}
            <Badge variant="secondary" className="ml-auto bg-green-600/20 text-green-300">
              NEW
            </Badge>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleDemo("ending", demoEndingItem)}
            disabled={isLoading === "ending"}
            className="flex items-center gap-2 justify-start"
          >
            <Clock className="h-4 w-4 text-orange-500" />
            {isLoading === "ending" ? "Sending..." : "Demo Ending Soon Notification"}
            <Badge variant="secondary" className="ml-auto bg-orange-600/20 text-orange-300">
              URGENT
            </Badge>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleDemo("promo", demoPromotion)}
            disabled={isLoading === "promo"}
            className="flex items-center gap-2 justify-start"
          >
            <Gift className="h-4 w-4 text-purple-500" />
            {isLoading === "promo" ? "Sending..." : "Demo Promotion Notification"}
            <Badge variant="secondary" className="ml-auto bg-purple-600/20 text-purple-300">
              SALE
            </Badge>
          </Button>
        </div>

        <div className="pt-4 border-t">
          <Button variant="ghost" onClick={resetNotifications} className="w-full flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Notification State
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This will clear all notification history and allow re-sending of notifications.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
