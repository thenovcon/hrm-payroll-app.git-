'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function getExecutiveSummary(contextData: string) {
    if (!process.env.GOOGLE_API_KEY) {
        return "AI Insights unavailable: API Key missing.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `
        You are a Senior HR Analyst for a major enterprise. 
        Based on the following data summary:
        ${contextData}

        Provide a 3-bullet point executive summary. 
        Focus on: 
        1. Financial Efficiency
        2. Operational Risks (turnover, gaps)
        3. One strategic recommendation.
        
        Use professional, decisive, executive-level language. Keep it under 100 words.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Generation Error:", error);
        return "Unable to generate insights at this time.";
    }
}
