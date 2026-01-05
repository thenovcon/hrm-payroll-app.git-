import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function main() {
    console.log('Listing available models...');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Dummy init to access client? No, need direct manager if available.
        // Actually SDK doesn't expose listModels easily on the specific client instance in some versions, 
        // but let's check if there is a generic way or use curl.

        // Using raw fetch for list models if SDK doesn't expose it easily in 'genAI' object
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('API Error:', data.error);
        } else {
            console.log('Available Models:', data.models?.map((m: any) => m.name));
        }

    } catch (error) {
        console.error('List Failed:', error);
    }
}

main();
