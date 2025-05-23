"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, LogOut, User } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { formatDate, formatPhoneNumber } from "@/lib/utils"

export function UserProfile() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, error, updateProfile, logout } = useAuthStore()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [address, setAddress] = useState(user?.address || "")
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  if (!isAuthenticated || !user) {
    return (
      <Card className="w-full max-w-md mx-auto glass-card">
        <CardHeader>
          <CardTitle>Not Logged In</CardTitle>
          <CardDescription>Please log in to view your profile</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/login")} className="w-full">
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset form
      setName(user.name)
      setPhone(user.phone || "")
      setAddress(user.address || "")
    }
    setIsEditing(!isEditing)
  }

  const handleUpdateProfile = async () => {
    setUpdateLoading(true)
    setUpdateError(null)

    try {
      await updateProfile({
        name,
        phone,
        address,
      })
      setIsEditing(false)
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setUpdateLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-audiowide gradient-text">Your Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {updateError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{updateError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="p-2 bg-muted/30 rounded-md">{user.email}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              ) : (
                <div className="p-2 bg-muted/30 rounded-md">{user.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                />
              ) : (
                <div className="p-2 bg-muted/30 rounded-md">
                  {user.phone ? formatPhoneNumber(user.phone) : "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your delivery address"
                />
              ) : (
                <div className="p-2 bg-muted/30 rounded-md">{user.address || "Not provided"}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Member Since</Label>
              <div className="p-2 bg-muted/30 rounded-md">{formatDate(user.createdAt)}</div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        {isEditing ? (
          <div className="flex w-full gap-3">
            <Button variant="outline" onClick={handleEditToggle} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} className="flex-1" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={handleEditToggle} className="w-full">
            Edit Profile
          </Button>
        )}

        <Button variant="outline" onClick={handleLogout} className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </CardFooter>
    </Card>
  )
}
