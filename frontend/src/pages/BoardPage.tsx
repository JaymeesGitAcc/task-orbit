import { useEffect, useState } from "react"
import API from "../services/api"
import type {
  Card,
  CreateCardPayload,
  List,
  ModalModes,
  UpdateCardPayload,
} from "../types"
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
import { ListIcon, Plus } from "lucide-react"
import TaskModal from "@/components/TaskModal"
import { limitText } from "@/utils/limtText"
import { formatDate } from "@/utils/formatDate"
import DeleteDialog from "@/components/DeleteDialog"
import ListModal from "@/components/ListModal"
import { toast } from "sonner"
import EmptyState from "@/components/EmptyState"
import { format } from "date-fns"
import ListSkeleton from "@/components/skeletons/ListSkeleton"

const BoardPage = () => {
  const [lists, setLists] = useState<List[]>([])
  const [listsLoading, setListsLoading] = useState(false)
  const [cards, setCards] = useState<Record<string, Card[]>>({})
  const [selectedListId, setSelectedListId] = useState<string>("")
  const [selectedCardId, setSelectedCardId] = useState<string>("")
  const [openModal, setOpenModal] = useState(false)
  const [mode, setMode] = useState<ModalModes>("create")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteDialogType, setDeleteDialogType] = useState<"list" | "card">(
    "list",
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [openListModal, setOpenListModal] = useState(false)
  const [isCreatingList, setIsCreatingList] = useState(false)

  const { id: boardId } = useParams()
  const { boards } = useBoardStore()
  const navigate = useNavigate()

  const board = boards?.find((board) => board._id === boardId)
  const cardDetails = cards[`${selectedListId}`]?.find(
    (card) => card._id === selectedCardId,
  )

  const fetchLists = async () => {
    setListsLoading(true)
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
    } finally {
      setListsLoading(false)
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

  const handleAddList = async ({
    title,
    boardId,
  }: {
    title: string
    boardId: string | undefined
  }) => {
    if (!title.trim()) return
    if (!boardId) return

    setIsCreatingList(true)

    try {
      const res = await createList(title, boardId)
      const newList = res.data.data
      console.log(newList)

      setLists([...lists, newList])
      setCards({
        ...cards,
        [newList._id]: [],
      })
      toast.success("List created")
    } catch (err) {
      console.error(err)
      toast.error("Error: Something went wrong")
    } finally {
      setIsCreatingList(false)
    }
  }

  const handleAddCard = async ({
    title,
    description,
    listId,
    boardId,
    labels,
    dueDate,
  }: CreateCardPayload) => {
    if (!title.trim()) return
    if (!listId) return
    if (!boardId) return

    try {
      const res = await createCard({
        title,
        description,
        listId,
        boardId,
        labels,
        dueDate,
      })

      const newCard = res.data.data

      setCards((prev) => ({
        ...prev,
        [listId]: [...(prev[listId] || []), newCard],
      }))
      toast.success("Task Created Successfully!")
    } catch (err) {
      toast.error("Something went wrong")
      console.error(err)
    }
  }

  const handleDeleteCard = async (cardId: string, listId: string) => {
    setIsDeleting(true)
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
      toast.success("Task Deleted Successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateCard = async (cardId: string, data: UpdateCardPayload) => {
    if (!cardId) return

    try {
      const res = await updateCard(cardId, {
        ...data,
        dueDate: data.dueDate || null,
      })
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
      toast.success("Task Updated Successfully")
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  const handleDeleteList = async (listId: string) => {
    setIsDeleting(true)
    try {
      await deleteList(listId)

      const updatedLists = lists.filter((list) => list._id !== listId)

      const updatedCards = { ...cards }
      delete updatedCards[listId]

      setLists(updatedLists)
      setCards(updatedCards)
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenModal = ({
    modalMode,
    cardId,
    listId,
  }: {
    modalMode: ModalModes
    cardId?: string
    listId?: string
  }) => {
    setOpenModal(true)
    setMode(modalMode)

    switch (modalMode) {
      case "edit": {
        if (cardId) setSelectedCardId(cardId)
        if (listId) setSelectedListId(listId)
        return
      }
      case "view": {
        if (cardId) setSelectedCardId(cardId)
        if (listId) setSelectedListId(listId)
        return
      }
      case "create": {
        if (listId) setSelectedListId(listId)
        return
      }
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedCardId("")
    setSelectedListId("")
  }

  const openDeleteDialog = ({
    type,
    listId,
    cardId,
  }: {
    type: "list" | "card"
    listId?: string
    cardId?: string
  }) => {
    setShowDeleteDialog(true)
    setDeleteDialogType(type)
    switch (type) {
      case "card": {
        if (cardId) setSelectedCardId(cardId)
        if (listId) setSelectedListId(listId)
        return
      }
      case "list": {
        if (listId) setSelectedListId(listId)
        return
      }
    }
  }

  useEffect(() => {
    fetchLists()
  }, [boardId])

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 my-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold ">{board?.title}</h1>
          <Button onClick={() => setOpenListModal(true)}>
            <ListIcon />
            Add List
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {board?.description}
        </p>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 px-8 pb-8">
        {!listsLoading ? (
          <>
            {!lists.length ? (
              <EmptyState
                classNames="w-50"
                icon={<ListIcon size={18} />}
                title="No List"
                action={
                  <>
                    <Button onClick={() => setOpenListModal(true)}>
                      <Plus />
                      Add List
                    </Button>
                  </>
                }
              />
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable
                  droppableId="all-lists"
                  direction="horizontal"
                  type="LIST"
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex gap-4"
                    >
                      {lists?.map((list, index) => (
                        <Draggable
                          key={list._id}
                          draggableId={list._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="py-4"
                            >
                              {/* Drag handle */}
                              <div {...provided.dragHandleProps}>
                                <Droppable droppableId={list._id} type="CARD">
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className="w-[280px]"
                                    >
                                      <TasksContainer
                                        title={list.title}
                                        onDelete={() =>
                                          openDeleteDialog({
                                            type: "list",
                                            listId: list._id,
                                          })
                                        }
                                        onAddTask={() => {
                                          handleOpenModal({
                                            modalMode: "create",
                                            listId: list._id,
                                          })
                                        }}
                                        classNames="p-4 rounded-lg"
                                      >
                                        <div className="space-y-3">
                                          {cards[list._id]?.map(
                                            (card, index) => (
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
                                                      labels={card.labels}
                                                      description={limitText(
                                                        card.description,
                                                        30,
                                                      )}
                                                      dueDate={
                                                        card.dueDate
                                                          ? `${format(String(card.dueDate), "MMM d, yy")}`
                                                          : undefined
                                                      }
                                                      createdAt={formatDate(
                                                        card.createdAt,
                                                      )}
                                                      onDelete={() =>
                                                        openDeleteDialog({
                                                          type: "card",
                                                          listId: list._id,
                                                          cardId: card._id,
                                                        })
                                                      }
                                                      onEdit={() =>
                                                        handleOpenModal({
                                                          modalMode: "edit",
                                                          listId: list._id,
                                                          cardId: card._id,
                                                        })
                                                      }
                                                      onOpen={() =>
                                                        handleOpenModal({
                                                          modalMode: "view",
                                                          listId: list._id,
                                                          cardId: card._id,
                                                        })
                                                      }
                                                    />
                                                  </div>
                                                )}
                                              </Draggable>
                                            ),
                                          )}
                                          {provided.placeholder}
                                        </div>
                                        <Button
                                          className="w-full bg-card text-gray-600 py-5 my-2"
                                          onClick={() =>
                                            handleOpenModal({
                                              modalMode: "create",
                                              listId: list._id,
                                            })
                                          }
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
            )}
          </>
        ) : (
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListSkeleton key={i} />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        open={openModal}
        onClose={handleCloseModal}
        cardData={mode !== "create" ? cardDetails : undefined}
        readOnly={mode === "view"}
        onSubmit={
          mode === "create"
            ? (data) =>
                handleAddCard({
                  ...data,
                  listId: selectedListId,
                  boardId,
                })
            : mode === "edit"
              ? (data) => handleUpdateCard(selectedCardId, data)
              : undefined
        }
      />

      <DeleteDialog
        open={showDeleteDialog}
        type={deleteDialogType}
        loading={isDeleting}
        onConfirm={
          deleteDialogType === "card"
            ? () => handleDeleteCard(selectedCardId, selectedListId)
            : () => handleDeleteList(selectedListId)
        }
        onClose={() => setShowDeleteDialog(false)}
      />

      <ListModal
        open={openListModal}
        onClose={() => setOpenListModal(false)}
        onSubmit={(data) => {
          handleAddList({
            title: data.title,
            boardId,
          })
        }}
        inProgress={isCreatingList}
      />
    </div>
  )
}

export default BoardPage
