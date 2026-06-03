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
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import { useEffect, type ReactNode } from "react"

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
  children,
}: ResponsiveSidebarProps) => {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()
  const { pathname: path } = useLocation()

  useEffect(() => {
    if (open) {
      onOpenChange(false)
    }
  }, [path])

  return (
    <div className={className}>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden">
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

          <div>{children}</div>

          <SheetFooter>
            {user && (
              <Button
                onClick={() => {
                  logout(() => navigate("/"))
                }}
                variant="destructive"
                className="bottom-4 inset-x-3"
                size="lg"
              >
                <LogOut />
                Logout
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ResponsiveSidebar
