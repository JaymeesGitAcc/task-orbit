import express from "express"
import {
  createList,
  deleteList,
  getListsByBoard,
  moveList,
} from "../controllers/list.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const listRoutes = express.Router()

listRoutes.post("/", protect, createList)
listRoutes.get("/:boardId", protect, getListsByBoard)
listRoutes.delete("/:listId", protect, deleteList)
listRoutes.patch("/:listId/move", protect, moveList)

export default listRoutes
