import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
    const { prompt } = await req.json();

    const result = await streamText({
        model: google('gemini-1.5-pro'),
        prompt: prompt,
    });

    return result.toDataStreamResponse();
}
