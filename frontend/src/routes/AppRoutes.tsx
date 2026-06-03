import ProtectedRoute from "@/components/ProtectedRoute"
import DashBoardLayout from "@/layouts/DashBoardLayout"
import AllBoards from "@/pages/AllBoards"
import BoardPage from "@/pages/BoardPage"
import LandingPage from "@/pages/LandingPage"
import Login from "@/pages/Login"
import ResetPassword from "@/pages/ResetPassword"
import Settings from "@/pages/Settings"
import SignUp from "@/pages/SignUp"
import VerifyEmail from "@/pages/VerifyEmail"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"

const AppRoutes = () => {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected App */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashBoardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="boards" replace />} />
            <Route path="boards" element={<AllBoards />} />
            <Route path="boards/:id" element={<BoardPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default AppRoutes
