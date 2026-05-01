import express from "express"
import { createUser, loginUser } from "../controllers/auth.controller.js"

const authRoutes = express.Router()

authRoutes.post("/", createUser)
authRoutes.post("/login", loginUser)

export default authRoutes