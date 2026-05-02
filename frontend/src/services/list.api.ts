import API from "./api"

export const createList = (title: string, boardId: string | undefined) => {
  return API.post("/lists", { title, boardId })
}

export const deleteList = (listId: string) => {
  return API.delete(`/lists/${listId}`)
}

export const moveList = (listId: string, targetOrder: number) =>
  API.patch(`/lists/${listId}/move`, { targetOrder })
