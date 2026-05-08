import ProtectedRoute from "@/components/ProtectedRoute"
import DashBoardLayout from "@/layouts/DashBoardLayout"
import AllBoards from "@/pages/AllBoards"
import BoardPage from "@/pages/BoardPage"
import Login from "@/pages/Login"
import Settings from "@/pages/Settings"
import SignUp from "@/pages/SignUp"
import { BrowserRouter, Route, Routes } from "react-router-dom"

const AppRoutes = () => {
  return (
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
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
