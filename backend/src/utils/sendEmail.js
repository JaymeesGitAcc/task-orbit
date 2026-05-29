import axios from "axios"

export const sendEmail = async (to, subject, htmlContent, textContent) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        to: [{ email: to }],
        sender: {
          name: "Task Orbit",
          email: process.env.EMAIL_FROM,
        },
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    )

    console.log("Email sent via Brevo API:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo email error:", error.response?.data || error.message)
    throw error
  }
}
