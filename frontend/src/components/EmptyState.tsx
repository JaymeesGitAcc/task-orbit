import { Inbox } from "lucide-react"
import { Card } from "./ui/card"

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode,
  classNames?: string
}

const EmptyState = ({
  icon = <Inbox className="w-6 h-6 text-gray-400" />,
  title = "No data found",
  description = "There's nothing here yet.",
  action,
  classNames = ""
}: EmptyStateProps) => {
  return (
    <Card className={`shadow-sm border border-gray-200 bg-card rounded-2xl ${classNames}`}>
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <div className="p-3 rounded-2xl bg-gray-50 border border-dashed border-gray-200">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <p className="text-xs text-gray-400 max-w-[180px] leading-relaxed">
          {description}
        </p>
        {action && <div className="">{action}</div>}
      </div>
    </Card>
  )
}

export default EmptyState
