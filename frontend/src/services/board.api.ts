import API from "./api"

export const getBoards = () => API.get("/boards")

export const createBoard = (title: string) => API.post("/boards", { title })
