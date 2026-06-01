import type { CreateCardPayload, UpdateCardPayload } from "@/types"
import API from "./api"

export const getCardsByList = async (listId: string) => {
  return API.get(`/api/cards/${listId}`)
}

export const moveCard = (
  cardId: string,
  targetListId: string,
  targetOrder: number,
) => {
  return API.put(`/api/cards/${cardId}/move`, {
    targetListId,
    targetOrder,
  })
}

export const createCard = (data: CreateCardPayload) => {
  return API.post("/api/cards", data)
}

export const deleteCard = (cardId: string) => {
  return API.delete(`/api/cards/${cardId}`)
}

export const updateCard = (cardId: string, data: UpdateCardPayload) => {
  return API.patch(`/api/cards/${cardId}`, data)
}
