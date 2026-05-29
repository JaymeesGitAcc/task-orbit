import express from "express"
import { createUser, loginUser, verifyEmail } from "../controllers/auth.controller.js"

const authRoutes = express.Router()

authRoutes.post("/", createUser)
authRoutes.post("/login", loginUser)
authRoutes.post("/verify-email", verifyEmail)

export default authRoutes