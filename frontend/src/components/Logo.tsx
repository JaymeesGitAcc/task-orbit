import { LayoutDashboard } from "lucide-react"

const Logo = ({ showAppName = true }: { showAppName?: boolean }) => {
  return (
    <div className="flex gap-3 items-center">
      <div className="bg-primary text-white rounded-xl p-2.5">
        <LayoutDashboard className="h-4 w-4 md:h-6 md:w-6" />
      </div>
      {showAppName && <div className="text-lg md:text-xl font-semibold">TaskOrbit</div>}
    </div>
  )
}

export default Logo
