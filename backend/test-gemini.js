// // test-gemini.js
import dotenv from "dotenv"

dotenv.config()

import { generateBoardAnalysis } from "./src/services/gemini.service.js";

// import { GoogleGenAI } from "@google/genai"
// import dotenv from "dotenv"

// dotenv.config()

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// })

// async function testGemini() {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: `
// Return ONLY valid JSON:

// {
//   "projectSummary": "string",
//   "currentStatus": "string",
//   "recommendations": ["string"]
// }

// Analyze a MERN project board with authentication,
// testing and deployment tasks.
// `,
//     })

//     console.log(response.text)
//   } catch (error) {
//     console.error(error)
//   }
// }

// testGemini()

const res = await generateBoardAnalysis("Explain JWT in one sentence.")

console.log(res)
