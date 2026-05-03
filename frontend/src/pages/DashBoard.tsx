import { useEffect, useState } from "react"
import { getBoards, createBoard } from "../services/board.api"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"

const DashBoard = () => {
  const [boards, setBoards] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const res = await getBoards()
      setBoards(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateBoard = async () => {
    if (!title.trim()) return

    try {
      const res = await createBoard(title)
      setBoards([res.data.data, ...boards])
      setTitle("")
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Boards</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>

      {/* Create Board */}
      <div className="mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New board"
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleCreateBoard}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Create
        </button>
      </div>

      {/* Boards List */}
      <div className="grid grid-cols-3 gap-4">
        {boards.map((board) => (
          <div
            key={board._id}
            onClick={() => navigate(`/board/${board._id}`)}
            className="bg-gray-200 p-4 rounded cursor-pointer"
          >
            {board.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashBoard
