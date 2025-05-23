"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, FoodItem } from "./data"
import { calculateItemTotal, generateOrderId, getCart, getOrders, saveCart, saveOrders } from "./utils"
import type { EnhancedOrder, PaymentDetails } from "./types"

interface CartStore {
  cart: CartItem[]
  addToCart: (foodItem: FoodItem, quantity: number, customizations?: CartItem["customizations"]) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalAmount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (foodItem, quantity, customizations) => {
        set((state) => {
          // Check if item already exists in cart
          const existingItemIndex = state.cart.findIndex((item) => item.foodItem.id === foodItem.id)

          let newCart: CartItem[]

          if (existingItemIndex >= 0) {
            // Update existing item
            newCart = [...state.cart]
            newCart[existingItemIndex].quantity += quantity
            newCart[existingItemIndex].totalPrice = calculateItemTotal(newCart[existingItemIndex])
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `${foodItem.id}-${Date.now()}`,
              foodItem,
              quantity,
              customizations,
              totalPrice: 0,
            }
            newItem.totalPrice = calculateItemTotal(newItem)
            newCart = [...state.cart, newItem]
          }

          saveCart(newCart)
          return { cart: newCart }
        })
      },

      removeFromCart: (itemId) => {
        set((state) => {
          const newCart = state.cart.filter((item) => item.id !== itemId)
          saveCart(newCart)
          return { cart: newCart }
        })
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          const newCart = state.cart.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                quantity,
                totalPrice: item.foodItem.price * quantity,
              }
            }
            return item
          })
          saveCart(newCart)
          return { cart: newCart }
        })
      },

      clearCart: () => {
        saveCart([])
        set({ cart: [] })
      },

      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalAmount: () => {
        return get().cart.reduce((total, item) => total + item.totalPrice, 0)
      },
    }),
    {
      name: "cantollege-cart",
      skipHydration: true,
    },
  ),
)

interface OrderStore {
  orders: EnhancedOrder[]
  currentOrder: EnhancedOrder | null
  placeOrder: (
    userId: string,
    items: CartItem[],
    totalAmount: number,
    paymentMethod?: string,
    deliveryAddress?: string,
    specialInstructions?: string,
  ) => EnhancedOrder
  getOrders: () => EnhancedOrder[]
  getUserOrders: (userId: string) => EnhancedOrder[]
  updateOrderStatus: (orderId: string, status: EnhancedOrder["status"]) => void
  updateOrderPayment: (orderId: string, paymentDetails: PaymentDetails) => void
  setCurrentOrder: (order: EnhancedOrder | null) => void
  getOrderById: (orderId: string) => EnhancedOrder | undefined
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,

      placeOrder: (userId, items, totalAmount, paymentMethod, deliveryAddress, specialInstructions) => {
        const newOrder: EnhancedOrder = {
          id: generateOrderId(),
          userId,
          items,
          totalAmount,
          status: "Placed",
          timestamp: Date.now(),
          paymentMethod,
          paymentStatus: paymentMethod === "cash" ? "completed" : "pending",
          deliveryAddress,
          specialInstructions,
        }

        set((state) => {
          const updatedOrders = [newOrder, ...state.orders]
          saveOrders(updatedOrders)
          return {
            orders: updatedOrders,
            currentOrder: newOrder,
          }
        })

        // Auto-start tracking for cash orders or completed payments
        if (
          typeof window !== "undefined" &&
          (newOrder.paymentMethod === "cash" || newOrder.paymentStatus === "completed")
        ) {
          // Dynamically import to avoid SSR issues
          import("./order-tracking-service").then(({ orderTrackingService }) => {
            setTimeout(() => {
              orderTrackingService.startTracking(newOrder, (orderId, status) => {
                get().updateOrderStatus(orderId, status)
              })
            }, 100)
          })
        }

        return newOrder
      },

      getOrders: () => {
        const orders = getOrders()
        set({ orders })
        return orders
      },

      getUserOrders: (userId) => {
        return get().orders.filter((order) => order.userId === userId)
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) => {
            if (order.id === orderId) {
              return { ...order, status }
            }
            return order
          })
          saveOrders(updatedOrders)

          // Also update currentOrder if it matches
          const currentOrder =
            state.currentOrder && state.currentOrder.id === orderId
              ? { ...state.currentOrder, status }
              : state.currentOrder

          return {
            orders: updatedOrders,
            currentOrder,
          }
        })
      },

      updateOrderPayment: (orderId, paymentDetails) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) => {
            if (order.id === orderId) {
              const updatedOrder = {
                ...order,
                paymentDetails,
                paymentStatus: "completed" as const,
              }

              // Start tracking the order after payment completion
              if (typeof window !== "undefined") {
                import("./order-tracking-service").then(({ orderTrackingService }) => {
                  setTimeout(() => {
                    orderTrackingService.startTracking(updatedOrder, (id, status) => {
                      get().updateOrderStatus(id, status)
                    })
                  }, 100)
                })
              }

              return updatedOrder
            }
            return order
          })
          saveOrders(updatedOrders)

          // Also update currentOrder if it matches
          const currentOrder =
            state.currentOrder && state.currentOrder.id === orderId
              ? { ...state.currentOrder, paymentDetails, paymentStatus: "completed" }
              : state.currentOrder

          return {
            orders: updatedOrders,
            currentOrder,
          }
        })
      },

      setCurrentOrder: (order) => {
        set({ currentOrder: order })
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId)
      },
    }),
    {
      name: "cantollege-orders",
      skipHydration: true,
    },
  ),
)

// Initialize stores with localStorage data on client side
if (typeof window !== "undefined") {
  useCartStore.setState({ cart: getCart() })
  useOrderStore.setState({ orders: getOrders() })
}
