import { MoreHorizontal, LayoutGrid } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/utils/formatDate"
import { Link } from "react-router-dom"

interface TaskCardProps {
  icon?: React.ReactNode
  id?: string
  title: string
  description?: string
  createdAt?: string
  onEdit?: () => void
  onDelete?: () => void
  onOpen?: () => void
  classnames?: string
}

const CustomCard = ({
  icon = <LayoutGrid className="w-5 h-5 text-indigo-500" />,
  id,
  title,
  description,
  createdAt,
  onEdit,
  onDelete,
  onOpen,
  classnames
}: TaskCardProps) => {
  return (
    <Card className={`rounded-2xl shadow-sm border border-gray-200 bg-card ${classnames}`}>
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          <div className="bg-indigo-50 p-2 rounded-lg">{icon}</div>
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
              <DropdownMenuItem onClick={onOpen}>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title & Description */}
        <div>
          {id ? (
            <Link
              to={`/boards/${id}`}
              className="text-base font-semibold text-gray-900"
            >
              {title}
            </Link>
          ) : (
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          )}
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>

        {/* Footer */}

        {createdAt && (
          <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
            {formatDate(createdAt)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default CustomCard
