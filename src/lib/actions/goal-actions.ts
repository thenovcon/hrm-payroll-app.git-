'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function createGoal(data: {
    title: string;
    level: 'COMPANY' | 'DEPARTMENT' | 'UNIT' | 'EMPLOYEE';
    description?: string;
    relevance?: string;
    strategy?: string;
    dueDate?: Date;
    departmentId?: string;
    parentId?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const userEmployee = await prisma.employee.findFirst({ where: { email: session.user.email! } });

    await prisma.performanceGoal.create({
        data: {
            ...data,
            employeeId: data.level === 'EMPLOYEE' ? userEmployee?.id : undefined,
            status: 'IN_PROGRESS',
            progress: 0
        }
    });

    revalidatePath('/performance');
}

export async function updateGoalProgress(goalId: string, progress: number, note?: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    await prisma.performanceGoal.update({
        where: { id: goalId },
        data: {
            progress,
            checkins: {
                create: {
                    progressPercent: progress,
                    notes: note,
                    date: new Date()
                }
            }
        }
    });

    revalidatePath('/performance');
}

export async function getMyGoals() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const userEmployee = await prisma.employee.findFirst({ where: { email: session.user.email! } });
    if (!userEmployee) return [];

    return await prisma.performanceGoal.findMany({
        where: { employeeId: userEmployee.id },
        orderBy: { createdAt: 'desc' },
        include: {
            checkins: {
                orderBy: { date: 'desc' },
                take: 1
            }
        }
    });
}

export async function getDepartmentGoals(departmentId: string) {
    return await prisma.performanceGoal.findMany({
        where: { departmentId, level: 'DEPARTMENT' },
        include: { children: true }
    });
}
