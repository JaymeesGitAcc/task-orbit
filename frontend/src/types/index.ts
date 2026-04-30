export interface Card {
  _id: string
  title: string
  description?: string
  listId: string
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
  createdAt?: string
  updatedAt?: string
}
