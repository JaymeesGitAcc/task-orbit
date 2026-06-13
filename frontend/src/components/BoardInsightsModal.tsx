import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  ListChecks,
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  Layers,
  X,
} from "lucide-react"
import { getBoardInsights } from "@/services/board.api"

interface TaskPerList {
  listId: string
  listName: string
  taskCount: number
}

interface BoardInsightsData {
  boardName: string
  totalLists: number
  totalTasks: number
  overdueTasks: number
  dueToday: number
  dueThisWeek: number
  tasksPerList: TaskPerList[]
}

interface BoardInsightsModalProps {
  open: boolean
  onClose: () => void
  boardId?: string
}

const BoardInsightsModal = ({
  open,
  onClose,
  boardId,
}: BoardInsightsModalProps) => {
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<BoardInsightsData | null>(null)

  const loadInsights = async () => {
    setLoading(true)
    setInsights(null)
    const { data } = await getBoardInsights(boardId)
    if (data.success) setInsights(data.data)
    setLoading(false)
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      onClose()
    }
  }

  useEffect(() => {
    if (open) {
      loadInsights()
    } else {
      setInsights(null)
      setLoading(true)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg rounded-2xl p-6 gap-0 [&>button]:hidden"
        aria-describedby={undefined}
      >
        <DialogHeader className="flex flex-row items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Board Insights
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Fetching insights...</p>
          </div>
        ) : insights ? (
          <div className="space-y-5">
            {/* Board name */}
            <p className="text-sm text-gray-500">
              Overview for{" "}
              <span className="font-semibold text-gray-900">
                {insights.boardName}
              </span>
            </p>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard
                icon={<Layers className="w-4 h-4 text-indigo-600" />}
                label="Total Lists"
                value={insights.totalLists}
              />
              <StatCard
                icon={<ListChecks className="w-4 h-4 text-indigo-600" />}
                label="Total Tasks"
                value={insights.totalTasks}
              />
              <StatCard
                icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
                label="Overdue"
                value={insights.overdueTasks}
                accent="red"
              />
              <StatCard
                icon={<CalendarClock className="w-4 h-4 text-amber-500" />}
                label="Due Today"
                value={insights.dueToday}
                accent="amber"
              />
              <StatCard
                icon={<CalendarDays className="w-4 h-4 text-green-500" />}
                label="Due This Week"
                value={insights.dueThisWeek}
                accent="green"
              />
            </div>

            {/* Tasks per list */}
            {insights?.tasksPerList?.length ? (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Tasks per List
                </h4>
                <div className="space-y-2.5">
                  {insights.tasksPerList.map((list) => (
                    <div
                      key={list.listId}
                      className="flex items-center gap-3 justify-between"
                    >
                      <span className="text-xs md:text-sm text-gray-500 w-20">
                        {list.listName}
                      </span>
                      <span className="text-xs md:text-sm font-medium text-gray-700 w-6 text-right">
                        {list.taskCount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <p className="text-sm text-gray-400">Failed to load insights.</p>
            <Button size="sm" variant="outline" onClick={loadInsights}>
              Retry
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

const StatCard = ({
  icon,
  label,
  value,
  accent = "indigo",
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent?: "indigo" | "red" | "amber" | "green"
}) => {
  const bgMap: Record<string, string> = {
    indigo: "bg-indigo-50",
    red: "bg-red-50",
    amber: "bg-amber-50",
    green: "bg-green-50",
  }

  return (
    <div className={`flex flex-col gap-1 p-3 rounded-xl ${bgMap[accent]}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <span className="text-lg font-semibold text-gray-900">{value}</span>
    </div>
  )
}

export default BoardInsightsModal
