import express from "express"
import {
  createCard,
  deleteCard,
  getCardsByList,
  moveCard,
} from "../controllers/card.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const cardRoutes = express.Router()

cardRoutes.post("/", protect, createCard)
cardRoutes.get("/:listId", protect, getCardsByList)
cardRoutes.put("/:cardId/move", protect, moveCard)
cardRoutes.delete("/:cardId", protect, deleteCard)

export default cardRoutes
