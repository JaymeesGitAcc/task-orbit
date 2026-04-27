import Card from "../models/card.model.js"
import { sendError, sendSuccess } from "../utils/response.js"

export const createCard = async (req, res) => {
  try {
    const { title, description, listId } = req.body

    if (!title || !listId) {
      return sendError(res, 400, "Title and listId are required")
    }

    const lastCard = await Card.findOne({ listId }).sort({ order: -1 })

    const newOrder = lastCard ? lastCard.order + 1 : 0

    const card = await Card.create({
      title,
      description,
      listId,
      order: newOrder,
    })

    return sendSuccess(res, 201, "Card created successfully", card)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const getCardsByList = async (req, res) => {
  try {
    const { listId } = req.params
    const cards = await Card.find({ listId }).sort({ order: 1 })
    return sendSuccess(res, 200, "Cards fetched successfully", cards)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const moveCard = async (req, res) => {
  try {
    const { cardId } = req.params
    const { targetListId, targetOrder } = req.body
    
    if (!targetListId || targetOrder === undefined) {
      return sendError(res, 400, "targetListId and targetOrder are required")
    }
    
    const card = await Card.findById(cardId)
    let sourceListId = card.listId

    if (!card) {
      return sendError(res, 404, "Card not found")
    }

    // Shift cards in target list
    await Card.updateMany(
      {
        listId: targetListId,
        order: { $gte: targetOrder },
      },
      { $inc: { order: 1 } },
    )

    // Update moved card
    card.listId = targetListId
    card.order = targetOrder

    await card.save()

    // re-order the remaining cards
    const remainingCards = await Card.find({
      listId: sourceListId,
    }).sort({ order: 1 })

    for (let i = 0; i < remainingCards.length; i++) {
      remainingCards[i].order = i
      await remainingCards[i].save()
    }

    return sendSuccess(res, 200, "Card moved successfully", card)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}
