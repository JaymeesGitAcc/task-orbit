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
import type { LabelData } from "@/types"
import { labelColors } from "@/constants/label-colors"

interface TaskCardProps {
  title: string
  description?: string
  createdAt?: string
  labels?: LabelData[]
  onDelete?: () => void
  onEdit?: () => void
  onOpen?: () => void
  classnames?: string
  children?: ReactNode
}

const TaskCard = ({
  title,
  description,
  createdAt,
  onOpen,
  labels = [],
  onDelete,
  onEdit,
  classnames,
  children,
}: TaskCardProps) => {
  const visibleLables = labels?.slice(0, 2) || []
  const remaining =
    visibleLables.length > 0 ? labels.length - visibleLables.length : 0

  const colorMeta = (val: string) => labelColors.find((c) => c.value === val)
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

      {description?.trim() && (
        <div className="text-[11px] text-gray-500 px-2">{description}</div>
      )}

      {labels && (
        <div className="px-2 flex gap-1 flex-wrap items-center">
          {visibleLables.map((l, i) => (
            <span
              key={l._id ?? i}
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${colorMeta(l.color)?.badge ?? "bg-gray-100 text-gray-700"}`}
            >
              {l.text}
            </span>
          ))}
          {remaining > 0 ? (
            <span className="text-[11px] text-gray-400 ml-1">
              +{remaining} more
            </span>
          ) : (
            ""
          )}
        </div>
      )}

      {createdAt && (
        <div className="px-2 border-t pt-2">
          <p className="text-[11px] text-gray-400">Created: {createdAt}</p>
        </div>
      )}
      {children}
    </Card>
  )
}

export default TaskCard
