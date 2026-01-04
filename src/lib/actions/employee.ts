'use server';

import { prisma } from '@/lib/db/prisma';

export async function getEmployees() {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                address: true,
                department: true,
            }
        });
        return { success: true, data: employees };
    } catch (error) {
        console.error('Failed to fetch employees:', error);
        return { success: false, error: 'Failed to fetch employees' };
    }
}
