import cron from "node-cron"
import { cleanupDemoUsers } from "../services/demoCleanup.service.js"

cron.schedule("0 * * * *", async () => {
  console.log("Running demo cleanup...")
  await cleanupDemoUsers()
})
