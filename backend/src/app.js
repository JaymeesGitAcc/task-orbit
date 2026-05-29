import express from "express"
import cors from "cors"
import listRoutes from "./routes/list.routes.js"
import boardRoutes from "./routes/board.routes.js"
import cardRoutes from "./routes/card.routes.js"
import authRoutes from "./routes/auth.routes.js"
import { sendEmail } from "./utils/sendEmail.js"

const app = express()

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
)

app.use(express.json())

app.get("/", (_, res) => {
  res.send("TaskOrbit API is running...")
})

app.get("/health", (_, res) => {
  res.json({ status: "ok", message: "TaskOrbit is running" })
})

app.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "andrewjames31199@gmail.com",
      "Test Email from Task Orbit",
      "<h2>Email system is working 🎉</h2>",
    )

    return res.send("Test email sent!")
  } catch (error) {
    return res.status(500).send("Email failed")
  }
})

app.use("/api/boards", boardRoutes)
app.use("/api/lists", listRoutes)
app.use("/api/cards", cardRoutes)
app.use("/api/auth", authRoutes)

export default app
