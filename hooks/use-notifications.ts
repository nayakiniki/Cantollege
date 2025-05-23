"use client"

import { useState, useEffect } from "react"
import { notificationService, type NotificationPreferences } from "@/lib/notification-service"

export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushEnabled: false,
    emailEnabled: false,
    newSeasonalItems: true,
    endingItems: true,
    promotions: true,
    orderUpdates: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initializeNotifications = async () => {
      const supported = notificationService.isSupported()
      setIsSupported(supported)

      if (supported) {
        setPermission(notificationService.getPermissionStatus())

        // Initialize service worker
        await notificationService.initialize()

        // Check subscription status
        const subscribed = await notificationService.isSubscribed()
        setIsSubscribed(subscribed)

        // Load preferences
        const savedPreferences = notificationService.getNotificationPreferences()
        setPreferences(savedPreferences)
      }
    }

    initializeNotifications()
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const granted = await notificationService.requestPermission()
      setPermission(notificationService.getPermissionStatus())
      return granted
    } finally {
      setIsLoading(false)
    }
  }

  const subscribe = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const subscription = await notificationService.subscribeToPush()
      const subscribed = !!subscription
      setIsSubscribed(subscribed)

      if (subscribed) {
        const newPreferences = { ...preferences, pushEnabled: true }
        setPreferences(newPreferences)
        notificationService.saveNotificationPreferences(newPreferences)
      }

      return subscribed
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const success = await notificationService.unsubscribeFromPush()
      if (success) {
        setIsSubscribed(false)
        const newPreferences = { ...preferences, pushEnabled: false }
        setPreferences(newPreferences)
        notificationService.saveNotificationPreferences(newPreferences)
      }
      return success
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPreferences }
    setPreferences(updated)
    notificationService.saveNotificationPreferences(updated)
  }

  const sendTestNotification = async () => {
    await notificationService.sendLocalNotification({
      title: "Test Notification",
      body: "This is a test notification from Cantollege!",
      data: { url: "/" },
    })
  }

  return {
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
  }
}
