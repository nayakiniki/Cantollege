import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CartItem } from "./data"
import type { EnhancedOrder } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Local storage keys
export const CART_STORAGE_KEY = "cantollege-cart"
export const ORDERS_STORAGE_KEY = "cantollege-orders"

// Get cart from local storage
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []

  const cart = localStorage.getItem(CART_STORAGE_KEY)
  return cart ? JSON.parse(cart) : []
}

// Save cart to local storage
export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

// Get orders from local storage
export function getOrders(): EnhancedOrder[] {
  if (typeof window === "undefined") return []

  const orders = localStorage.getItem(ORDERS_STORAGE_KEY)
  return orders ? JSON.parse(orders) : []
}

// Save orders to local storage
export function saveOrders(orders: EnhancedOrder[]) {
  if (typeof window === "undefined") return

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

// Calculate total price for a cart item
export function calculateItemTotal(item: CartItem): number {
  let basePrice = item.foodItem.price * item.quantity

  // Add customization costs
  if (item.customizations && item.customizations.length > 0) {
    const customizationTotal = item.customizations.reduce((total, customization) => {
      return total + customization.option.price * item.quantity
    }, 0)

    basePrice += customizationTotal
  }

  return basePrice
}

// Format price to INR
export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`
}

// Generate a random order ID
export function generateOrderId(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Format date
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""

  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, "")

  // Format as XXX-XXX-XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return phone
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password (at least 6 characters)
export function isValidPassword(password: string): boolean {
  return password.length >= 6
}
