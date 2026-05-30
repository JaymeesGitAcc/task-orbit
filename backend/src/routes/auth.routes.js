import express from "express"
import {
  createUser,
  forgotPassword,
  loginUser,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js"

const authRoutes = express.Router()

authRoutes.post("/", createUser)
authRoutes.post("/login", loginUser)
authRoutes.post("/verify-email", verifyEmail)
authRoutes.post("/forgot-password", forgotPassword)
authRoutes.post("/reset-password/:token", resetPassword)

export default authRoutes
