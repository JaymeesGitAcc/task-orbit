import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom"
import BoardPage from "./pages/BoardPage"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import DashBoard from "./pages/DashBoard"
import ProtectedRoute from "./component/ProtectedRoute"

const App = () => {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/board/:id"
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
