
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

// Initialize Google Generative AI
// Logic to handle missing key gracefully (though we expect it now)
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateContent(prompt: string) {
    if (!genAI) throw new Error("Google API Key not configured");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

export async function generateEmbedding(text: string): Promise<number[]> {
    if (!genAI) throw new Error("Google API Key not configured");
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding.values;
}
