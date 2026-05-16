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
import { Textarea } from "@/components/ui/textarea"
import type { UpdateCardPayload } from "@/types"

interface TaskData {
  title: string
  description: string
}

interface TaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (data: TaskData) => void
  onEdit?: (data: UpdateCardPayload) => void
  initialData?: TaskData
}

interface FormErrors {
  title?: string
}

const TaskModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: TaskModalProps) => {
  const isEditing = !!initialData

  const [form, setForm] = useState<TaskData>({ title: "", description: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  // Pre-fill form when initialData changes
  useEffect(() => {
    if (open) {
      setForm(initialData ?? { title: "", description: "" })
      setErrors({})
      setSubmitted(false)
    }
  }, [open, initialData])

  const validate = (f: TaskData): FormErrors => {
    const errs: FormErrors = {}
    if (!f.title.trim()) errs.title = "Title is required."
    return errs
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updated = { ...form, [e.target.name]: e.target.value }
    setForm(updated)
    if (submitted) setErrors(validate(updated))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onSubmit?.(form)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0 [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {isEditing ? "Update Task" : "Create New Task"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Design landing page"
              value={form.title}
              onChange={handleChange}
              className={
                errors.title ? "border-red-400 focus-visible:ring-red-300" : ""
              }
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
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
              name="description"
              placeholder="Add a short description"
              value={form.description}
              onChange={handleChange}
              className="resize-none h-24 text-sm"
            />
          </div>

          {/* Actions */}
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isEditing ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskModal
