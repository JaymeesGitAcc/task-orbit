import Board from "../models/board.model.js"
import Card from "../models/card.model.js"
import List from "../models/list.model.js"
import User from "../models/user.model.js"

export const cleanupDemoUsers = async () => {
  const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const demoUsers = await User.find({
    isDemo: true,
    createdAt: { $lt: threshold },
  })

  if (!demoUsers.length) {
    console.log("No demo users to clean.")
    return
  }

  const userIds = demoUsers.map((user) => user._id)

  await Card.deleteMany({
    userId: { $in: userIds },
  })

  await List.deleteMany({
    userId: { $in: userIds },
  })

  await Board.deleteMany({
    userId: { $in: userIds },
  })

  await User.deleteMany({
    _id: { $in: userIds },
  })

  console.log(`Deleted ${userIds.length} demo users.`)
}
