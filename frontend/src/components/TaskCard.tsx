import type { ReactNode } from "react"
import { Card } from "./ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { MoreVertical } from "lucide-react"
import { formatDate } from "@/utils/formatDate"

interface TaskCardProps {
  title: string
  createdAt?: string
  onDelete?: () => void
  onEdit?: () => void
  onOpen?: () => void
  classnames?: string
  children?: ReactNode
}

const TaskCard = ({
  title,
  createdAt,
  onOpen,
  onDelete,
  onEdit,
  classnames,
  children,
}: TaskCardProps) => {
  return (
    <Card
      className={`rounded-lg shadow-sm border border-gray-200 bg-card ${classnames}`}
    >
      <div className="px-2 flex gap-3 items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpen}>Open</DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {createdAt && (
        <div className="px-2 border-t pt-2">
          <p className="text-[11px] text-gray-400">
            {formatDate(createdAt)}
          </p>
        </div>
      )}
      {children}
    </Card>
  )
}

export default TaskCard
