import { TooltipProvider } from "./components/ui/tooltip"
import AppRoutes from "./routes/AppRoutes"
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  return (
    <>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
      <Analytics />
    </>
  )
}

export default App
