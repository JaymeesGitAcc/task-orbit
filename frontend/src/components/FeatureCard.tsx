import { CircleCheck } from "lucide-react"

const FeatureCard = ({
  icon,
  iconBg,
  title,
  description,
  features,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  features: string[]
}) => (
  <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
      <h3 className="text-sm sm:text-base font-semibold text-gray-900">
        {title}
      </h3>
    </div>
    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
      {description}
    </p>
    <ul className="space-y-1.5 sm:space-y-2">
      {features.map((f, i) => (
        <li
          key={i}
          className="flex items-center gap-2 text-xs sm:text-sm text-gray-600"
        >
          <CircleCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 shrink-0" />
          {f}
        </li>
      ))}
    </ul>
  </div>
)

export default FeatureCard
