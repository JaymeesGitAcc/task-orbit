import API from "./api"

export const getCardsByList = async (listId: string) => {
  return API.get(`/cards/${listId}`)
}

export const moveCard = (
  cardId: string,
  targetListId: string,
  targetOrder: number,
) => {
  return API.put(`/cards/${cardId}/move`, {
    targetListId,
    targetOrder,
  })
}

export const createCard = (
  title: string,
  listId: string,
  description: string = "",
) => {
  return API.post("/cards", { title, listId, description })
}

export const deleteCard = (cardId: string) => {
  return API.delete(`/cards/${cardId}`)
}
