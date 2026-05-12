import express from "express"
import {
  createBoard,
  deleteBoard,
  getBoardById,
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

export default boardRoutes
