import type { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface ToolTippedProps {
  tooltipTrigger: ReactNode
  tooltipContent?: ReactNode
  side?: "left" | "top" | "bottom" | "right"
  children?: ReactNode,
  classNames?: string
}

const ToolTipped = ({
  tooltipTrigger,
  tooltipContent,
  side = "right",
  classNames="",
  children,
}: ToolTippedProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{tooltipTrigger}</TooltipTrigger>
      <TooltipContent side={side} className={classNames}>{children || tooltipContent}</TooltipContent>
    </Tooltip>
  )
}

export default ToolTipped
