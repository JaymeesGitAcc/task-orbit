import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/useAuthStore"
import { updatePassword } from "@/services/auth.api"
import { toast } from "sonner"

interface ProfileForm {
  name: string
  email: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

interface PasswordErrors {
  currentPassword?: string
  newPassword?: string
  confirmNewPassword?: string
}

function validatePassword(form: PasswordForm): PasswordErrors {
  const errs: PasswordErrors = {}
  if (!form.currentPassword.trim())
    errs.currentPassword = "Current password is required."
  if (!form.newPassword.trim()) errs.newPassword = "New password is required."
  else if (form.newPassword.length < 8)
    errs.newPassword = "Password must be at least 8 characters."
  if (!form.confirmNewPassword.trim())
    errs.confirmNewPassword = "Please confirm your new password."
  else if (form.newPassword !== form.confirmNewPassword)
    errs.confirmNewPassword = "Passwords do not match."
  return errs
}

const Settings = () => {
  const [profile, setProfile] = useState<ProfileForm>({
    name: "",
    email: "",
  })

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({})
  const [passwordSubmitted, setPasswordSubmitted] = useState<boolean>(false)
  const [showCurrent, setShowCurrent] = useState<boolean>(false)
  const [showNew, setShowNew] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false)

  const { user } = useAuthStore()

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...passwordForm, [e.target.name]: e.target.value }
    setPasswordForm(updated)
    if (passwordSubmitted) setPasswordErrors(validatePassword(updated))
  }

  const handleUpdatePassword = async () => {
    setPasswordSubmitted(true)
    const errs = validatePassword(passwordForm)
    setPasswordErrors(errs)
    if (Object.keys(errs).length > 0) return
    
    try {
      setIsPasswordUpdating(true)
      const res = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      if (res?.data?.data) {
        toast.success("Password Updated Successfully", {
          position: "top-center",
        })
      }
    } catch (error) {
      toast.error("Something went wrong", { position: "top-center" })
    } finally {
      setIsPasswordUpdating(false)
      setPasswordSubmitted(false)
    }
  }

  const handleDeleteAccount = () => {
    alert("Account Deleted permanently")
  }

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email })
    }
  }, [user])

  return (
    <div className="px-8">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-semibold">Settings</h2>

        {/* Profile Section */}
        <section className="mb-6">
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-gray-500">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-gray-500">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="text-sm pr-16"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Change Password Section */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Change Password
          </h3>
          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="currentPassword"
                className="text-xs text-gray-500"
              >
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  placeholder="••••••••••"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className={`pr-10 text-sm ${passwordErrors.currentPassword ? "border-red-400 focus-visible:ring-red-300" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-xs text-red-500">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs text-gray-500">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••••"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className={`pr-10 text-sm ${passwordErrors.newPassword ? "border-red-400 focus-visible:ring-red-300" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-500">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmNewPassword"
                className="text-xs text-gray-500"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••••"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className={`pr-10 text-sm ${passwordErrors.confirmNewPassword ? "border-red-400 focus-visible:ring-red-300" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.confirmNewPassword && (
                <p className="text-xs text-red-500">
                  {passwordErrors.confirmNewPassword}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleUpdatePassword}
                disabled={isPasswordUpdating}
                className="bg-primary text-white text-sm"
              >
                {isPasswordUpdating ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Danger Zone
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-500 font-medium">
                Delete Account Permanently
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDeleteAccount}
              className="text-red-500 border-red-300 hover:bg-red-50 text-sm"
            >
              Delete Account
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Settings
