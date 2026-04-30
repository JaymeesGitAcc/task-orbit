import express from "express"
import {
  createList,
  deleteList,
  getListsByBoard,
} from "../controllers/list.controller.js"

const listRoutes = express.Router()

listRoutes.post("/", createList)
listRoutes.get("/:boardId", getListsByBoard)
listRoutes.delete("/:listId", deleteList)

export default listRoutes
