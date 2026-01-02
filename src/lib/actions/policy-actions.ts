
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

    await prisma.hRPolicy.create({
        data: {
            title,
            content,
            category,
            fileUrl: fileUrl || null
        }
    });

    revalidatePath('/policies');
    redirect('/policies');
}

export async function deletePolicy(id: string) {
    await prisma.hRPolicy.delete({ where: { id } });
    revalidatePath('/policies');
}
