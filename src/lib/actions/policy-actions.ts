
'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getPolicies() {
    return await prisma.hRPolicy.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function createPolicy(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const fileUrl = formData.get('fileUrl') as string; // from FileUpload

    if (!title || !content || !category) {
        throw new Error('Missing required fields');
    }

    const { generateEmbedding } = await import('@/lib/ai/gemini');
    const { upsertDocument } = await import('@/lib/ai/vector-store');

    const policy = await prisma.hRPolicy.create({
        data: {
            title,
            content,
            category,
            fileUrl: fileUrl || null
        }
    });

    // Generate Embedding and Upsert to Vector Store (Async/Fire-and-forget optional but we await for safety)
    try {
        const textToEmbed = `${title}: ${content}`;
        const embedding = await generateEmbedding(textToEmbed);

        // Save to DB (JSON Fallback)
        await prisma.hRPolicy.update({
            where: { id: policy.id },
            data: { embedding: JSON.stringify(embedding) }
        });

        // Upsert to Pinecone
        await upsertDocument(policy.id, content, embedding, { title, category });
    } catch (e) {
        console.error("Vector Store Sync Error:", e);
    }

    revalidatePath('/policies');
    redirect('/policies');
}

export async function deletePolicy(id: string) {
    await prisma.hRPolicy.delete({ where: { id } });
    revalidatePath('/policies');
}
