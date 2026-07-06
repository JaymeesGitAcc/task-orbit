import express from "express"
import {
  createUser,
  deleteDemoUsers,
  deleteUser,
  demoLogin,
  forgotPassword,
  loginUser,
  resetPassword,
  updatePassword,
  verifyEmail,
} from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const authRoutes = express.Router()

authRoutes.post("/", createUser)
authRoutes.post("/login", loginUser)
authRoutes.post("/verify-email", verifyEmail)
authRoutes.post("/forgot-password", forgotPassword)
authRoutes.post("/reset-password/:token", resetPassword)
authRoutes.patch("/update-password", protect, updatePassword)
authRoutes.delete("/account", protect, deleteUser)
authRoutes.get("/demo-login", demoLogin)
authRoutes.delete("/delete-demousers", deleteDemoUsers)

export default authRoutes
