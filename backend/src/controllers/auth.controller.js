import User from "../models/user.model.js"
import { generateVerificationEmail } from "../utils/emailTemplates.js"
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
