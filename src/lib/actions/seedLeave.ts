'use server';

import { prisma } from '@/lib/db/prisma';

export async function seedLeaveTypes() {
    const types = [
        { name: 'Annual Leave', slug: 'annual', daysAllowed: 15, paid: true },
        { name: 'Sick Leave', slug: 'sick', daysAllowed: 10, paid: true },
        { name: 'Maternity Leave', slug: 'maternity', daysAllowed: 84, paid: true }, // 12 weeks
        { name: 'Paternity Leave', slug: 'paternity', daysAllowed: 5, paid: true },
        { name: 'Compassionate Leave', slug: 'compassionate', daysAllowed: 5, paid: true },
        { name: 'Study Leave', slug: 'study', daysAllowed: 0, paid: false },
        { name: 'Unpaid Leave', slug: 'unpaid', daysAllowed: 0, paid: false },
    ];

    try {
        for (const type of types) {
            await prisma.leaveType.upsert({
                where: { slug: type.slug },
                update: {},
                create: type,
            });
        }
        return { success: true };
    } catch (error) {
        console.error('Failed to seed leave types:', error);
        return { success: false, error: 'Failed to seed leave types' };
    }
}
