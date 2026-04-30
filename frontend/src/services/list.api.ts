import API from "./api"

export const createList = (title: string, boardId: string) => {
  return API.post("/lists", { title, boardId })
}

export const deleteList = (listId: string) => {
  return API.delete(`/lists/${listId}`)
}
