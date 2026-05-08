import { getBoards } from "@/services/board.api"
import type { Board } from "@/types"
import { create } from "zustand"

type BoardsState = {
  boards: Board[]
  loading: boolean
  error: string | null
  fetchBoards: () => Promise<void>
  addBoard: (board: Board) => void
}

export const useBoardStore = create<BoardsState>((set) => ({
  boards: [],
  loading: true,
  error: null,
  addBoard: (board) =>
    set((state) => ({
      boards: [...state.boards, board],
    })),
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
}))
