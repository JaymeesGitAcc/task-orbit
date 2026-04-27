import express from "express"
import { createList, getListsByBoard } from "../controllers/list.controller.js"

const listRoutes = express.Router()

listRoutes.post("/", createList)
listRoutes.get("/:boardId", getListsByBoard)

export default listRoutes
