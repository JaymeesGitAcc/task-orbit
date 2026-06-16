import Board from "../models/board.model.js"
import Card from "../models/card.model.js"
import List from "../models/list.model.js"
import User from "../models/user.model.js"
import { generateBoardAnalysis } from "../services/ai.service.js"
import { buildBoardAnalysisPrompt } from "../utils/buildBoardAnalysisPrompt.js"
import { sendError, sendSuccess } from "../utils/response.js"

export const createBoard = async (req, res) => {
  try {
    const userId = req.user?.id
    const { title, description, icon } = req.body

    if (!title || !title.trim()) {
      return sendError(res, 400, "Title is required")
    }

    const board = await Board.create({
      title: title.trim(),
      description: description?.trim() || "",
      icon,
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

export const deleteBoard = async (req, res) => {
  const userId = req.user.id
  const { boardId } = req.params
  try {
    const board = await Board.findOne({
      _id: boardId,
      userId,
    })

    if (!board) return sendError(res, 404, "Board not found")

    await Card.deleteMany({ boardId })
    await List.deleteMany({ boardId })
    await Board.findByIdAndDelete(boardId)

    return sendSuccess(res, 200, "Board deleted Successfully")
  } catch (error) {
    return sendError(res, 500, `deleteBoard Error :: ${error.message}`)
  }
}

export const updateBoard = async (req, res) => {
  const userId = req.user.id
  const { boardId } = req.params
  try {
    const updatedBoard = await Board.findOneAndUpdate(
      {
        userId,
        _id: boardId,
      },
      req.body,
      { returnDocument: "after", runValidators: true },
    )
    if (!updatedBoard) {
      return sendError(res, 404, "Board not found", {
        message: "Board not found",
        success: false,
      })
    }
    return sendSuccess(res, 200, "Board Updated Successfully", updatedBoard)
  } catch (error) {
    return sendError(res, 500, `Internal Server Error:: ${error.message}`)
  }
}

export const getBoardInsights = async (req, res) => {
  const { boardId } = req.params
  const userId = req.user.id

  if (!boardId) {
    return sendError(res, 400, "BoardId missing", {
      success: false,
      message: "BoardId missing",
    })
  }

  try {
    const board = await Board.findOne({
      _id: boardId,
      userId,
    })

    if (!board) {
      return sendError(res, 404, "Board not found", {
        success: false,
        message: "Board not found",
      })
    }

    const [lists, cards] = await Promise.all([
      List.find({ boardId }),
      Card.find({ boardId }),
    ])

    const totalLists = lists.length
    const totalTasks = cards.length

    const getISTDateString = (date) =>
      new Date(date).toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      })

    const today = getISTDateString(new Date())

    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekString = getISTDateString(nextWeek)

    const overdueTasks = cards.filter(
      (card) => card.dueDate && getISTDateString(card.dueDate) < today,
    ).length

    const dueToday = cards.filter(
      (card) => card.dueDate && getISTDateString(card.dueDate) === today,
    ).length

    const dueThisWeek = cards.filter((card) => {
      if (!card.dueDate) return false

      const dueDate = getISTDateString(card.dueDate)

      return dueDate >= today && dueDate <= nextWeekString
    }).length

    const tasksPerList = lists.map((list) => ({
      listId: list._id,
      listName: list.title,
      taskCount: cards.filter(
        (card) => card.listId.toString() === list._id.toString(),
      ).length,
    }))

    return sendSuccess(res, 200, "Board insights fetched", {
      boardName: board.title,
      totalLists,
      totalTasks,
      overdueTasks,
      dueToday,
      dueThisWeek,
      tasksPerList,
    })
  } catch (error) {
    console.error("Get Board Insights Error:", error)

    return sendError(res, 500, "Internal Server Error", {
      success: false,
      message: "Internal Server Error",
    })
  }
}

export const getBoardAnalysis = async (req, res) => {
  const { boardId } = req.params
  const userId = req.user.id

  if (!boardId) {
    return sendError(res, 400, "BoardId missing", {
      success: false,
      message: "BoardId missing",
    })
  }

  try {
    const board = await Board.findOne({
      _id: boardId,
      userId,
    })

    if (!board) {
      return sendError(res, 404, "Board not found", {
        success: false,
        message: "Board not found",
      })
    }

    const [lists, cards] = await Promise.all([
      List.find({ boardId }),
      Card.find({ boardId }),
    ])

    const listMap = {}

    lists.forEach((list) => {
      listMap[list._id.toString()] = list.title
    })

    const totalLists = lists.length
    const totalTasks = cards.length

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    const nextWeek = new Date(startOfToday)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const overdueTasks = cards.filter(
      (card) => card.dueDate && card.dueDate < startOfToday,
    ).length

    const dueToday = cards.filter(
      (card) =>
        card.dueDate &&
        card.dueDate >= startOfToday &&
        card.dueDate <= endOfToday,
    ).length

    const dueThisWeek = cards.filter(
      (card) =>
        card.dueDate &&
        card.dueDate >= startOfToday &&
        card.dueDate <= nextWeek,
    ).length

    const tasksPerList = lists.map((list) => ({
      listId: list._id,
      listName: list.title,
      taskCount: cards.filter(
        (card) => card.listId.toString() === list._id.toString(),
      ).length,
    }))

    const tasksWithoutDueDate = cards.filter((card) => !card.dueDate).length

    const aiPayload = {
      boardTitle: board.title,
      boardDescription: board.description || "",

      totalTasks,
      overdueTasks,
      dueToday,
      dueThisWeek,
      tasksWithoutDueDate,

      lists: lists.map((list) => ({
        title: list.title,
      })),

      tasks: cards.map((card) => ({
        title: card.title,
        description: card.description?.slice(0, 300) || "",
        listName: listMap[card.listId.toString()] || "Unknown",
        labels: card.labels.map((label) => label.text),
        dueDate: card.dueDate || null,
      })),
    }

    const prompt = buildBoardAnalysisPrompt(aiPayload)

    const analysisText = await generateBoardAnalysis(prompt)

    let analysis

    try {
      analysis = JSON.parse(analysisText)
    } catch (error) {
      return sendError(res, 500, "Failed to parse AI response", {
        success: false,
        message: "Failed to parse AI response",
      })
    }

    return sendSuccess(res, 200, "Board analysis generated", analysis)
  } catch (error) {
    console.error("Get Board Analysis Error:", error)

    if (error.status === 429) {
      return sendError(res, 429, "AI analysis limit reached", {
        success: false,
        message: "AI analysis limit reached. Please try again later.",
      })
    }

    return sendError(res, 500, "Internal Server Error", {
      success: false,
      message: "Internal Server Error",
    })
  }
}
