import { GoogleGenAI } from "@google/genai"

export const generateBoardAnalysis = async (prompt) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  })

  return response.text
}
