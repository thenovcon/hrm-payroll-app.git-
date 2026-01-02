'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

export async function saveFCMToken(token: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { fcmToken: token }
        });
        return { success: true };
    } catch (error) {
        console.error('Error saving FCM token:', error);
        return { error: 'Failed to save token' };
    }
}
