'use server';

import { prisma } from '@/lib/db/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeVariance(currentTotals: any, previousTotals: any) {
    if (!process.env.GEMINI_API_KEY) {
        return "AI analysis unavailable (API Key missing). Comparison: Net Pay moved from " + previousTotals.net + " to " + currentTotals.net;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            Act as a Payroll Auditor. Analyze the variance between last month and this month's payroll.
            
            Previous Run:
            - Total Net Pay: GHS ${previousTotals.net}
            - Total Cost: GHS ${previousTotals.cost}
            - Headcount: ${previousTotals.count}
            
            Current Run (Draft):
            - Total Net Pay: GHS ${currentTotals.net}
            - Total Cost: GHS ${currentTotals.cost}
            - Headcount: ${currentTotals.count}
            
            Key Changes:
            - New Hires: ${currentTotals.newHires}
            - Departures: ${currentTotals.departures}
            - Bonus Payouts: GHS ${currentTotals.bonuses}
            
            Explain the variance in 3 bullet points. Focus on whether the increase/decrease is justified by headcount changes or one-off bonuses.
            Keep it professional and concise.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Variance Error:", error);
        return "Failed to generate AI variance report.";
    }
}
