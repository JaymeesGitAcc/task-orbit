import API from "./api"

export const getBoards = () => API.get("/boards")

export const createBoard = (data: { title: string; description?: string }) =>
  API.post("/boards", data)

export const deleteBoard = (boardId: string) => API.delete(`/boards/${boardId}`)

export const updateBoard = (
  boardId: string,
  data: {
    title?: string
    description?: string
    icon?: string
  },
) => API.patch(`/boards/${boardId}`, data)
