import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarClockIcon } from "lucide-react"

interface PopupCalenderProps {
  open: boolean
  onOpen: (state: boolean) => void
  title?: string
  position?: "top" | "right" | "bottom" | "left"
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  disabled?: boolean
}

const PopupCalender = ({
  open = false,
  onOpen,
  title,
  position = "left",
  date,
  onDateChange,
  disabled = false
}: PopupCalenderProps) => {
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined)

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])
  return (
    <Popover open={open} onOpenChange={onOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-gray-700" disabled = {disabled}>
          <CalendarClockIcon />
          {title || "Open Popover"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="" side={position}>
        <Calendar
          mode="single"
          className="w-full"
          selected={date}
          onSelect={onDateChange}
          disabled={(date) => date < new Date()}
          timeZone={timeZone}
        />
        <div className="flex items-center justify-end gap-2">
          <Button
            className="bg-secondary text-primary"
            onClick={() => {
              onDateChange(undefined)
            }}
          >
            Clear
          </Button>
          <Button onClick={() => onOpen(false)}>Close</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PopupCalender
