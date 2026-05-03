import { useAuthStore } from "@/store/useAuthStore"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore.getState().token

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
