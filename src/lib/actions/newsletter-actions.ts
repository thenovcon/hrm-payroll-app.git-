'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function createNewsletter(title: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    await prisma.newsletter.create({
        data: {
            title,
            content,
            status: 'PUBLISHED',
            publishedAt: new Date(),
            createdById: session.user.id
        }
    });
    revalidatePath('/engagement');
}

export async function getNewsletters() {
    return await prisma.newsletter.findMany({
        orderBy: { publishedAt: 'desc' },
        take: 10,
        include: { createdBy: { select: { username: true } } }
    });
}
