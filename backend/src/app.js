import express from "express"
import cors from "cors"
import listRoutes from "./routes/list.routes.js"
import boardRoutes from "./routes/board.routes.js"
import cardRoutes from "./routes/card.routes.js"
import authRoutes from "./routes/auth.routes.js"

const app = express()

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))

app.use(express.json())

app.get("/", (_, res) => {
  res.send("TaskOrbit API is running...")
})

app.get("/health", (_, res) => {
  res.json({status: "ok", message: "TaskOrbit is running"})
})

app.use("/api/boards", boardRoutes)
app.use("/api/lists", listRoutes)
app.use("/api/cards", cardRoutes)
app.use("/api/auth", authRoutes)

export default app
