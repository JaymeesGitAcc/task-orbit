import Logo from "@/components/Logo"
import { useAuthStore } from "@/store/useAuthStore"
import { useBoardStore } from "@/store/useBoardStore"
import { Grid } from "lucide-react"
import { useEffect } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"

const formatBoardTitle = (title: string) => {
  if (title.length > 18) {
    title = title.split("").slice(0, 15).join("") + "..."
  }
  return title
}

const DashBoardLayout = () => {
  const { boards, loading, fetchBoards } = useBoardStore()
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchBoards()
  }, [])

  return (
    <div className="h-screen">
      <div className="h-full border flex">
        <aside className="bg-sidebar w-[18%]">
          <div className="px-4 py-6">
            <Logo />
          </div>

          <div className="p-4 space-y-1">
            <Link
              to="/boards"
              className={`flex w-full items-center duration-150  text-semibold gap-2 px-2 py-3 rounded-md hover:bg-primary/5`}
            >
              <Grid size={18} />
              <span>Boards</span>
            </Link>
            <Link
              to="/settings"
              className={`flex w-full items-center duration-150  text-semibold gap-2 px-2 py-3 rounded-md hover:bg-primary/5 `}
            >
              <Grid size={18} />
              <span>Settings</span>
            </Link>
          </div>

          <div>
            <div className="px-4">
              <h2 className="font-bold">Your Boards</h2>
            </div>
            {loading && (
              <div className="p-4 space-y-1">
                {[...Array(5)].map((_, index) => (
                  <div
                    className="px-2 py-6 bg-slate-200 rounded-md animate-pulse"
                    key={index}
                  ></div>
                ))}
              </div>
            )}
            <div className="p-4 space-y-1">
              {boards?.map((board) => (
                <Link
                  to={`/boards/${board._id}`}
                  key={board._id}
                  className={`flex w-full items-center duration-150 text-semibold gap-2 px-2 py-3 rounded-md hover:bg-primary/5`}
                >
                  <Grid size={18} />
                  <span>{formatBoardTitle(board.title)}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
        <section className="grow p-8">
          {/* Placeholder component for nested routing */}
          <Outlet />
        </section>
      </div>
      <button
        onClick={() => {
          logout(() => navigate("/login"))
        }}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default DashBoardLayout
