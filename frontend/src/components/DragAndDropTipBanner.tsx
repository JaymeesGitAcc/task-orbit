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
      className={`flex items-center gap-4 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 w-full ${className}`}
    >
      {/* Icon */}
      <div className="shrink-0 bg-primary text-white p-2 rounded-full">
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary">✨ {title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>

      <Button
        size="sm"
        onClick={handleDismiss}
        className="shrink-0 bg-primary text-white text-sm rounded-lg"
      >
        Got it
      </Button>

      <button
        onClick={handleDismiss}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default DragAndDropTipBanner
