"use client"

import { seasonalService, type SeasonalItem } from "./seasonal-service"
import { notificationService } from "./notification-service"

class SeasonalNotificationManager {
  private checkInterval: NodeJS.Timeout | null = null
  private lastCheckedItems: Set<string> = new Set()
  private notifiedEndingItems: Set<string> = new Set()

  start(): void {
    // Check every 5 minutes
    this.checkInterval = setInterval(
      () => {
        this.checkForNewItems()
        this.checkForEndingItems()
      },
      5 * 60 * 1000,
    )

    // Initial check
    this.checkForNewItems()
    this.checkForEndingItems()

    // Load previously notified items from localStorage
    this.loadNotificationState()
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  private checkForNewItems(): void {
    const currentItems = seasonalService.getCurrentSeasonalItems()
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    // Find items that started within the last 24 hours and haven't been notified
    const newItems = currentItems.filter((item) => {
      const isNew = item.startDate >= oneDayAgo
      const notNotified = !this.lastCheckedItems.has(item.id)
      return isNew && notNotified
    })

    // Send notifications for new items
    newItems.forEach((item) => {
      this.notifyNewItem(item)
      this.lastCheckedItems.add(item.id)
    })

    // Save state
    this.saveNotificationState()
  }

  private checkForEndingItems(): void {
    const currentItems = seasonalService.getCurrentSeasonalItems()
    const now = Date.now()
    const twentyFourHoursFromNow = now + 24 * 60 * 60 * 1000

    // Find items ending within 24 hours that haven't been notified
    const endingItems = currentItems.filter((item) => {
      const isEndingSoon = item.endDate <= twentyFourHoursFromNow && item.endDate > now
      const notNotified = !this.notifiedEndingItems.has(item.id)
      return isEndingSoon && notNotified
    })

    // Send notifications for ending items
    endingItems.forEach((item) => {
      const hoursLeft = Math.ceil((item.endDate - now) / (1000 * 60 * 60))
      this.notifyEndingItem(item, hoursLeft)
      this.notifiedEndingItems.add(item.id)
    })

    // Save state
    this.saveNotificationState()
  }

  private async notifyNewItem(item: SeasonalItem): Promise<void> {
    try {
      await notificationService.notifyNewSeasonalItem(item)
      console.log(`Notification sent for new item: ${item.name}`)
    } catch (error) {
      console.error("Failed to send new item notification:", error)
    }
  }

  private async notifyEndingItem(item: SeasonalItem, hoursLeft: number): Promise<void> {
    try {
      await notificationService.notifyItemEndingSoon(item, hoursLeft)
      console.log(`Notification sent for ending item: ${item.name} (${hoursLeft}h left)`)
    } catch (error) {
      console.error("Failed to send ending item notification:", error)
    }
  }

  // Manually trigger notification for a new item (for testing)
  async triggerNewItemNotification(itemId: string): Promise<void> {
    const item = seasonalService.getSeasonalItem(itemId)
    if (item) {
      await this.notifyNewItem(item)
    }
  }

  // Manually trigger notification for ending item (for testing)
  async triggerEndingItemNotification(itemId: string): Promise<void> {
    const item = seasonalService.getSeasonalItem(itemId)
    if (item) {
      const timeRemaining = seasonalService.getTimeRemaining(item)
      const hoursLeft = timeRemaining.days * 24 + timeRemaining.hours
      await this.notifyEndingItem(item, hoursLeft)
    }
  }

  // Check for promotions and send notifications
  async checkForPromotions(): Promise<void> {
    const promotions = seasonalService.getCurrentPromotions()

    for (const promotion of promotions) {
      const notificationKey = `promotion-${promotion.id}`
      const alreadyNotified = localStorage.getItem(notificationKey)

      if (!alreadyNotified) {
        await notificationService.notifyPromotion(promotion.title, promotion.description, promotion.discountPercentage)
        localStorage.setItem(notificationKey, "true")
      }
    }
  }

  private loadNotificationState(): void {
    const checkedItems = localStorage.getItem("notified-new-items")
    const endingItems = localStorage.getItem("notified-ending-items")

    if (checkedItems) {
      this.lastCheckedItems = new Set(JSON.parse(checkedItems))
    }

    if (endingItems) {
      this.notifiedEndingItems = new Set(JSON.parse(endingItems))
    }
  }

  private saveNotificationState(): void {
    localStorage.setItem("notified-new-items", JSON.stringify([...this.lastCheckedItems]))
    localStorage.setItem("notified-ending-items", JSON.stringify([...this.notifiedEndingItems]))
  }

  // Reset notification state (for testing)
  resetNotificationState(): void {
    this.lastCheckedItems.clear()
    this.notifiedEndingItems.clear()
    localStorage.removeItem("notified-new-items")
    localStorage.removeItem("notified-ending-items")
    // Clear promotion notifications
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("promotion-"))
    keys.forEach((key) => localStorage.removeItem(key))
  }
}

export const seasonalNotificationManager = new SeasonalNotificationManager()
