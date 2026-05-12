import BoardModal from "@/components/BoardModal"
import CustomCard from "@/components/CustomCard"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { useBoardStore } from "@/store/useBoardStore"
import type { Board } from "@/types"
import { limitText } from "@/utils/limtText"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const AllBoards = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [boardToUpdate, setBoardToUpdate] = useState<Board | null>(null)
  const { boards, addBoard, delBoard, editBoard } = useBoardStore()
  const { user } = useAuthStore()
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

  const handleDeleteBoard = async (boardId: string) => {
    if (!boardId) return
    try {
      const res = await delBoard(boardId)
      if (res) {
        toast.success("Board deleted!")
      }
    } catch (error) {
      toast.error("Failed to delete board")
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
    <div>
      <div className="flex items-center gap-2 justify-between">
        <h1>Boards</h1>
        <div className="flex items-center gap-2">
          <Button size="lg" onClick={() => setOpenCreateModal(true)}>
            <Plus />
            Create Board
          </Button>
          <div className="h-11 w-11 rounded-full bg-slate-400 flex items-center justify-center">
            <p className="font-bold text-slate-100">
              {user?.name?.slice(0, 1)}
            </p>
          </div>
        </div>
      </div>

      <div className="py-4 space-y-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 md:grid-cols-3 lg:grid-cols-4">
        {boards?.map((board) => (
          <CustomCard
            key={board._id}
            title={board.title}
            description={limitText(board.description)}
            icon={board.icon}
            createdAt={board.createdAt}
            id={board._id}
            onOpen={() => navigate(`/boards/${board._id}`)}
            onDelete={() => handleDeleteBoard(board._id)}
            onEdit={() => {
              setOpenEditModal(true)
              setBoardToUpdate(board)
            }}
          />
        ))}
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
    </div>
  )
}

export default AllBoards
