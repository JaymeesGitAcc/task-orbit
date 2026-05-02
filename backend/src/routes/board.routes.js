import express from "express"
import { createBoard, getBoardById, getBoards } from "../controllers/board.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const boardRoutes = express.Router()

boardRoutes.post("/", protect, createBoard)
boardRoutes.get("/", protect, getBoards)
boardRoutes.get("/:boardId", protect, getBoardById)

export default boardRoutes