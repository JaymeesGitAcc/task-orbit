import { LogOut, Menu } from "lucide-react"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Logo from "./Logo"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import { useEffect, type ReactNode } from "react"
import { useBoardStore } from "@/store/useBoardStore"
import { icons } from "@/constants/icons"
import { staticSideBarListItems } from "@/constants/sidebarListItems"
import { limitText } from "@/utils/limtText"

interface ResponsiveSidebarProps {
  open: boolean
  onOpenChange: (state: boolean) => void
  children?: ReactNode
  className?: string
}

const ResponsiveSidebar = ({
  open,
  onOpenChange,
  className = "",
}: ResponsiveSidebarProps) => {
  const { logout } = useAuthStore()
  const { boards } = useBoardStore()
  const navigate = useNavigate()
  const { pathname: path } = useLocation()

  const hasMore = boards?.length && boards?.length > 4 ? true : false

  const boardList = hasMore ? boards?.slice(0, 5) : boards

  useEffect(() => {
    if (open) {
      onOpenChange(false)
    }
  }, [path])

  return (
    <div className={className}>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" aria-describedby={undefined}>
          <SheetHeader>
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
          </SheetHeader>

          <div className="p-4 space-y-1">
            {staticSideBarListItems.map((item, index) => {
              const Icon = item.icon
              const navLink = (
                <Link
                  to={item.path}
                  key={index}
                  className={`flex w-full items-center duration-150 text-semibold gap-2 px-2 py-3 rounded-md hover:bg-primary/5 ${
                    path === item.path ? "text-primary bg-primary/10" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              )

              return navLink
            })}
          </div>

          <div className="border-t py-2">
            <div className="px-4">
              <h2 className="font-bold">Your Boards</h2>
            </div>
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
                    }`}
                  >
                    <Icon className="h-4 w-4" />

                    <span className="text-xs">{limitText(board.title, 30)}</span>
                  </Link>
                )
                return navLink
              })}
            </div>
          </div>

          <SheetFooter>
            <Button
              onClick={() => {
                logout(() => navigate("/login"))
              }}
              variant="destructive"
              className="absolute bottom-4 inset-x-3"
              size="lg"
            >
              <LogOut />
              Logout
              {/* {openSideBar && "Logout"} */}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ResponsiveSidebar
