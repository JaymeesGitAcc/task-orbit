import { TooltipProvider } from "./components/ui/tooltip"
import AppRoutes from "./routes/AppRoutes"

const App = () => {
  return (
    <TooltipProvider>
      <AppRoutes />
    </TooltipProvider>
  )
}

export default App
