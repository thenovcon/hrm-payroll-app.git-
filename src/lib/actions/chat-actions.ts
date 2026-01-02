'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

export async function sendMessage(content: string, channel: string = 'GENERAL') {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    await prisma.chatMessage.create({
        data: {
            senderId: session.user.id,
            content,
            channel,
            isRead: false
        }
    });
}

export async function getMessages(channel: string = 'GENERAL') {
    const session = await auth();
    if (!session?.user?.id) return [];

    // Check if user has access to channel? For now GENERAL is open.
    // DEPT channels: DEPT_{ID}. Check session.user.departmentId

    const messages = await prisma.chatMessage.findMany({
        where: { channel },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
            sender: {
                select: {
                    username: true,
                    employee: { select: { firstName: true, lastName: true } }
                }
            }
        }
    });

    return messages.reverse(); // Return oldest first for chat flow
}
