"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthState, User, UserCredentials, UserRegistration, UserPreferences } from "./types"
import { v4 as uuidv4 } from "uuid"

interface AuthStore extends AuthState {
  register: (userData: UserRegistration) => Promise<User>
  login: (credentials: UserCredentials) => Promise<User>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<User>
  updatePreferences: (preferences: UserPreferences) => Promise<User>
}

// Mock user database in localStorage
const USERS_STORAGE_KEY = "cantollege-users"

// Helper functions
const getUsers = (): Record<string, UserRegistration> => {
  if (typeof window === "undefined") return {}

  const users = localStorage.getItem(USERS_STORAGE_KEY)
  return users ? JSON.parse(users) : {}
}

const saveUsers = (users: Record<string, UserRegistration>) => {
  if (typeof window === "undefined") return

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (userData: UserRegistration) => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const users = getUsers()

          // Check if email already exists
          if (users[userData.email]) {
            throw new Error("Email already registered")
          }

          // Create new user
          const newUser: User = {
            id: uuidv4(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone || "",
            address: userData.address || "",
            createdAt: Date.now(),
            preferences: {
              favoriteCategories: [],
              dietaryRestrictions: [],
              spiceLevel: "medium",
              tags: [],
              favoriteItems: [],
            },
          }

          // Save user with password
          users[userData.email] = {
            ...userData,
            password: userData.password, // In a real app, this would be hashed
          }

          saveUsers(users)

          // Update auth state
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          })

          return newUser
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Registration failed",
          })
          throw error
        }
      },

      login: async (credentials: UserCredentials) => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const users = getUsers()
          const userRecord = users[credentials.email]

          // Check if user exists and password matches
          if (!userRecord || userRecord.password !== credentials.password) {
            throw new Error("Invalid email or password")
          }

          // Create user object (without password)
          const user: User = {
            id: userRecord.id || uuidv4(), // Use existing ID or generate new one
            name: userRecord.name,
            email: userRecord.email,
            phone: userRecord.phone || "",
            address: userRecord.address || "",
            createdAt: userRecord.createdAt || Date.now(),
            preferences: userRecord.preferences || {
              favoriteCategories: [],
              dietaryRestrictions: [],
              spiceLevel: "medium",
              tags: [],
              favoriteItems: [],
            },
          }

          // Update auth state
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })

          return user
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const currentUser = get().user

          if (!currentUser) {
            throw new Error("Not authenticated")
          }

          // Update user data
          const updatedUser: User = {
            ...currentUser,
            ...userData,
          }

          // Update user in "database"
          const users = getUsers()
          if (users[currentUser.email]) {
            users[currentUser.email] = {
              ...users[currentUser.email],
              name: updatedUser.name,
              phone: updatedUser.phone,
              address: updatedUser.address,
              preferences: updatedUser.preferences,
            }
            saveUsers(users)
          }

          // Update auth state
          set({
            user: updatedUser,
            isLoading: false,
          })

          return updatedUser
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Profile update failed",
          })
          throw error
        }
      },

      updatePreferences: async (preferences: UserPreferences) => {
        set({ isLoading: true, error: null })

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          const currentUser = get().user

          if (!currentUser) {
            throw new Error("Not authenticated")
          }

          // Update user preferences
          const updatedUser: User = {
            ...currentUser,
            preferences: {
              ...currentUser.preferences,
              ...preferences,
            },
          }

          // Update user in "database"
          const users = getUsers()
          if (users[currentUser.email]) {
            users[currentUser.email] = {
              ...users[currentUser.email],
              preferences: updatedUser.preferences,
            }
            saveUsers(users)
          }

          // Update auth state
          set({
            user: updatedUser,
            isLoading: false,
          })

          return updatedUser
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Preference update failed",
          })
          throw error
        }
      },
    }),
    {
      name: "cantollege-auth",
      skipHydration: true,
    },
  ),
)
