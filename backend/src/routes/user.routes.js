import express from "express"
import { getAllUsers } from "../controllers/user.controller.js"

const userRoutes = express.Router()

userRoutes.get("/", getAllUsers)

export default userRoutes
