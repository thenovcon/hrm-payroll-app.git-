'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function rankCandidate(applicationId: string) {
    try {
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                candidate: true,
                jobPosting: true
            }
        });

        if (!application) throw new Error('Application not found');

        // Mock Logic if no API Key (Safety fallback)
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not set, using mock ranking');
            const mockScore = Math.floor(Math.random() * (95 - 60) + 60);
            const mockSummary = "Candidate has strong potential based on keyword analysis. (Mock AI)";

            await prisma.application.update({
                where: { id: applicationId },
                data: {
                    aiMatchScore: mockScore,
                    aiSummary: mockSummary
                }
            });
            revalidatePath('/ats');
            return { score: mockScore, summary: mockSummary };
        }

        // Real Gemini Logic
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
            Act as an Expert Recruiter.
            Job Title: ${application.jobPosting.title}
            Job Description: ${application.jobPosting.content}
            
            Candidate Name: ${application.candidate.name}
            Candidate Resume Text (Parsed): ${application.candidate.parsedData || "No parsed data available, analyze based on general profile."}

            Output a JSON object with:
            - score: integer (0-100) representing fit.
            - summary: string (max 50 words) explaining the score.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Simple parsing (robustness would require more checks)
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(cleanedText);

        await prisma.application.update({
            where: { id: applicationId },
            data: {
                aiMatchScore: analysis.score,
                aiSummary: analysis.summary
            }
        });

        revalidatePath('/ats');
        return analysis;

    } catch (error) {
        console.error('AI Ranking Error:', error);
        throw new Error('Failed to rank candidate');
    }
}
