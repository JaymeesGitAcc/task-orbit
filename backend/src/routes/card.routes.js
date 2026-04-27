import express from "express"
import {
  createCard,
  getCardsByList,
  moveCard,
} from "../controllers/card.controller.js"

const cardRoutes = express.Router()

cardRoutes.post("/", createCard)
cardRoutes.get("/:listId", getCardsByList)
cardRoutes.put("/:cardId/move", moveCard)

export default cardRoutes
