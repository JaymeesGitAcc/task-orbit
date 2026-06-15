import express from "express"
import {
  createBoard,
  deleteBoard,
  getBoardAnalysis,
  getBoardById,
  getBoardInsights,
  getBoards,
  updateBoard,
} from "../controllers/board.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const boardRoutes = express.Router()

boardRoutes.post("/", protect, createBoard)
boardRoutes.get("/", protect, getBoards)
boardRoutes.get("/:boardId", protect, getBoardById)
boardRoutes.delete("/:boardId", protect, deleteBoard)
boardRoutes.patch("/:boardId", protect, updateBoard)
boardRoutes.get("/:boardId/insights", protect, getBoardInsights)
boardRoutes.get("/:boardId/analyze", protect, getBoardAnalysis)

export default boardRoutes
