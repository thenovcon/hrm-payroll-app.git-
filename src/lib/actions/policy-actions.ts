'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { generateEmbedding } from '@/lib/ai/gemini';

export async function createPolicy(title: string, content: string, category: string) {
    const session = await auth();
    const user = session?.user as any;
    if (user?.role !== 'ADMIN' && user?.role !== 'HR_MANAGER') {
        throw new Error('Unauthorized');
    }

    let embeddingStr = "[]";
    try {
        const embedding = await generateEmbedding(`${title}\n${content}`);
        embeddingStr = JSON.stringify(embedding);
    } catch (e) {
        console.error("Failed to generate embedding", e);
        // Fallback to empty or retry logic in real app
    }

    await prisma.hRPolicy.create({
        data: {
            title,
            content,
            category,
            embedding: embeddingStr
        }
    });

    revalidatePath('/policies');
}

export async function getPolicies() {
    return await prisma.hRPolicy.findMany({
        orderBy: { title: 'asc' }
    });
}

export async function deletePolicy(id: string) {
    const session = await auth();
    const user = session?.user as any;
    if (user?.role !== 'ADMIN') throw new Error('Unauthorized');

    await prisma.hRPolicy.delete({ where: { id } });
    revalidatePath('/policies');
}
