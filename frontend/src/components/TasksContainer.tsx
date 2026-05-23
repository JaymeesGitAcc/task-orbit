import { MoreHorizontal } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import type { ReactNode } from "react"

interface TasksContainerProps {
  title?: string
  classNames?: string
  onAddTask?: () => void
  onEdit?: () => void
  onDelete?: () => void
  children?: ReactNode
}

const TasksContainer = ({
  title = "Some title",
  classNames,
  onEdit,
  onDelete,
  onAddTask,
  children,
  ...props
}: TasksContainerProps) => {
  return (
    <div className={`bg-muted ${classNames}`} {...props}>
      <div className="flex justify-between">
        <h2 className="font-bold">{title}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onAddTask}>Add Task</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              Delete List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default TasksContainer
