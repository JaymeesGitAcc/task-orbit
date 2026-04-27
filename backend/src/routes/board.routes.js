import express from "express"
import { createBoard, getBoards } from "../controllers/board.controller.js"

const boardRoutes = express.Router()

boardRoutes.post("/", createBoard)
boardRoutes.get("/", getBoards)

export default boardRoutes