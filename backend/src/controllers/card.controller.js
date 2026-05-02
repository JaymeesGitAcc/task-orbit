import Card from "../models/card.model.js"
import { sendError, sendSuccess } from "../utils/response.js"

export const createCard = async (req, res) => {
  try {
    const userId = req.user?.id
    const { title, description, listId } = req.body

    if (!title || !listId) {
      return sendError(res, 400, "Title and listId are required")
    }

    const lastCard = await Card.findOne({ listId, userId }).sort({ order: -1 })

    const newOrder = lastCard ? lastCard.order + 1 : 0

    const card = await Card.create({
      title,
      description,
      listId,
      userId,
      order: newOrder,
    })

    return sendSuccess(res, 201, "Card created successfully", card)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const getCardsByList = async (req, res) => {
  try {
    const userId = req.user?.id
    const { listId } = req.params
    const cards = await Card.find({ listId, userId }).sort({ order: 1 })
    return sendSuccess(res, 200, "Cards fetched successfully", cards)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const moveCard = async (req, res) => {
  try {
    const userId = req.user?.id
    const { cardId } = req.params
    const { targetListId, targetOrder } = req.body

    if (!targetListId || targetOrder === undefined) {
      return sendError(res, 400, "targetListId and targetOrder are required")
    }

    const card = await Card.findById(cardId)

    if (!card) {
      return sendError(res, 404, "Card not found")
    }

    if(card.userId.toString() !== userId.toString()) {
      return sendError(res, 400, "Unauthorized")
    }

    const sourceListId = card.listId
    const sourceOrder = card.order

    // moving in same list
    if (String(sourceListId) === String(targetListId)) {
      if (targetOrder > sourceOrder) {
        // moving down
        await Card.updateMany(
          {
            listId: sourceListId,
            order: { $gt: sourceOrder, $lte: targetOrder },
          },
          { $inc: { order: -1 } },
        )
      } else {
        // moving up
        await Card.updateMany(
          {
            listId: sourceListId,
            order: { $gte: targetOrder, $lt: sourceOrder },
          },
          { $inc: { order: 1 } },
        )
      }
    } else {
      // moving in different list

      // fix source list
      await Card.updateMany(
        {
          listId: sourceListId,
          order: { $gt: sourceOrder },
        },
        { $inc: { order: -1 } },
      )

      // shift target list
      await Card.updateMany(
        {
          listId: targetListId,
          order: { $gte: targetOrder },
        },
        { $inc: { order: 1 } },
      )
    }

    // update card
    card.listId = targetListId
    card.order = targetOrder

    await card.save()

    return sendSuccess(res, 200, "Card moved successfully", card)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const deleteCard = async (req, res) => {
  const { cardId } = req.params
  const userId = req.user?.id
  try {
    const card = await Card.findById(cardId)

    if (!card) {
      return sendSuccess(res, 400, "Card not found")
    }

    if(card.userId.toString() !== userId.toString()) {
      return sendError(res, 200, "Forbidden")
    } 

    const deletedCard = await Card.findByIdAndDelete(card._id)

    return sendSuccess(res, 200, "Card Deleted Successfully", deletedCard)
  } catch (error) {
    return sendError(res, 500, `deleteCard Error:: ${error.message}`)
  }
}
