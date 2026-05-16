export interface Card {
  _id: string
  title: string
  description?: string
  listId: string
  boardId: string
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface List {
  _id: string
  title: string
  boardId: string
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface Board {
  _id: string
  title: string
  description?: string
  icon?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCardPayload {
  title: string,
  listId: string,
  boardId: string
  description?: string
}

export interface UpdateCardPayload {
  title: string,
  description?: string
}
