"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-notifications"
import { Bell, BellOff, Settings, TestTube } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const {
    isSupported,
    permission,
    isSubscribed,
    preferences,
    isLoading,
    requestPermission,
    subscribe,
    unsubscribe,
    updatePreferences,
    sendTestNotification,
  } = useNotifications()
  const { toast } = useToast()
  const [testLoading, setTestLoading] = useState(false)

  const handleEnableNotifications = async () => {
    if (permission === "denied") {
      toast({
        title: "Notifications Blocked",
        description: "Please enable notifications in your browser settings and refresh the page.",
        variant: "destructive",
      })
      return
    }

    if (permission === "default") {
      const granted = await requestPermission()
      if (!granted) {
        toast({
          title: "Permission Denied",
          description: "Notifications permission was denied. You can enable it later in settings.",
          variant: "destructive",
        })
        return
      }
    }

    const success = await subscribe()
    if (success) {
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive push notifications for new seasonal items and promotions!",
      })
    } else {
      toast({
        title: "Failed to Enable",
        description: "Could not enable push notifications. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDisableNotifications = async () => {
    const success = await unsubscribe()
    if (success) {
      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive push notifications.",
      })
    }
  }

  const handleTestNotification = async () => {
    setTestLoading(true)
    try {
      await sendTestNotification()
      toast({
        title: "Test Sent",
        description: "Check for the test notification!",
      })
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not send test notification.",
        variant: "destructive",
      })
    } finally {
      setTestLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>Your browser doesn't support push notifications.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>Manage your notification preferences for seasonal items and promotions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Push Notification Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications directly to your device</p>
          </div>
          <div className="flex items-center gap-2">
            {permission === "granted" && isSubscribed && (
              <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                Enabled
              </Badge>
            )}
            {permission === "denied" && <Badge variant="destructive">Blocked</Badge>}
            {permission === "default" && <Badge variant="outline">Not Set</Badge>}
          </div>
        </div>

        {/* Enable/Disable Push Notifications */}
        {!isSubscribed ? (
          <Button onClick={handleEnableNotifications} disabled={isLoading} className="w-full">
            {isLoading ? "Enabling..." : "Enable Push Notifications"}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDisableNotifications} disabled={isLoading} className="flex-1">
              {isLoading ? "Disabling..." : "Disable Notifications"}
            </Button>
            <Button
              variant="outline"
              onClick={handleTestNotification}
              disabled={testLoading}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {testLoading ? "Sending..." : "Test"}
            </Button>
          </div>
        )}

        {/* Notification Preferences */}
        {isSubscribed && (
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Notification Types
            </Label>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="new-items">New Seasonal Items</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new seasonal specials are available</p>
                </div>
                <Switch
                  id="new-items"
                  checked={preferences.newSeasonalItems}
                  onCheckedChange={(checked) => updatePreferences({ newSeasonalItems: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="ending-items">Items Ending Soon</Label>
                  <p className="text-sm text-muted-foreground">Last chance alerts for limited-time items</p>
                </div>
                <Switch
                  id="ending-items"
                  checked={preferences.endingItems}
                  onCheckedChange={(checked) => updatePreferences({ endingItems: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="promotions">Promotions & Deals</Label>
                  <p className="text-sm text-muted-foreground">Special offers and discount notifications</p>
                </div>
                <Switch
                  id="promotions"
                  checked={preferences.promotions}
                  onCheckedChange={(checked) => updatePreferences({ promotions: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="order-updates">Order Updates</Label>
                  <p className="text-sm text-muted-foreground">Status updates for your orders</p>
                </div>
                <Switch
                  id="order-updates"
                  checked={preferences.orderUpdates}
                  onCheckedChange={(checked) => updatePreferences({ orderUpdates: checked })}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
