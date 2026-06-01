import Mailgen from "mailgen"

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Task Orbit",
    link: `${process.env.EMAIL_FRONTEND_URL}`,
  },
})

export const generateVerificationEmail = (name, verificationLink) => {
  const htmlContent = mailGenerator.generate({
    body: {
      name: name,
      intro: "Welcome to TaskOrbit! 🎉",
      section: {
        title: "Verify Your Email",
        content:
          "Thank you for signing up! To complete your registration and start creating your workspace, please verify your email address by clicking the button below.",
      },
      action: {
        instructions: "Click the button below to verify your email:",
        button: {
          color: "#22C55E",
          text: "Verify Email Address",
          link: verificationLink,
        },
      },
      table: {
        data: [
          {
            item: "Verification Link Expires In",
            description: "1 hour(s)",
          },
        ],
      },
      outro: [
        "If you did not create this account, please ignore this email.",
        "If you have any questions, feel free to reach out to us.",
      ],
      signature: false,
    },
  })

  const textContent = `
Welcome to TaskOrbit!

Verify Your Email

Thank you for signing up! To complete your registration and start creating your workspace, please verify your email address by clicking the link below.

Verification Link: ${verificationLink}

Verification Link Expires In: 1 hour(s)

If you did not create this account, please ignore this email.

If you have any questions, feel free to reach out to us.

---
Column ${process.env.EMAIL_FROM}
  `.trim()

  return { htmlContent, textContent }
}

export const generatePasswordResetEmail = (name, resetLink) => {
  const htmlContent = mailGenerator.generate({
    body: {
      name: name,
      intro: "Password Reset Request",
      section: {
        title: "Reset Your Password",
        content:
          "We received a request to reset the password for your Column account. Click the button below to set a new password.",
      },
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#DC2626",
          text: "Reset Password",
          link: resetLink,
        },
      },
      table: {
        data: [
          {
            item: "Reset Link Expires In",
            description: "15 minutes",
          },
        ],
      },
      outro: [
        "If you did not request a password reset, please ignore this email and your password will remain unchanged.",
        "For security reasons, this link will expire in 15 minutes.",
      ],
      signature: false,
    },
  })

  const textContent = `
Password Reset Request

Reset Your Password

We received a request to reset the password for your Column Blog account. Click the link below to set a new password.

Reset Link: ${resetLink}

Reset Link Expires In: 15 minutes

If you did not request a password reset, please ignore this email and your password will remain unchanged.

For security reasons, this link will expire in 15 minutes.

---
Column ${process.env.EMAIL_FROM}
  `.trim()

  return { htmlContent, textContent }
}