import type { CartItem, FoodItem } from "./data"

export interface UserPreferences {
  favoriteCategories?: string[]
  dietaryRestrictions?: string[]
  spiceLevel?: "mild" | "medium" | "hot"
  tags?: string[]
  favoriteItems?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  createdAt: number
  preferences?: UserPreferences
}

export interface UserCredentials {
  email: string
  password: string
}

export interface UserRegistration extends UserCredentials {
  name: string
  phone?: string
  address?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface EnhancedOrder {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: "Placed" | "Preparing" | "Ready for Pickup" | "Completed"
  timestamp: number
  paymentMethod?: string
  paymentStatus?: PaymentStatus
  paymentDetails?: PaymentDetails
  deliveryAddress?: string
  specialInstructions?: string
}

export interface FavoriteItem {
  userId: string
  foodItem: FoodItem
  addedAt: number
}

export type PaymentStatus = "pending" | "processing" | "completed" | "failed"

export type PaymentMethod = "card" | "upi" | "wallet" | "cash"

export interface PaymentDetails {
  id: string
  method: PaymentMethod
  amount: number
  timestamp: number
  cardDetails?: {
    last4: string
    brand: string
  }
  upiDetails?: {
    id: string
  }
  walletDetails?: {
    provider: string
    transactionId: string
  }
  receiptUrl?: string
}

export interface CardDetails {
  number: string
  name: string
  expiry: string
  cvc: string
}

export interface UpiDetails {
  id: string
}

export interface WalletDetails {
  provider: string
}
