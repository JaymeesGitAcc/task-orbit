import Board from "../models/board.model.js"
import User from "../models/user.model.js"
import { sendError, sendSuccess } from "../utils/response.js"

export const createBoard = async (req, res) => {
  try {
    const userId = req.user?.id
    const { title } = req.body

    if (!title || !title.trim()) {
      return sendError(res, 400, "Title is required")
    }

    const board = await Board.create({
      title: title.trim(),
      userId,
    })

    return sendSuccess(res, 201, "Board created successfully", board)
  } catch (error) {
    return sendError(res, 500, `createBoard Error :: ${error.message}`)
  }
}

export const getBoards = async (req, res) => {
  try {
    const userId = req.user?.id
    const boards = await Board.find({ userId }).sort({ createdAt: -1 })
    return sendSuccess(res, 200, "Boards fetched successfully", boards)
  } catch (error) {
    return sendError(res, 500, `getBoards Error :: ${error.message}`)
  }
}

export const getBoardById = async (req, res) => {
  try {
    const userId = req.user.id
    const { boardId } = req.params

    const board = await Board.findOne({
      _id: boardId,
      userId,
    })

    if (!board) {
      return sendError(res, 404, "Board not found")
    }

    return sendSuccess(res, 200, "Board fetched", board)
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}
