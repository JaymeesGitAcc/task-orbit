import {
  createBoard,
  deleteBoard,
  getBoards,
  updateBoard,
} from "@/services/board.api"
import type { Board } from "@/types"
import { create } from "zustand"

type BoardsState = {
  boards: Board[]
  loading: boolean
  error: string | null
  fetchBoards: () => Promise<void>
  addBoard: (data: {
    title: string
    description?: string
    icon?: string
  }) => Promise<any>
  delBoard: (boardId: string) => Promise<any>
  editBoard: (
    boardId: string,
    data: { title?: string; description?: string; icon?: string },
  ) => Promise<any>
}

export const useBoardStore = create<BoardsState>((set) => ({
  boards: [],
  loading: true,
  error: null,
  fetchBoards: async () => {
    try {
      set({ loading: true })
      const res = await getBoards()
      set({ boards: res.data.data })
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Something went wrong!" })
    } finally {
      set({ loading: false })
    }
  },
  addBoard: async (data) => {
    try {
      const res = await createBoard(data)
      set((state) => ({
        boards: [res.data.data, ...state.boards],
      }))
      return res
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Something went wrong!" })
    }
  },
  delBoard: async (boardId) => {
    try {
      const res = await deleteBoard(boardId)
      set((state) => ({
        boards: state.boards.filter((board) => board._id !== boardId),
      }))
      return res
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Something went wrong!" })
    }
  },
  editBoard: async (boardId, data) => {
    try {
      const res = await updateBoard(boardId, data)
      set((state) => ({
        boards: state.boards.map((board) =>
          board._id === boardId
            ? {
                ...board,
                ...data,
              }
            : board,
        ),
      }))
      return res
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Something went wrong!" })
    }
  },
}))
