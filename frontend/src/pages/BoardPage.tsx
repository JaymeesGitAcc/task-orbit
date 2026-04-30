import { useEffect, useState } from "react"
import API from "../services/api"
import type { Card, List } from "../types"
import { getCardsByList, moveCard } from "../services/card.api"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"

const BoardPage = () => {
  const [lists, setLists] = useState<List[]>([])
  const [cards, setCards] = useState<Record<string, Card[]>>({})

  const fetchLists = async () => {
    const boardId = "69eb92cf7757ed06d8dd82e6"

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

  useEffect(() => {
    fetchLists()
  }, [])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4">
        {lists?.map((list) => (
          <Droppable droppableId={list._id} key={list._id}>
            {(provided) => (
              <div
                key={list._id}
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-200 p-4 w-64 rounded"
              >
                <h2 className="font-bold">{list.title}</h2>
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
                          className="bg-white p-2 rounded shadow"
                        >
                          {card.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}

export default BoardPage
