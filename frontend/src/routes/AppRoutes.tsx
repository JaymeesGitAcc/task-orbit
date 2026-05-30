import ProtectedRoute from "@/components/ProtectedRoute"
import DashBoardLayout from "@/layouts/DashBoardLayout"
import AllBoards from "@/pages/AllBoards"
import BoardPage from "@/pages/BoardPage"
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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashBoardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="boards" replace />} />
            <Route
              path="boards"
              element={
                <ProtectedRoute>
                  <AllBoards />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="boards/:id"
              element={
                <ProtectedRoute>
                  <BoardPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default AppRoutes
