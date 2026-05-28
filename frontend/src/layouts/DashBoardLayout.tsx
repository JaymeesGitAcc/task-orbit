import CustomSelect from "@/components/CustomSelect"
import Logo from "@/components/Logo"
import ResponsiveSidebar from "@/components/ResponsiveSidebar"
import ToolTipped from "@/components/ToolTipped"
import { Button } from "@/components/ui/button"
import { icons } from "@/constants/icons"
import { staticSideBarListItems } from "@/constants/sidebarListItems"
import { useAuthStore } from "@/store/useAuthStore"
import { useBoardStore } from "@/store/useBoardStore"
import { limitText } from "@/utils/limtText"
import { ChevronsLeft, ChevronsRight, LayoutGrid, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"

const DashBoardLayout = () => {
  const [openSideBar, setOpenSideBar] = useState(true)
  const { boards, loading, fetchBoards } = useBoardStore()
  const [boardOption, setBoardOption] = useState("")
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname: path } = location

  const hasMore = boards?.length && boards?.length > 4 ? true : false
  const boardList = hasMore ? boards?.slice(0, 5) : boards
  const boardOptions = boards.map((board) => ({
    label: board.title,
    value: board._id,
  }))

  const LogoutButton = (
    <Button
      onClick={() => {
        logout(() => navigate("/login"))
      }}
      variant="destructive"
      className="absolute bottom-4 inset-x-3"
      size="lg"
    >
      <LogOut />
      {openSideBar && "Logout"}
    </Button>
  )

  useEffect(() => {
    const parts = path.split("/")
    setBoardOption(parts[2] ? parts[2] : "")
  }, [path])

  useEffect(() => {
    fetchBoards()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpenSideBar(false)
      } else {
        setOpenSideBar(true)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="md:h-screen max-w-[1440px] mx-auto">
      <div className="h-full border flex">
        <aside
          className={`hidden md:block bg-sidebar relative transition-all duration-300 ${openSideBar ? "w-74" : "w-20"}`}
        >
          <Button
            size="lg"
            variant="outline"
            className="bg-sidebar absolute border-none -right-7 top-6 rounded hover:bg-sidebar"
            onClick={() => setOpenSideBar((prev) => !prev)}
          >
            {openSideBar ? <ChevronsLeft /> : <ChevronsRight />}
          </Button>
          <div className="px-4 py-6">
            <Logo showAppName={openSideBar} />
          </div>

          <div className="p-4 space-y-1">
            {staticSideBarListItems.map((item, index) => {
              const Icon = item.icon
              const navLink = (
                <Link
                  to={item.path}
                  key={index}
                  className={`flex w-full items-center duration-150 text-semibold gap-2 px-2 py-3 rounded-md hover:bg-primary/5 ${
                    path === item.path ? "text-primary bg-primary/10" : ""
                  } ${!openSideBar ? "justify-center" : ""}`}
                >
                  <Icon size={18} />
                  {openSideBar && <span>{item.label}</span>}
                </Link>
              )

              return !openSideBar ? (
                <ToolTipped key={index} tooltipTrigger={navLink}>
                  {item.label}
                </ToolTipped>
              ) : (
                navLink
              )
            })}
          </div>

          <div className="border-t py-2">
            {boardList.length > 0 ? (
              openSideBar ? (
                <div className="px-4">
                  <h2 className="font-bold">Your Boards</h2>
                </div>
              ) : (
                <div className="flex items-center justify-center h-8 w-8 mx-auto bg-primary rounded-md">
                  <LayoutGrid className="text-secondary" size={18} />
                </div>
              )
            ) : null}

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
              {boardList?.map((board) => {
                const Icon = icons[`${board.icon}`]
                const navLink = (
                  <Link
                    to={`/boards/${board._id}`}
                    key={board._id}
                    className={`flex w-full items-center duration-150 text-semibold gap-2 px-2 py-3 rounded-md hover:bg-primary/5 ${
                      path === `/boards/${board._id}`
                        ? "text-primary bg-primary/10"
                        : ""
                    } ${!openSideBar ? "justify-center" : ""}`}
                  >
                    <Icon size={18} />
                    {openSideBar && <span>{limitText(board.title, 20)}</span>}
                  </Link>
                )
                return !openSideBar ? (
                  <ToolTipped key={board._id} tooltipTrigger={navLink}>
                    {board.title}
                  </ToolTipped>
                ) : (
                  navLink
                )
              })}
            </div>
            {!openSideBar ? (
              <ToolTipped tooltipTrigger={LogoutButton}>Logout</ToolTipped>
            ) : (
              LogoutButton
            )}
          </div>
        </aside>
        <section className="w-full min-h-screen flex flex-col overflow-hidden">
          {/* Placeholder component for nested routing */}
          <div className="px-8 py-5 flex-shrink-0">
            <div className="flex items-center justify-between gap-4">
              <ResponsiveSidebar
                open={openMobileMenu}
                onOpenChange={setOpenMobileMenu}
                className="md:hidden"
              />
              <div className="flex items-center justify-between gap-2 w-full">
                <CustomSelect
                  options={boardOptions}
                  value={boardOption}
                  onChange={(value) => {
                    setBoardOption(value)
                    navigate(`/boards/${value}`)
                  }}
                  placeholder="Select Board"
                  className="w-64"
                />
                <div className="h-11 w-11 rounded-full bg-slate-400 flex items-center justify-center">
                  <p className="font-bold text-slate-100">
                    {user?.name?.slice(0, 1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  )
}

export default DashBoardLayout
