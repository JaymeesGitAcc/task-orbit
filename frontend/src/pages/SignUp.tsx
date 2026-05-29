import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, LayoutDashboard, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/useAuthStore"

interface FormState {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function validate(form: FormState): FormErrors {
  const errs: FormErrors = {}
  if (!form.name.trim()) errs.name = "Name is required."
  if (!form.email) errs.email = "Email is required."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = "Enter a valid email address."
  if (!form.password) errs.password = "Password is required."
  else if (form.password.length < 8)
    errs.password = "Password must be at least 8 characters."
  if (!form.confirmPassword)
    errs.confirmPassword = "Please confirm your password."
  else if (form.password !== form.confirmPassword)
    errs.confirmPassword = "Passwords do not match."
  return errs
}

const SignUp = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)

  const signup = useAuthStore((s) => s.signup)
  const loading = useAuthStore((s) => s.loading)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value }
    setForm(updated)
    if (submitted) setErrors(validate(updated))
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    await signup(
      { name: form.name, email: form.email, password: form.password },
      () => setSuccess(true),
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
          <div className="bg-green-100 p-4 rounded-full">
            <MailCheck className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Account Created!
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              We've sent a verification link to{" "}
              <span className="font-medium text-gray-700">{form.email}</span>.
              Please check your inbox and verify your email to get started.
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Didn't receive it? Check your spam folder.
          </p>
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
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
          <p className="text-gray-400 text-xs mt-0.5">
            Start managing your tasks today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm text-gray-700">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className={
                errors.name ? "border-red-400 focus-visible:ring-red-300" : ""
              }
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={
                errors.email ? "border-red-400 focus-visible:ring-red-300" : ""
              }
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm text-gray-700">
              Password
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
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
