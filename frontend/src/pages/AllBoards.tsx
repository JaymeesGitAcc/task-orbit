import BoardModal from "@/components/BoardModal"
import CustomCard from "@/components/CustomCard"
import DeleteDialog from "@/components/DeleteDialog"
import EmptyState from "@/components/EmptyState"
import CardSkeleton from "@/components/skeletons/CardSkeleton"
import { Button } from "@/components/ui/button"
import { useBoardStore } from "@/store/useBoardStore"
import type { Board } from "@/types"
import { limitText } from "@/utils/limtText"
import { LayoutGrid, Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const AllBoards = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [boardToUpdate, setBoardToUpdate] = useState<Board | null>(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [boardId, setBoardId] = useState<string | number>("")
  const [isDeleting, setIsDeleting] = useState(false)
  const { boards, addBoard, delBoard, editBoard, loading } = useBoardStore()
  const navigate = useNavigate()

  const handleCreateBoard = async (data: {
    title: string
    icon: string
    description?: string
  }) => {
    setIsCreating(true)
    try {
      const res = await addBoard(data)
      if (res) {
        toast.success("Board Created!")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to create board")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteBoard = async (boardId: string | number) => {
    setIsDeleting(true)
    if (!boardId) return
    try {
      const res = await delBoard(String(boardId))
      if (res) {
        toast.success("Board deleted!")
      }
    } catch (error) {
      toast.error("Failed to delete board")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateBoard = async (
    boardId: string,
    data: {
      title?: string
      description?: string
      icon?: string
    },
  ) => {
    setIsUpdating(true)
    try {
      const res = await editBoard(boardId, data)
      if (res.data.data.success) {
        toast.success("Board Updated!")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to Update board")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="px-8">
      <div className="flex items-center gap-2 justify-between">
        <h1 className="text-lg md:text-2xl font-semibold">Boards</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setOpenCreateModal(true)}
            size="lg"
          >
            <Plus />
            <span className="hidden md:inline">Create Board</span>
          </Button>
        </div>
      </div>

      <div className="py-4 space-y-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <EmptyState
              icon={<LayoutGrid className="w-6 h-6 text-gray-400" />}
              title={
                boards.length ? "Add New Board" : "Create your first board"
              }
              description={
                boards.length ? "Add a new board to your list" : "Create Board"
              }
              action={
                <Button size="lg" onClick={() => setOpenCreateModal(true)}>
                  <Plus />
                  {boards.length ? "Add Board" : "Create Board"}
                </Button>
              }
            />

            {boards.map((board) => (
              <CustomCard
                key={board._id}
                title={board.title}
                description={limitText(board.description)}
                icon={board.icon}
                createdAt={board.createdAt}
                id={board._id}
                onOpen={() => navigate(`/app/boards/${board._id}`)}
                onDelete={() => {
                  setBoardId(board._id)
                  setOpenDelete(true)
                }}
                onEdit={() => {
                  setOpenEditModal(true)
                  setBoardToUpdate(board)
                }}
              />
            ))}
          </>
        )}
      </div>
      <BoardModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        creating={isCreating}
        onSubmit={handleCreateBoard}
      />
      <BoardModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        creating={isUpdating}
        board={boardToUpdate}
        editFn={handleUpdateBoard}
      />
      <DeleteDialog
        type="board"
        open={openDelete}
        loading={isDeleting}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => handleDeleteBoard(boardId)}
      />
    </div>
  )
}

export default AllBoards
