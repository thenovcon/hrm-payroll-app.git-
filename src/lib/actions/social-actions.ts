'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(content: string, imageUrl?: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    await prisma.socialPost.create({
        data: {
            content,
            imageUrl,
            authorId: session.user.id
        }
    });

    revalidatePath('/engagement');
}

export async function getPosts(page = 1, limit = 10) {
    const session = await auth();
    const currentUserId = session?.user?.id;
    const skip = (page - 1) * limit;

    return await prisma.socialPost.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    employee: { select: { firstName: true, lastName: true, position: true } }
                }
            },
            _count: {
                select: { likes: true, comments: true }
            },
            likes: {
                where: { userId: currentUserId ?? '00000000-0000-0000-0000-000000000000' }
            }
        }
    });
}

export async function toggleLike(postId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const existingLike = await prisma.socialLike.findUnique({
        where: {
            postId_userId: {
                postId,
                userId: session.user.id
            }
        }
    });

    if (existingLike) {
        await prisma.socialLike.delete({ where: { id: existingLike.id } });
    } else {
        await prisma.socialLike.create({
            data: {
                postId,
                userId: session.user.id
            }
        });
    }

    revalidatePath('/engagement');
}

export async function addComment(postId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    await prisma.socialComment.create({
        data: {
            postId,
            content,
            authorId: session.user.id
        }
    });

    revalidatePath('/engagement');
}
