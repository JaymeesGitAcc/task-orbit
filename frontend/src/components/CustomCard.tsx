import { MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/utils/formatDate"
import { Link } from "react-router-dom"
import { icons } from "@/constants/icons"

interface TaskCardProps {
  id?: string
  title: string
  icon?: string
  description?: string
  createdAt?: string
  onEdit?: () => void
  onDelete?: () => void
  onOpen?: () => void
  classnames?: string
}

const CustomCard = ({
  icon = "folder",
  id,
  title,
  description,
  createdAt,
  onEdit,
  onDelete,
  onOpen,
  classnames,
}: TaskCardProps) => {
  const Icon = icons[icon]
  return (
    <Card
      className={`rounded-2xl shadow-sm border border-gray-200 bg-card ${classnames}`}
    >
      <CardHeader>
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="bg-secondary p-2 rounded-lg">
            {<Icon size={20} />}
          </div>
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
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Title & Description */}
        {id ? (
          <Link
            to={`/app/boards/${id}`}
            className="text-base font-semibold text-gray-900"
          >
            {title}
          </Link>
        ) : (
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        )}
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </CardContent>
      {/* Footer */}
      {createdAt && (
        <CardFooter className="bg-card">
          <p className="text-xs text-gray-400 border-gray-100">
            {formatDate(createdAt)}
          </p>
        </CardFooter>
      )}
    </Card>
  )
}

export default CustomCard
