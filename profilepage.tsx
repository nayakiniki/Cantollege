import { UserPreferences } from "@/components/user-preferences"
import { NotificationSettings } from "@/components/notification-settings"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Profile Page</h1>
      <UserPreferences />
      <NotificationSettings />
    </div>
  )
}
