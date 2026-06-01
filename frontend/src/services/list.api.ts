import API from "./api"

export const createList = (title: string, boardId: string | undefined) => {
  return API.post("/api/lists", { title, boardId })
}

export const deleteList = (listId: string) => {
  return API.delete(`/api/lists/${listId}`)
}

export const moveList = (listId: string, targetOrder: number) =>
  API.patch(`/api/lists/${listId}/move`, { targetOrder })
