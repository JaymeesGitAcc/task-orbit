import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { verifyEmail } from "@/services/auth.api"

function VerifyEmail() {
  const [status, setStatus] = useState("verifying")
  const [message, setMessage] = useState("")
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link")
      return
    }

    const emailVerificationProcess = async () => {
      try {
        const res = await verifyEmail(token)
        setStatus("success")
        setMessage(res?.data?.message || "Email verified successfully!")

        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } catch (err: any) {
        setStatus("error")
        setMessage(
          err.response?.data?.message || "Verification failed or link expired",
        )
      }
    }

    emailVerificationProcess()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pt-8">
          <div className="mb-4 flex justify-center">
            {status === "verifying" && (
              <div className="bg-blue-100 rounded-full p-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-100 rounded-full p-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            )}
          </div>

          <CardTitle className="text-2xl font-bold">
            {status === "verifying" && "Verifying Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>

          <CardDescription className="text-base mt-2">
            {status === "verifying" &&
              "Please wait while we verify your email address..."}
            {status === "success" &&
              "Your email has been successfully verified"}
            {status === "error" && "We couldn't verify your email address"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          {message && (
            <div
              className={`p-4 rounded-lg mb-4 text-center ${
                status === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : status === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}
            >
              <p className="font-medium">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                Redirecting to login page in a few seconds...
              </p>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  navigate("/login")
                }}
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Button variant="outline" className="w-full" size="lg">
                Request New Verification Link
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                role="link"
                onClick={() => {
                  navigate("/")
                }}
              >
                Go to Homepage
              </Button>
            </div>
          )}

          {status === "verifying" && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Checking your verification token...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmail
