'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function requestFeedback(targetEmployeeId: string, providerId: string, message: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    // Create a pending feedback record
    await prisma.performanceFeedback.create({
        data: {
            employeeId: targetEmployeeId,
            providerId: providerId,
            content: message, // Initial request message stored here temporarily or separate field?
            // Actually schema has `content` for the feedback itself.
            // We might need a `requestMessage` field or just assume empty content = pending.
            status: 'PENDING',
            type: 'PEER_REQUEST'
        }
    });

    // Notify provider (TODO: Notification logic)
    revalidatePath('/performance');
}

export async function submitFeedback(id: string, content: string, rating: number, anonymous = false) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    await prisma.performanceFeedback.update({
        where: { id },
        data: {
            content,
            rating,
            anonymous,
            status: 'SUBMITTED',
            updatedAt: new Date()
        }
    });

    revalidatePath('/performance');
}

export async function giveUnsolicitedFeedback(targetEmployeeId: string, content: string, rating: number, anonymous = false) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    // Find current user's employee ID
    const userEmployee = await prisma.employee.findFirst({ where: { email: session.user.email! } });
    if (!userEmployee) throw new Error('Employee record not found');

    await prisma.performanceFeedback.create({
        data: {
            employeeId: targetEmployeeId,
            providerId: userEmployee.id,
            content,
            rating,
            status: 'SUBMITTED',
            type: 'PEER',
            anonymous
        }
    });

    revalidatePath('/performance');
}

export async function getFeedbackRequests() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const userEmployee = await prisma.employee.findFirst({ where: { email: session.user.email! } });
    if (!userEmployee) return [];

    return await prisma.performanceFeedback.findMany({
        where: {
            providerId: userEmployee.id,
            status: 'PENDING'
        },
        include: {
            employee: true
        }
    });
}

export async function getReceivedFeedback() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const userEmployee = await prisma.employee.findFirst({ where: { email: session.user.email! } });
    if (!userEmployee) return [];

    return await prisma.performanceFeedback.findMany({
        where: {
            employeeId: userEmployee.id,
            status: 'SUBMITTED'
        },
        include: {
            provider: true
        },
        orderBy: { updatedAt: 'desc' }
    });
}
