import { useEffect, useState } from "react"
import API from "../services/api"
import type { Card, List, UpdateCardPayload } from "../types"
import {
  createCard,
  deleteCard,
  getCardsByList,
  moveCard,
  updateCard,
} from "../services/card.api"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { createList, deleteList, moveList } from "../services/list.api"
import { useNavigate, useParams } from "react-router-dom"
import TaskCard from "@/components/TaskCard"
import TasksContainer from "@/components/TasksContainer"
import { useBoardStore } from "@/store/useBoardStore"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TaskModal from "@/components/TaskModal"

const BoardPage = () => {
  const [lists, setLists] = useState<List[]>([])
  const [cards, setCards] = useState<Record<string, Card[]>>({})
  const [newListTitle, setNewListTitle] = useState("")
  const [openCreateCard, setOpenCreateCard] = useState(false)
  const [openUpdateCard, setOpenUpdateCard] = useState(false)
  const [selectedListId, setSelectedListId] = useState<string>("")
  const [selectedCardId, setSelectedCardId] = useState<string>("")
  const { id: boardId } = useParams()
  const navigate = useNavigate()
  const { boards } = useBoardStore()

  const board = boards?.find((board) => board._id === boardId)
  const cardToUpdate = selectedListId.trim()
    ? cards[`${selectedListId}`].find((card) => card._id === selectedCardId)
    : null

  const fetchLists = async () => {
    try {
      const res = await API.get(`/lists/${boardId}`)
      const listsData = res.data.data
      setLists(listsData)

      const cardPromises = listsData.map((list: List) =>
        getCardsByList(list._id),
      )

      const cardResponses = await Promise.all(cardPromises)

      const cardsMap: Record<string, Card[]> = {}

      listsData.forEach((list: List, index: number) => {
        cardsMap[list._id] = cardResponses[index].data.data
      })

      setCards(cardsMap)
    } catch (error) {
      console.error(error)
      navigate("/boards")
    }
  }

  const handleDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    // Move List
    if (result.type === "LIST") {
      const newLists = Array.from(lists)
      const [moved] = newLists.splice(result.source.index, 1)
      newLists.splice(result.destination.index, 0, moved)

      // reassign order locally
      const updated = newLists.map((list, index) => ({
        ...list,
        order: index,
      }))

      setLists(updated)

      moveList(moved._id, result.destination.index)

      return
    }

    // Move Card
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

  const handleAddCard = async ({
    title,
    description,
    listId,
  }: {
    title: string
    description?: string
    listId: string
  }) => {
    if (!title.trim()) return
    if (!listId) return
    if (!boardId) return

    try {
      const res = await createCard({
        title,
        description,
        listId,
        boardId,
      })

      const newCard = res.data.data

      setCards((prev) => ({
        ...prev,
        [listId]: [...(prev[listId] || []), newCard],
      }))
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

  const handleUpdateCard = async (cardId: string, data: UpdateCardPayload) => {
    if (!cardId?.trim()) return

    try {
      const res = await updateCard(cardId, data)
      const updatedCard = res.data.data

      setCards((prev) => ({
        ...prev,
        [selectedListId]: prev[selectedListId].map((card) =>
          card._id === cardId
            ? {
                ...card,
                ...updatedCard,
              }
            : card,
        ),
      }))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchLists()
  }, [boardId])

  return (
    <div>
      <div className="py-4">
        <h1 className="text-2xl font-semibold ">{board?.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {board?.description}
        </p>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              {lists?.map((list, index) => (
                <Draggable key={list._id} draggableId={list._id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      {/* Drag handle */}
                      <div {...provided.dragHandleProps}>
                        <Droppable droppableId={list._id} type="CARD">
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              <TasksContainer
                                title={list.title}
                                onDelete={() => handleDeleteList(list._id)}
                                classNames="rounded-lg p-4"
                              >
                                <div className="space-y-3">
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
                                        >
                                          <TaskCard
                                            title={card.title}
                                            createdAt={card.createdAt}
                                            onDelete={() =>
                                              handleDeleteCard(
                                                card._id,
                                                list._id,
                                              )
                                            }
                                            onEdit={() => {
                                              setOpenUpdateCard(true)
                                              setSelectedListId(list._id)
                                              setSelectedCardId(card._id)
                                            }}
                                          />
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                                <Button
                                  className="w-full bg-card text-gray-600 py-5 my-2"
                                  onClick={() => {
                                    setOpenCreateCard(true)
                                    setSelectedListId(list._id)
                                  }}
                                >
                                  <Plus className="text-gray-600" />
                                  Add Task
                                </Button>
                              </TasksContainer>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
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
      <TaskModal
        open={openCreateCard}
        onClose={() => setOpenCreateCard(false)}
        onSubmit={(data) =>
          handleAddCard({
            ...data,
            listId: selectedListId,
          })
        }
      />
      {cardToUpdate ? (
        <TaskModal
          open={openUpdateCard}
          onClose={() => setOpenUpdateCard(false)}
          initialData={{
            title: cardToUpdate.title,
            description: cardToUpdate.description || "",
          }}
          onSubmit={(data) => handleUpdateCard(selectedCardId, data)}
        />
      ) : null}
    </div>
  )
}

export default BoardPage
