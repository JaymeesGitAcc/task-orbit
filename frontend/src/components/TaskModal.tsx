import { useState, useEffect } from "react"
import { X, Plus, Tag } from "lucide-react"
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
import type { Card, LabelData } from "@/types"
import { labelColors } from "@/constants/label-colors"

interface TaskData {
  title: string
  description?: string
  labels?: LabelData[]
}

interface TaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (data: TaskData) => void
  cardData?: Card
  readOnly?: boolean
}

interface FormErrors {
  title?: string
}

const TaskModal = ({
  open,
  onClose,
  onSubmit,
  cardData,
  readOnly,
}: TaskModalProps) => {
  const isEditing = !!cardData

  const [form, setForm] = useState<TaskData>({ title: "", description: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [labels, setLabels] = useState<LabelData[]>([])
  const [labelInput, setLabelInput] = useState<LabelData>({
    text: "",
    color: labelColors[0].value,
  })

  useEffect(() => {
    if (!open) return

    if (cardData) {
      setForm({
        title: cardData.title,
        description: cardData.description || "",
      })
      setLabels(cardData.labels ?? [])
    } else {
      setForm({
        title: "",
        description: "",
      })
      setLabels([])
    }

    setLabelInput({
      text: "",
      color: labelColors[0].value,
    })

    setErrors({})
    setSubmitted(false)
  }, [open, cardData])

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

  const handleAddLabel = () => {
    if (!labelInput.text.trim()) return
    setLabels([...labels, { text: labelInput.text, color: labelInput.color }])
    setLabelInput((prev) => ({ ...prev, text: "" }))
  }

  const handleRemoveLabel = (identifier: string | number) => {
    if (typeof identifier === "string") {
      setLabels(labels.filter((l) => l._id !== identifier))
    } else {
      setLabels(labels.filter((_, i) => i !== identifier))
    }
  }

  const colorMeta = (val: string) => labelColors.find((c) => c.value === val)

  const handleSubmit = () => {
    setSubmitted(true)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const cleanedLabels = labels.map(({ _id, ...rest }) =>
      _id ? { _id, ...rest } : rest,
    )

    onSubmit?.({ ...form, labels: cleanedLabels })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0 [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {!readOnly
              ? isEditing
                ? "Update Task"
                : "Create New Task"
              : "Task Info"}
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
            {!readOnly ? (
              <Input
                id="title"
                name="title"
                placeholder="e.g. Design landing page"
                value={form.title}
                onChange={handleChange}
                className={
                  errors.title
                    ? "border-red-400 focus-visible:ring-red-300"
                    : ""
                }
              />
            ) : (
              <p className="py-2 px-2 border rounded-lg">{form.title}</p>
            )}

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
            {!readOnly ? (
              <Textarea
                id="description"
                name="description"
                placeholder="Add a short description"
                value={form.description}
                onChange={handleChange}
                className="resize-none h-24 text-sm"
              />
            ) : (
              <div className="p-2 border rounded-lg min-h-[100px]">
                {form.description}
              </div>
            )}
          </div>

          {/* Labels */}
          <div className="space-y-3 border border-gray-200 rounded-xl p-3">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Labels</span>
            </div>

            {/* Added labels */}
            {labels?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {labels.map((l, i) => (
                  <span
                    key={l._id ?? i}
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${colorMeta(l.color)?.badge ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {l.text}
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLabel(l._id ?? i)}
                        className="hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* Label input */}
            {!readOnly && (
              <div className="space-y-2">
                <Input
                  placeholder="e.g. Bug, Feature..."
                  value={labelInput.text}
                  onChange={(e) =>
                    setLabelInput({ ...labelInput, text: e.target.value })
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddLabel())
                  }
                  className="text-sm"
                />

                {/* Color swatches + Add button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {labelColors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() =>
                          setLabelInput({ ...labelInput, color: c.value })
                        }
                        className={`w-6 h-6 rounded-full ${c.bg} transition-all
                        ${
                          labelInput.color === c.value
                            ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                            : "hover:scale-110"
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddLabel}
                    disabled={!labelInput.text.trim()}
                    className="text-xs h-7 gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Label
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-600"
            >
              {!readOnly ? "Cancel" : "Close"}
            </Button>
            {!readOnly ? (
              <Button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isEditing ? "Update Task" : "Create Task"}
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskModal
