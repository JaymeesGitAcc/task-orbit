import Logo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { features } from "@/constants/landingPageItems"
import {
  ArrowRight,
  BarChart2,
  Check,
  LayoutDashboard,
  LoaderCircle,
  LogIn,
  LogOut,
  Sparkles,
} from "lucide-react"
import dndVisual from "../assets/drag-drop-visual.webp"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import { useState } from "react"
import ResponsiveSidebar from "@/components/ResponsiveSidebar"
import FeatureCard from "@/components/FeatureCard"
import { toast } from "sonner"
// import { demoLogin } from "@/services/auth.api"

const LandingPage = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const [isDemoLogging, setIsDemoLogging] = useState(false)
  const navigate = useNavigate()
  const { user, logout, demoUserLogin } = useAuthStore()

  const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#workflow" },
  ]

  const insightsFeatures = [
    "See overdue, due today, and upcoming tasks",
    "Track tasks due this week",
    "View workload distribution at a glance",
    "Make data-driven decisions",
  ]

  const analysisFeatures = [
    "Generate project summaries",
    "Identify risks and bottlenecks",
    "Get smart recommendations",
    "Plan and execute with confidence",
  ]

  const handleDemoUserLogin = async () => {
    setIsDemoLogging(true)
    try {
      await demoUserLogin(() => navigate("/app/boards"))
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong", { position: "top-center" })
    } finally {
      setIsDemoLogging(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Navbar */}
      <div className="bg-white shadow-bottom w-full sticky top-0 shadow-xs">
        <nav className="flex justify-between items-center h-[74px] max-w-[1300px] mx-auto px-4">
          <Logo />

          <div className="hidden md:flex md:items-center md:gap-6">
            {NAV_LINKS.map((link, index) => (
              <a key={index} href={link.href} className="hover:underline">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex md:gap-2">
            {!user ? (
              <>
                <Button
                  className="p-4"
                  onClick={() => navigate("/login")}
                  variant="secondary"
                >
                  Login
                  <LogIn />
                </Button>
                <Button className="p-4" onClick={() => navigate("/signup")}>
                  Sign Up
                  <ArrowRight />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/app/boards")} className="p-4">
                  Go to Dashboard <LayoutDashboard />
                </Button>
                <Button
                  onClick={() => logout()}
                  className="p-4"
                  variant="secondary"
                >
                  Logout
                  <LogOut />
                </Button>
              </>
            )}
          </div>

          <ResponsiveSidebar
            open={openMenu}
            onOpenChange={setOpenMenu}
            className="md:hidden"
          >
            <div className="flex flex-col px-5 py-4 gap-1">
              {/* Nav Links */}
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpenMenu(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2.5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-5" />

            {/* Action Buttons */}
            <div className="flex flex-col px-5 py-4 gap-2">
              {!user ? (
                <>
                  <Button
                    className="p-4 text-xs"
                    onClick={() => navigate("/login")}
                    variant="secondary"
                  >
                    Login
                    <LogIn />
                  </Button>
                  <Button
                    className="p-4 text-xs"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                    <ArrowRight />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/app/boards")}
                    className="p-4"
                  >
                    Go to Dashboard <LayoutDashboard />
                  </Button>
                </>
              )}
            </div>
          </ResponsiveSidebar>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="flex justify-center items-center min-h-[480px] md:min-h-[560px]">
        <div className="max-w-[500px] text-center">
          <div className="flex items-center justify-center gap-2 text-sm p-2 rounded-full bg-secondary/90 mb-4 max-w-[200px] mx-auto">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-semibold text-primary">
              Organize. Plan. Achieve
            </span>
          </div>
          <div className="text-3xl md:text-5xl font-bold space-y-1">
            <h1>Organize tasks.</h1>
            <h1>Manage projects.</h1>
            <h1 className="text-primary">Stay Productive.</h1>
          </div>

          <div className="mt-4 mx-auto space-y-2">
            <div className="max-w-[300px] mx-auto">
              <p className="text-sm md:text-base/7 text-gray-500">
                TaskOrbit helps you break down work into boards, lists and tasks
                and get things done - faster.
              </p>
            </div>

            {!user ? (
              <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center">
                <Button
                  className="w-[150px] md:w-[200px] p-4 hover:bg-primary-hover md:p-5 text-xs md:text-base"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                  <ArrowRight />
                </Button>
                <Button
                  className="w-[150px] md:w-[200px] p-4 md:p-5 text-xs md:text-base bg-zinc-700 hover:bg-zinc-800"
                  disabled={isDemoLogging}
                  onClick={handleDemoUserLogin}
                >
                  {!isDemoLogging ? (
                    "Try Demo"
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400">
                      <LoaderCircle className="animate-spin" />
                      Logging in..
                    </div>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                className="w-[150px] md:w-[200px] p-4 md:p-5 mt-4 text-xs md:text-base"
                onClick={() => navigate("/app/boards")}
              >
                View Boards
                <ArrowRight />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 p-4">
        <div className="space-y-4 py-4 max-w-[1000px] mx-auto">
          <div className="text-center">
            <h1 className="text-xl md:text-3xl font-semibold">
              Everything you need to manage your work
            </h1>
          </div>

          <div className="grid md:grid-cols-4 gap-4 p-2">
            {features.map((item, index) => {
              const Icon = item.icon
              return (
                <Card
                  key={index}
                  className="flex flex-cols justify-center items-center shadow-md"
                >
                  <div className="flex items-center justify-center h-8 w-8 md:w-10 md:h-10 bg-secondary rounded-lg">
                    <Icon className="text-primary h-4 w-4 md:w-6 md:h-6" />
                  </div>
                  <CardTitle className="text-sm md:text-base">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-center text-xs p-2 md:text-sm">
                    {item.description}
                  </CardDescription>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Insights and AI analysis features */}
      <section className="bg-gray-50 min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl w-full flex flex-col items-center gap-10">
          {/* Heading */}
          <div className="text-center px-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              Smart insights.{" "}
              <span className="block sm:inline">Smarter decisions.</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
              Use insights and AI analysis to understand your projects better
              and take the right actions.
            </p>
          </div>

          {/* Cards */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <FeatureCard
              icon={<BarChart2 className="w-5 h-5 text-indigo-600" />}
              iconBg="bg-indigo-50"
              title="Board Insights"
              description="Get a clear overview of your project health with real-time insights."
              features={insightsFeatures}
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5 text-green-600" />}
              iconBg="bg-green-50"
              title="AI Analysis"
              description="Leverage AI to analyze your board and get actionable recommendations."
              features={analysisFeatures}
            />
          </div>
        </div>
      </section>

      {/* Section to show visual workflow */}
      <section className="p-8 scroll-mt-20" id="workflow">
        <h1 className="text-center text-xl md:text-3xl font-semibold my-4">
          Manage work from start to finish
        </h1>
        <div className="bg-gray-100 md:h-[350px] max-w-[1200px] mx-auto rounded-lg">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-[2] p-6 space-y-4">
              <div>
                <h1 className="text-xl md:text-3xl font-semibold">
                  Visualize Your Workflow
                </h1>
                <div className="mt-4 text-gray-700 text-sm md:text-base">
                  <p>Break projects into simple steps.</p>
                  <p>
                    Drag tasks across lists as work progresses and <br /> keep
                    your entire work aligned.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-gray-700 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 md:h-5 md:w-5 rounded bg-primary flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <span>Create Boards for different projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 md:h-5 md:w-5 rounded bg-primary flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <span>Add Lists to represent your workflow stages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 md:h-5 md:w-5 rounded bg-primary flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <span>Drag and Drop tasks to udpate progress</span>
                </div>
              </div>
            </div>
            <div className="flex-[3] p-2">
              <div className="rounded-lg overflow-hidden shadow-sm">
                <img
                  src={dndVisual}
                  alt="Drag and Drop visual"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
