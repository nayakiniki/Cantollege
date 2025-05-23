"use client"

import type { SeasonalItem } from "./seasonal-service"

export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export interface NotificationPreferences {
  pushEnabled: boolean
  emailEnabled: boolean
  newSeasonalItems: boolean
  endingItems: boolean
  promotions: boolean
  orderUpdates: boolean
}

class NotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null
  private vapidPublicKey = "BEl62iUYgUivxIkv69yViEuiBIa40HuWukzpOqiLUxmJSDF8YAudtAGdRbhz6lnGCAUwjqODddd6_MHiNWfhgHg" // Demo key

  async initialize(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported")
      return false
    }

    try {
      // Register service worker
      this.swRegistration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered:", this.swRegistration)
      return true
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      return false
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported")
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission === "denied") {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      await this.initialize()
    }

    if (!this.swRegistration) {
      return null
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      })

      // Store subscription in localStorage for demo purposes
      localStorage.setItem("push-subscription", JSON.stringify(subscription))

      return subscription
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error)
      return null
    }
  }

  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.swRegistration) {
      return false
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        localStorage.removeItem("push-subscription")
        return true
      }
      return false
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error)
      return false
    }
  }

  async isSubscribed(): Promise<boolean> {
    if (!this.swRegistration) {
      return false
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription()
      return !!subscription
    } catch (error) {
      return false
    }
  }

  // Send local notification (fallback for when push isn't available)
  sendLocalNotification(payload: PushNotificationPayload): void {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return
    }

    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || "/icon-192x192.png",
      badge: payload.badge || "/badge-72x72.png",
      image: payload.image,
      data: payload.data,
      tag: payload.data?.tag || "cantollege-notification",
      requireInteraction: true,
    })

    notification.onclick = () => {
      window.focus()
      if (payload.data?.url) {
        window.location.href = payload.data.url
      }
      notification.close()
    }

    // Auto close after 10 seconds
    setTimeout(() => {
      notification.close()
    }, 10000)
  }

  // Simulate server push notification (in real app, this would be sent from server)
  async simulatePushNotification(payload: PushNotificationPayload): Promise<void> {
    const subscription = await this.swRegistration?.pushManager.getSubscription()

    if (subscription) {
      // In a real app, you'd send this to your server which would use web-push library
      // For demo, we'll trigger the service worker directly
      if (this.swRegistration?.active) {
        this.swRegistration.active.postMessage({
          type: "PUSH_NOTIFICATION",
          payload,
        })
      }
    } else {
      // Fallback to local notification
      this.sendLocalNotification(payload)
    }
  }

  // Notification for new seasonal items
  async notifyNewSeasonalItem(item: SeasonalItem): Promise<void> {
    const preferences = this.getNotificationPreferences()

    if (!preferences.newSeasonalItems) {
      return
    }

    const payload: PushNotificationPayload = {
      title: "🌟 New Seasonal Special!",
      body: `${item.name} is now available! ${item.theme.description}`,
      icon: "/icon-192x192.png",
      image: item.image,
      data: {
        type: "new-seasonal-item",
        itemId: item.id,
        url: "/#seasonal-specials",
        tag: `new-item-${item.id}`,
      },
      actions: [
        {
          action: "view",
          title: "View Item",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    }

    await this.simulatePushNotification(payload)
  }

  // Notification for items ending soon
  async notifyItemEndingSoon(item: SeasonalItem, hoursLeft: number): Promise<void> {
    const preferences = this.getNotificationPreferences()

    if (!preferences.endingItems) {
      return
    }

    const payload: PushNotificationPayload = {
      title: "⏰ Last Chance!",
      body: `${item.name} ends in ${hoursLeft} hours. Order now!`,
      icon: "/icon-192x192.png",
      image: item.image,
      data: {
        type: "ending-soon",
        itemId: item.id,
        url: "/#seasonal-specials",
        tag: `ending-${item.id}`,
      },
      actions: [
        {
          action: "order",
          title: "Order Now",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    }

    await this.simulatePushNotification(payload)
  }

  // Notification for promotions
  async notifyPromotion(title: string, description: string, discountPercentage?: number): Promise<void> {
    const preferences = this.getNotificationPreferences()

    if (!preferences.promotions) {
      return
    }

    const payload: PushNotificationPayload = {
      title: `🎉 ${title}`,
      body: discountPercentage ? `${description} Get ${discountPercentage}% off!` : description,
      icon: "/icon-192x192.png",
      data: {
        type: "promotion",
        url: "/#seasonal-specials",
        tag: "promotion",
      },
      actions: [
        {
          action: "view",
          title: "View Offers",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    }

    await this.simulatePushNotification(payload)
  }

  // Get notification preferences
  getNotificationPreferences(): NotificationPreferences {
    const stored = localStorage.getItem("notification-preferences")
    const defaults: NotificationPreferences = {
      pushEnabled: false,
      emailEnabled: false,
      newSeasonalItems: true,
      endingItems: true,
      promotions: true,
      orderUpdates: true,
    }

    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults
  }

  // Save notification preferences
  saveNotificationPreferences(preferences: NotificationPreferences): void {
    localStorage.setItem("notification-preferences", JSON.stringify(preferences))
  }

  // Utility function to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
  }

  // Get notification permission status
  getPermissionStatus(): NotificationPermission {
    return Notification.permission
  }
}

export const notificationService = new NotificationService()
