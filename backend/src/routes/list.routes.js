import express from "express"
import {
  createList,
  deleteList,
  getListsByBoard,
} from "../controllers/list.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const listRoutes = express.Router()

listRoutes.post("/", protect, createList)
listRoutes.get("/:boardId", protect, getListsByBoard)
listRoutes.delete("/:listId", protect, deleteList)

export default listRoutes
