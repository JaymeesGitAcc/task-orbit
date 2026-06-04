import { Skeleton } from "@/components/ui/skeleton"

const TaskCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
    {/* Title & menu */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-2/3 rounded-md" />
      <Skeleton className="h-4 w-4 rounded-md" />
    </div>

    {/* Description */}
    <Skeleton className="h-3 w-full rounded-md" />

    {/* Label badge */}
    <Skeleton className="h-5 w-16 rounded-full" />

    {/* Footer - Due Date */}
    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
      <Skeleton className="h-3 w-16 rounded-md" />
      <Skeleton className="h-3 w-20 rounded-md" />
    </div>
  </div>
)

const ListSkeleton = ({ classnames }: { classnames?: string }) => {
  return (
    <div className={`flex flex-col gap-3 w-[210px] md:w-[280px] ${classnames} bg-sidebar p-4 rounded-lg overflow-hidden`}>
      {/* List header */}
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-4 rounded-md" />
      </div>

      {/* Task cards */}
      <TaskCardSkeleton />
      <TaskCardSkeleton />
    </div>
  )
}

export default ListSkeleton
