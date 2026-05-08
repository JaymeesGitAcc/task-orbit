import CustomCard from "@/components/CustomCard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/store/useAuthStore"
import { useBoardStore } from "@/store/useBoardStore"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

const AllBoards = () => {
  const { boards } = useBoardStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex items-center gap-2 justify-between">
        <h1>Boards</h1>
        <div className="flex items-center gap-2">
          <Button size="lg">
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

      <div className="flex flex-wrap gap-4">
        {boards?.map((board) => (
          <CustomCard
            key={board._id}
            title={board.title}
            createdAt={board.createdAt}
            id={board._id}
            onOpen={() => navigate(`/boards/${board._id}`)}
          />
        ))}
        <Card className="border w-64 rounded-2xl flex items-center justify-center bg-transparent">
          <button className="flex items-center gap-1 text-primary">
            <Plus /> <span>Create</span>
          </button>
        </Card>
      </div>
    </div>
  )
}

export default AllBoards
