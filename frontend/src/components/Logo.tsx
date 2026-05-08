import { LayoutDashboard } from "lucide-react"

const Logo = () => {
  return (
    <div className="flex gap-3 items-center">
      <div className="bg-primary text-white rounded-xl p-2.5">
        <LayoutDashboard className="w-6 h-6" />
      </div>
      <div className="text-xl font-semibold">TaskOrbit</div>
    </div>
  )
}

export default Logo
