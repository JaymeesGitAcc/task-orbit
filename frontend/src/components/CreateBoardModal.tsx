import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { iconOptions, icons } from "@/constants/icons"

interface CreateBoardModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (data?: any) => void
  creating?: boolean
}

const CreateBoardModal = ({
  open,
  onClose,
  onSubmit,
  creating,
}: CreateBoardModalProps) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [openPopover, setOpenPopover] = useState(false)
  const [icon, setIcon] = useState("folder")

  const SelectedIcon = icons[icon]

  const handleSubmit = () => {
    if (!title.trim()) return
    setTitle("")
    setDescription("")
    onClose()
    setIcon("folder")
    onSubmit?.({ title, description, icon })
  }

  const handleClose = () => {
    setTitle("")
    setDescription("")
    onClose()
    setIcon("folder")
  }

  const handleChangeIcon = (iconName: string) => {
    setIcon(iconName)
    setOpenPopover(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0 [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Create New Board
          </DialogTitle>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            {/* Select Icon option */}
            <Popover
              open={openPopover}
              onOpenChange={(value) => {
                setOpenPopover(value)
              }}
            >
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <SelectedIcon />
                  Choose Icon{" "}
                  <ChevronDown
                    className={cn(
                      "transition-transform",
                      openPopover && "rotate-180",
                    )}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((iconName, index) => {
                    const Icon = icons[iconName]
                    return (
                      <Button
                        size="icon-sm"
                        key={index}
                        variant="outline"
                        className="hover:text-white hover:bg-primary"
                        onClick={() => handleChangeIcon(iconName)}
                      >
                        <Icon />
                      </Button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>

            {/* Board Name */}
            <Label
              htmlFor="board-name"
              className="text-sm font-medium text-gray-700"
            >
              Board Name
            </Label>
            <Input
              id="board-name"
              placeholder="e.g. Marketing Plan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Add a short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm resize-none h-24"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || creating}
              className="bg-primary hover:bg-indigo-700 text-white"
            >
              {creating ? "Creating" : "Create Board"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateBoardModal
