import Logo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { useBoardStore } from "@/store/useBoardStore"
import { ArrowRight, Grid, LogOut } from "lucide-react"
import { useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"

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
  const location = useLocation()
  const { pathname: path } = location

  const hasMore = boards?.length && boards?.length > 4 ? true : false
  const boardList = hasMore ? boards?.slice(0, 4) : boards

  useEffect(() => {
    fetchBoards()
  }, [])

  return (
    <div className="h-screen">
      <div className="h-full border flex">
        <aside className="bg-sidebar w-[20%]">
          <div className="px-4 py-6">
            <Logo />
          </div>

          <div className="p-4 space-y-1">
            <Link
              to="/boards"
              className={`flex w-full items-center duration-150  text-semibold gap-2 px-2 py-3 rounded-md hover:bg-primary/5 ${
                path === "/boards" ? "text-primary bg-primary/10" : ""
              }`}
            >
              <Grid size={18} />
              <span>Boards</span>
            </Link>
            <Link
              to="/settings"
              className={`flex w-full items-center duration-150  text-semibold gap-2 px-2 py-3 rounded-md hover:bg-primary/5 ${
                path === "/settings" ? "text-primary bg-primary/10" : ""
              }`}
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
              {boardList?.map((board) => (
                <Link
                  to={`/boards/${board._id}`}
                  key={board._id}
                  className={`flex w-full items-center duration-150 text-semibold gap-2 px-2 py-3 rounded-md hover:bg-primary/5 ${
                    path === `/boards/${board._id}`
                      ? "text-primary bg-primary/10"
                      : ""
                  }`}
                >
                  <Grid size={18} />
                  <span>{formatBoardTitle(board.title)}</span>
                </Link>
              ))}
              {hasMore ? (
                <Link
                  to="/boards"
                  className="flex w-full items-center duration-150 text-semibold gap-2 px-2 py-3 rounded-md hover:bg-primary/5 hover:gap-3"
                >
                  More <ArrowRight className="w-4 h-4" />
                </Link>
              ) : null}
              <Button
                onClick={() => {
                  logout(() => navigate("/login"))
                }}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                <LogOut />
                Logout
              </Button>
            </div>
          </div>
        </aside>
        <section className="w-[80%] p-8">
          {/* Placeholder component for nested routing */}
          <Outlet />
        </section>
      </div>
    </div>
  )
}

export default DashBoardLayout
