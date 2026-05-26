import { useState, useEffect } from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ListModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (data: { title: string }) => void
  inProgress?: boolean 
}

const ListModal = ({ open, onClose, onSubmit, inProgress = false }: ListModalProps) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle("")
      setError("")
      setSubmitted(false)
    }
  }, [open])

  const validate = (val: string) => {
    if (!val.trim()) return "Title is required."
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (submitted) setError(validate(e.target.value))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const err = validate(title)
    setError(err)
    if (err) return
    onSubmit?.({ title })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0 [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Create New List
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. To Do, In Progress..."
              value={title}
              onChange={handleChange}
              className={
                error ? "border-red-400 focus-visible:ring-red-300" : ""
              }
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary text-white"
              disabled={inProgress}
            >
              {inProgress ? "Creating" : "Create List"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ListModal
