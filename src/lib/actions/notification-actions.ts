'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function getNotifications(isRead = false) {
    const session = await auth();
    if (!session?.user?.id) return [];

    const notifications = await prisma.notification.findMany({
        where: {
            userId: session.user.id,
            isRead
        },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    // Serialize Dates specifically for Client Component props
    return JSON.parse(JSON.stringify(notifications));
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

    // TRIGGER PUSH NOTIFICATION (FCM)
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { fcmToken: true }
        });

        if (user?.fcmToken) {
            // Lazy load admin to avoid init issues if not configured
            const { adminMessaging } = await import('@/lib/firebase-admin');

            await adminMessaging.send({
                token: user.fcmToken,
                notification: {
                    title,
                    body: message,
                },
                webpush: {
                    fcmOptions: {
                        link: link ?? '/'
                    }
                },
                data: {
                    url: link ?? '/'
                }
            });
        }
    } catch (error) {
        console.error("FCM Push Error:", error);
    }
}
