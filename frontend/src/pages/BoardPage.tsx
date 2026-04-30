import { useEffect, useState } from "react"
import API from "../services/api"
import type { Card, List } from "../types"
import {
  createCard,
  deleteCard,
  getCardsByList,
  moveCard,
} from "../services/card.api"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { createList, deleteList } from "../services/list.api"

const BoardPage = () => {
  const [lists, setLists] = useState<List[]>([])
  const [cards, setCards] = useState<Record<string, Card[]>>({})
  const [newListTitle, setNewListTitle] = useState("")
  const [newCardTitle, setNewCardTitle] = useState<Record<string, string>>({})
  const boardId = "69eb92cf7757ed06d8dd82e6"

  const fetchLists = async () => {
    const res = await API.get(`/lists/${boardId}`)
    const listsData = res.data.data
    setLists(listsData)

    // Parallel requests
    const cardPromises = listsData.map((list: List) => getCardsByList(list._id))

    const cardResponses = await Promise.all(cardPromises)

    const cardsMap: Record<string, Card[]> = {}

    listsData.forEach((list: List, index: number) => {
      cardsMap[list._id] = cardResponses[index].data.data
    })

    setCards(cardsMap)
  }

  const handleDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    const sourceListId = source.droppableId
    const targetListId = destination.droppableId

    const sourceCards = [...cards[sourceListId]]
    const targetCards = [...cards[targetListId]]

    // SAME LIST
    if (sourceListId === targetListId) {
      const [movedCard] = sourceCards.splice(source.index, 1)
      sourceCards.splice(destination.index, 0, movedCard)

      // update order
      const updated = sourceCards.map((card, index) => ({
        ...card,
        order: index,
      }))

      setCards({
        ...cards,
        [sourceListId]: updated,
      })
    } else {
      // DIFFERENT LIST

      const [movedCard] = sourceCards.splice(source.index, 1)

      movedCard.listId = targetListId

      targetCards.splice(destination.index, 0, movedCard)

      const updatedSource = sourceCards.map((card, index) => ({
        ...card,
        order: index,
      }))

      const updatedTarget = targetCards.map((card, index) => ({
        ...card,
        order: index,
      }))

      setCards({
        ...cards,
        [sourceListId]: updatedSource,
        [targetListId]: updatedTarget,
      })
    }

    try {
      await moveCard(draggableId, targetListId, destination.index)
    } catch (error) {
      console.error(error)
      // optional: revert UI later
    }
  }

  const handleAddList = async () => {
    if (!newListTitle.trim()) return

    try {
      const res = await createList(newListTitle, boardId)
      const newList = res.data.data
      console.log(newList)

      setLists([...lists, newList])
      setCards({
        ...cards,
        [newList._id]: [],
      })
      setNewListTitle("")
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddCard = async (listId: string) => {
    const title = newCardTitle[listId]
    if (!title?.trim()) return

    try {
      const res = await createCard(title, listId)
      const newCard = res.data.data

      const updatedListCards = [...(cards[listId] || []), newCard]

      setCards({
        ...cards,
        [listId]: updatedListCards,
      })

      setNewCardTitle({
        ...newCardTitle,
        [listId]: "",
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteCard = async (cardId: string, listId: string) => {
    try {
      await deleteCard(cardId)

      const updatedCards = cards[listId].filter((card) => card._id !== cardId)

      // reindex locally
      const reOrdered = updatedCards.map((card, index) => ({
        ...card,
        order: index,
      }))

      setCards({
        ...cards,
        [listId]: reOrdered,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteList(listId)

      const updatedLists = lists.filter((list) => list._id !== listId)

      const updatedCards = { ...cards }
      delete updatedCards[listId]

      setLists(updatedLists)
      setCards(updatedCards)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchLists()
  }, [])

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 p-4 gap-4">
          {lists?.map((list) => (
            <Droppable droppableId={list._id} key={list._id}>
              {(provided) => (
                <div
                  key={list._id}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-200 p-4 rounded"
                >
                  <div className="flex justify-between">
                    <h2 className="font-bold">{list.title}</h2>
                    <button
                      onClick={() => handleDeleteList(list._id)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {cards[list._id]?.map((card, index) => (
                      <Draggable
                        key={card._id}
                        draggableId={card._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-2 rounded shadow flex justify-between items-center"
                          >
                            <span>{card.title}</span>
                            <button
                              onClick={() =>
                                handleDeleteCard(card._id, list._id)
                              }
                              className="text-red-500"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  <input
                    value={newCardTitle[list._id] || ""}
                    onChange={(e) =>
                      setNewCardTitle({
                        ...newCardTitle,
                        [list._id]: e.target.value,
                      })
                    }
                    placeholder="Add card"
                    className="border p-1 w-full rounded"
                  />

                  <button
                    onClick={() => handleAddCard(list._id)}
                    className="bg-green-500 text-white px-2 py-1 mt-1 rounded"
                  >
                    + Add Card
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <div className="min-w-[250px]">
        <input
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Add new list"
          className="border p-2 w-full rounded"
        />

        <button
          onClick={handleAddList}
          className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
        >
          + Add List
        </button>
      </div>
    </div>
  )
}

export default BoardPage
