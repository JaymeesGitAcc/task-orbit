import Groq from "groq-sdk"

export const generateBoardAnalysis = async (prompt) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  })

  return completion.choices[0].message.content
}
