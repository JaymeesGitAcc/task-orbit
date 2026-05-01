import User from "../models/user.model.js"
import { sendError, sendSuccess } from "../utils/response.js"
import { generateToken } from "../utils/token.js"

export const createUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return sendError(res, 401, "Missing Required Fields")
  }

  try {
    const user = await User.findOne({ email })

    if (user) {
      return sendError(res, 401, "User with this email already exists")
    }

    const newUser = await User.create({
      name,
      email,
      password,
    })

    return sendSuccess(res, 201, "User Created Successfully")
  } catch (error) {
    return sendError(res, 500, `createUser Error:: ${error}`)
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return sendError(res, 401, "Email and pasword is required")
  }

  try {
    const userWithEmail = await User.findOne({ email })

    if (!userWithEmail) {
      return sendError(res, 401, "Email not found")
    }

    const passwordCorrect = await userWithEmail.isPasswordCorrect(password)

    if (!passwordCorrect) {
      return sendError(res, 400, "Incorrect Password")
    }

    const token = generateToken(userWithEmail._id, userWithEmail.email)

    return sendSuccess(res, 200, "User Logged In Successfully", {
      token,
      user: {
        _id: userWithEmail._id,
        name: userWithEmail.name,
        email: userWithEmail.email,
      },
    })
  } catch (error) {
    return sendError(res, 500, `loginUser Error:: ${error.message}`)
  }
}
