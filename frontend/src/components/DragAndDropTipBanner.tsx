import { useState } from "react"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TipBannerProps {
  title: string
  description: string
  onDismiss?: () => void
  className?: string
}

const DragAndDropTipBanner = ({
  title,
  description,
  onDismiss,
  className = "",
}: TipBannerProps) => {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  return (
    <div
      className={`relative space-y-2 bg-white border border-indigo-100 rounded-2xl px-4 py-3 w-full ${className}`}
    >
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-2 shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center bg-primary text-white p-2 rounded-full w-8 h-8">
          <Sparkles className="w-4 h-4 text-yellow-200" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-semibold text-primary">
            {title}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs md:text-sm text-gray-500">{description}</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          onClick={handleDismiss}
          className="bg-primary text-white text-sm rounded-lg"
        >
          Got it
        </Button>
      </div>
    </div>
  )
}

export default DragAndDropTipBanner
