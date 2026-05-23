import { Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type DeleteType = "board" | "list" | "card"

const DELETE_COPY: Record<DeleteType, { title: string; description: string }> = {
  board: {
    title: "Delete Board",
    description:
      "Are you sure you want to delete this board? All lists and tasks inside it will be permanently removed.",
  },
  list: {
    title: "Delete List",
    description:
      "Are you sure you want to delete this list? All tasks inside it will be permanently removed.",
  },
  card: {
    title: "Delete Task",
    description:
      "Are you sure you want to delete this task? This action cannot be undone.",
  },
}

interface DeleteDialogProps {
  open: boolean
  type: DeleteType
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

const DeleteDialog = ({
  open,
  type,
  onClose,
  onConfirm,
  loading = false,
}: DeleteDialogProps) => {
  const { title, description } = DELETE_COPY[type]

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-red-100 p-2 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <DialogTitle className="text-base font-semibold text-gray-900">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="text-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog
