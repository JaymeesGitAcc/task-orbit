import List from "../models/list.model.js"
import { sendSuccess, sendError } from "../utils/response.js"

export const createList = async (req, res) => {
  try {
    const { title, boardId } = req.body

    if (!title || !boardId) {
      return sendError(res, 400, "Title and boardId are required")
    }

    const lastList = await List.findOne({ boardId }).sort({ order: -1 })

    const newOrder = lastList ? lastList.order + 1 : 0

    const list = await List.create({
      title,
      boardId,
      order: newOrder,
    })

    return sendSuccess(res, 201, "List created successfully", list)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const getListsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params

    const lists = await List.find({ boardId }).sort({ order: 1 })

    return sendSuccess(res, 200, "Lists fetched successfully", lists)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

