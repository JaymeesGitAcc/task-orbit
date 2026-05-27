import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const CardSkeleton = ({ classnames }: { classnames?: string }) => {
  return (
    <Card
      className={`rounded-2xl shadow-sm border border-gray-200 bg-card ${classnames}`}
    >
      <CardHeader>
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <Skeleton className="w-7 h-7 rounded-md" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Title */}
        <Skeleton className="h-4 w-3/4 rounded-md" />
        {/* Description */}
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-2/3 rounded-md" />
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <Skeleton className="h-3 w-1/3 rounded-md" />
      </CardFooter>
    </Card>
  )
}

export default CardSkeleton
