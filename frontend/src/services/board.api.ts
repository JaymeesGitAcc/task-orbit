import API from "./api"

export const getBoards = () => API.get("/api/boards")

export const createBoard = (data: { title: string; description?: string }) =>
  API.post("/api/boards", data)

export const deleteBoard = (boardId: string) => API.delete(`/api/boards/${boardId}`)

export const updateBoard = (
  boardId: string,
  data: {
    title?: string
    description?: string
    icon?: string
  },
) => API.patch(`/api/boards/${boardId}`, data)
