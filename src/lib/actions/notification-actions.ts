'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function getNotifications(isRead = false) {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.notification.findMany({
        where: {
            userId: session.user.id,
            isRead
        },
        orderBy: { createdAt: 'desc' },
        take: 20
    });
}

export async function markAsRead(notificationId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });

    revalidatePath('/');
}

export async function markAllAsRead() {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true }
    });

    revalidatePath('/');
}

// Internal use primarily
export async function createNotification(userId: string, title: string, message: string, type = 'INFO', link?: string) {
    await prisma.notification.create({
        data: {
            userId,
            title,
            message,
            type,
            link
        }
    });
}
