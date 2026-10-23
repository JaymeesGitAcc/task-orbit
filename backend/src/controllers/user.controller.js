import User from "../models/user.model.js"
import { sendError, sendSuccess } from "../utils/response.js"

export const getAllUsers = async (req, res) => {
  const { type } = req.query
  const types = ["all", "verified", "unverified", "demo"]

  if (!types.includes(type?.toLowerCase())) {
    return sendError(res, 400, "Invalid type", {
      success: false,
    })
  }

  try {
    let users
    if (type?.toLowerCase() === "verified") {
      users = await User.find({ isVerified: true })
    } else if (type?.toLowerCase() === "unverified") {
      users = await User.find({ isVerified: false })
    } else if (type?.toLowerCase() === "demo") {
      users = await User.find({ isDemo: true })
    } else {
      users = await User.find({})
    }
    return sendSuccess(res, 200, "Users fetched successfully", users)
  } catch (error) {
    console.log("An error while fetching users: ", error)
    return sendError(res, 500, error.message)
  }
}
