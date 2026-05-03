import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuthStore } from "@/store/useAuthStore"

interface FormState {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

function validate(form: FormState): FormErrors {
  const errs: FormErrors = {}
  if (!form.email) errs.email = "Email is required."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = "Enter a valid email address."
  if (!form.password) errs.password = "Password is required."
  else if (form.password.length < 8)
    errs.password = "Password must be at least 8 characters."
  return errs
}

const Login = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({ email: "", password: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const login = useAuthStore((s) => s.login)
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

    await login(form, () => navigate("/dashboard"))
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
          <p className="text-gray-500 text-sm mt-1">Welcome back!</p>
          <p className="text-gray-400 text-xs mt-0.5">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(v as boolean)}
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Sign up */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
