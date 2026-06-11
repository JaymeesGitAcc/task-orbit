import mongoose from "mongoose"
import Board from "../models/board.model.js"
import Card from "../models/card.model.js"
import List from "../models/list.model.js"
import User from "../models/user.model.js"
import {
  generatePasswordResetEmail,
  generateVerificationEmail,
} from "../utils/emailTemplates.js"
import { sendError, sendSuccess } from "../utils/response.js"
import { sendEmail } from "../utils/sendEmail.js"
import { generateToken } from "../utils/token.js"
import crypto from "crypto"

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
      isVerified: false,
    })

    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    newUser.verificationToken = hashedToken
    newUser.verificationTokenExpires = Date.now() + 1000 * 60 * 60 // 1 hour

    await newUser.save({ validateBeforeSave: false })

    // Send verification email
    const verifyURL = `${process.env.EMAIL_FRONTEND_URL}/verify-email?token=${rawToken}`
    const { htmlContent, textContent } = generateVerificationEmail(
      newUser.name,
      verifyURL,
    )

    sendEmail(newUser.email, "Verify your email", htmlContent, textContent)

    return sendSuccess(
      res,
      201,
      "Registration successful. Please verify your email.",
      { success: true, message: "Verification link sent to your email" },
    )
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

    if (!userWithEmail.isVerified) {
      return sendError(res, 400, "Email not verified", {
        success: false,
        message: "Please Verify your email",
      })
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

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return sendError(res, 400, "Verification token is required", {
        success: false,
        message: "Verification token is required",
      })
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    })

    if (!user) {
      return sendError(res, 400, "Invalid or expired verification link", {
        success: false,
        message: "Invalid or expired verification link",
      })
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined

    await user.save()

    return sendSuccess(res, 200, "Email Verified Successfully", {
      success: true,
      message: "Email Verified Successfully",
    })
  } catch (error) {
    console.error("verifyEmail error:", error)
    return sendError(res, 500, "Unable to Verify email", {
      success: false,
    })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) return sendError(res, 400, "Email is required")

    const user = await User.findOne({ email })

    if (!user) return sendError(res, 404, "No user with that email")

    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    user.resetPasswordToken = hashedToken
    user.resetPasswordTokenExpires = Date.now() + 15 * 60 * 1000 // 15 min
    await user.save()

    const resetURL = `${process.env.EMAIL_FRONTEND_URL}/reset-password?token=${rawToken}`

    const { htmlContent, textContent } = generatePasswordResetEmail(
      user?.name,
      resetURL,
    )

    sendEmail(user.email, "Password Reset Request", htmlContent, textContent)

    return sendSuccess(res, 200, "Password reset link sent to your email", {
      success: true,
      message: "Password reset link sent to your email",
    })
  } catch (error) {
    return sendError(res, 500, error.message)
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password) return sendError(res, 400, "Password is required")

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
    })

    if (!user) return sendError(res, 400, "Invalid or expired reset link")

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpires = undefined

    await user.save()

    return sendSuccess(res, 200, "Password reset successful", {
      success: true,
      message: "Password Rest Successful",
    })
  } catch (error) {
    return sendError(res, 500, error.message, {
      success: false,
      message: "Internal Server Error",
    })
  }
}

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const userId = req.user._id

  try {
    if (!newPassword?.trim())
      return sendError(res, 401, "New Password is required", {
        success: false,
        message: "New Password to set is missing",
      })

    const user = await User.findById(userId)

    if (!user)
      return sendError(res, 404, "User Not found", {
        success: false,
        message: "User Not found",
      })

    const passwordMatching = await user.isPasswordCorrect(currentPassword)

    if (!passwordMatching)
      return sendError(res, 401, "Incorrect Password", {
        success: false,
        message: "Incorrect Password",
      })

    user.password = newPassword
    await user.save()

    return sendSuccess(res, 201, "Password changed successfully", {
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", {
      success: false,
      message: "Couldn't update password",
    })
  }
}

export const deleteUser = async (req, res) => {
  const { password } = req.body
  const userId = req.user?.id

  if (!userId) {
    return sendError(res, 401, "Unauthorized")
  }
  try {
    if (!password) return sendError(res, 401, "Password is required")

    const user = await User.findById(userId)

    if (!user) {
      return sendError(res, 404, "User not found")
    }

    const passwordMatchResult = await user.isPasswordCorrect(password)

    if (!passwordMatchResult) {
      return sendError(res, 401, "Incorrect Password")
    }

    const session = await mongoose.startSession()

    try {
      session.startTransaction()

      await Card.deleteMany({ userId }, { session })
      await List.deleteMany({ userId }, { session })
      await Board.deleteMany({ userId }, { session })
      await User.findByIdAndDelete(userId, { session })

      await session.commitTransaction()

      res.clearCookie("token")
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
    }

    return sendSuccess(res, 200, "Account deleted successfully", {
      success: true,
      message: "Account deleted successfully",
    })
  } catch (error) {
    return sendError(res, 500, "Internal Server Error", {
      success: false,
      message: "Server Error",
    })
  }
}
