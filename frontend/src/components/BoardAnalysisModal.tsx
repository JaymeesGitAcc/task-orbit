import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  FileText,
  Activity,
  Lightbulb,
  AlertTriangle,
  X,
} from "lucide-react"
import { getBoardAnalysis } from "@/services/board.api"
import axios from "axios"

interface BoardAnalysisData {
  projectSummary: string
  currentStatus: string
  recommendations: string[]
}

interface BoardAnalysisModalProps {
  open: boolean
  onClose: () => void
  boardId?: string
}

const BoardAnalysisModal = ({
  open,
  onClose,
  boardId,
}: BoardAnalysisModalProps) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [analysis, setAnalysis] = useState<BoardAnalysisData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadAnalysis = async () => {
    setLoading(true)
    setAnalysis(null)
    setError(null)
    try {
      const res = await getBoardAnalysis(boardId)
      if (res.data?.success) {
        setAnalysis(res.data?.data)
      } else {
        setError(res.data.message || "Failed to generate analysis.")
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError("AI analysis limit reached. Please try again later.")
          return
        }
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        )
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) onClose()
  }

  useEffect(() => {
    if (open) {
      loadAnalysis()
    } else {
      setAnalysis(null)
      setError(null)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg w-[92vw] rounded-2xl p-4 sm:p-6 gap-0 [&>button]:hidden max-h-[85vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader className="flex flex-row items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">
              Board Analysis
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Analyzing board...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm text-gray-600">{error}</p>
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : analysis ? (
          <div className="space-y-5">
            {/* Project Summary */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-semibold text-gray-800">
                  Project Summary
                </h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {analysis.projectSummary}
              </p>
            </section>

            {/* Current Status */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-semibold text-gray-800">
                  Current Status
                </h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {analysis.currentStatus}
              </p>
            </section>

            {/* Recommendations */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-green-500" />
                <h4 className="text-sm font-semibold text-gray-800">
                  Recommendations
                </h4>
              </div>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-gray-600 leading-relaxed"
                  >
                    <span className="text-indigo-500 font-medium shrink-0">
                      {i + 1}.
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <p className="text-sm text-gray-400">No analysis available.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BoardAnalysisModal
