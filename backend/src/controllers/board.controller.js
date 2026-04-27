import Board from "../models/board.model.js"
import { sendError, sendSuccess } from "../utils/response.js"

export const createBoard = async (req, res) => {
  try {
    const { title } = req.body

    if (!title.trim()) {
      return sendError(res, 400, "Title is required")
    }

    const board = await Board.create({ title })

    return sendSuccess(res, 201, "Board created successfully", board)
  } catch (error) {
    return sendError(res, 500, `createBoard Error :: ${error.message}`)
  }
}

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find().sort({createAt: -1})
    return sendSuccess(res, 200, "Boards fetched Successfully", boards)
  } catch (error) {
    return sendError(res, 500, `getBoards Error :: ${error.message}`)
  }
}

