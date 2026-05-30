import { useState } from "react"
import { Eye, EyeOff, LayoutDashboard, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useSearchParams } from "react-router-dom"
import { resetPassword } from "@/services/auth.api"
import { toast } from "sonner"

interface FormState {
  password: string
  confirmPassword: string
}

interface FormErrors {
  password?: string
  confirmPassword?: string
}

function validate(form: FormState): FormErrors {
  const errs: FormErrors = {}
  if (!form.password) errs.password = "Password is required."
  else if (form.password.length < 8)
    errs.password = "Password must be at least 8 characters."
  if (!form.confirmPassword)
    errs.confirmPassword = "Please confirm your password."
  else if (form.password !== form.confirmPassword)
    errs.confirmPassword = "Passwords do not match."
  return errs
}

export default function ResetPassword() {
  const [form, setForm] = useState<FormState>({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [searchParams] = useSearchParams()

  const token = searchParams.get("token")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value }
    setForm(updated)
    if (submitted) setErrors(validate(updated))
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    try {
      setLoading(true)
      if (!token) return
      const res = await resetPassword({ token, password: form.password })
      if (res?.data?.data) setSuccess(true)
    } catch (error) {
      console.log("Reset Password Error: ", error)
      toast.error("Something went wrong", { position: "top-center" })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
          <div className="bg-green-100 p-4 rounded-full">
            <ShieldCheck className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Password Reset!
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>
          </div>
          <a
            href="/login"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <div className="bg-primary text-white rounded-xl p-2.5 mb-3">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">TaskOrbit</h1>
          <p className="text-gray-500 text-sm mt-1">Reset your password</p>
          <p className="text-gray-400 text-xs mt-0.5">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm text-gray-700">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`pr-10 ${errors.password ? "border-red-400 focus-visible:ring-red-300" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm text-gray-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`pr-10 ${errors.confirmPassword ? "border-red-400 focus-visible:ring-red-300" : ""}`}
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
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-white font-medium"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>

        {/* Back to login */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
