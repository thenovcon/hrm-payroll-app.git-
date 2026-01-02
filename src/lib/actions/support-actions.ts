'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function submitSupportTicket(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const priority = formData.get('priority') as string || 'MEDIUM';

    await prisma.ticket.create({
        data: {
            title: subject,
            description: message,
            type: 'SUPPORT_REQUEST',
            priority: priority,
            status: 'OPEN',
            createdById: session.user.id
        }
    });

    revalidatePath('/support/contact');
    return { success: true };
}

export async function submitBugReport(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const steps = formData.get('steps') as string;
    const expected = formData.get('expected') as string;
    const severity = formData.get('severity') as string || 'MEDIUM';

    await prisma.ticket.create({
        data: {
            title: title,
            description: description,
            type: 'BUG_REPORT',
            priority: severity, // Mapping severity to priority for now
            status: 'OPEN',
            stepsToReproduce: steps,
            expectedBehavior: expected,
            createdById: session.user.id
        }
    });

    revalidatePath('/support/bug-report');
    return { success: true };
}
