import API from "./api"

export const getBoards = () => API.get("/boards")

export const createBoard = (data: { title: string; description?: string }) =>
  API.post("/boards", data)
