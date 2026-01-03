'use server';

import { prisma } from '@/lib/db/prisma';
import { sendEmail } from '@/lib/email';

export async function checkAndSendFeedbackReminders() {
    try {
        const today = new Date();
        const activeCycles = await prisma.performanceCycle.findMany({
            where: {
                status: 'ACTIVE',
                endDate: { gte: today }
            },
            include: {
                feedback: {
                    where: { status: 'PENDING' },
                    include: { provider: true, employee: true }
                }
            }
        });

        const results = [];

        for (const cycle of activeCycles) {
            // Logic: Find pending feedback in active cycles
            for (const request of cycle.feedback) {
                if (request.provider.email) {
                    await sendEmail({
                        to: request.provider.email,
                        subject: `Reminder: 360 Feedback for ${request.employee.firstName}`,
                        html: `<p>Please complete your feedback for ${request.employee.firstName} before ${cycle.endDate.toDateString()}.</p>`
                    });
                    results.push({ email: request.provider.email, status: 'Sent' });
                }
            }
        }

        return { success: true, results };
    } catch (error) {
        console.error("Reminder job failed:", error);
        return { success: false, error };
    }
}
