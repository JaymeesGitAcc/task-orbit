export interface Card {
  _id: string
  title: string
  description?: string
  labels?: LabelData[]
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

export interface LabelData {
  _id?: string
  text: string
  color: string
}

export interface CreateCardPayload {
  title: string
  listId: string | undefined
  boardId: string | undefined
  description?: string
  labels?: LabelData[]
}

export interface UpdateCardPayload {
  title: string
  description?: string
  labels?: LabelData[]
}
