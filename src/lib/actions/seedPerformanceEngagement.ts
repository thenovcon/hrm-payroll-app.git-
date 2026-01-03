'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function seedPerformanceEngagement() {
    try {
        console.log('Seeding Performance & Engagement Data...');

        // 1. Get Admin User (as the main demo user)
        const adminUser = await prisma.user.findUnique({
            where: { username: 'admin' },
            include: { employee: true }
        });

        if (!adminUser || !adminUser.employee) {
            console.error('Admin user not found. Run seed-demo.ts first.');
            return { success: false, error: 'Admin user not found' };
        }

        const adminEmpId = adminUser.employee.id;

        // 2. Get some other employees for interaction
        const otherEmployees = await prisma.employee.findMany({
            where: { id: { not: adminEmpId } },
            take: 3,
            include: { user: true }
        });

        if (otherEmployees.length === 0) {
            console.error('No other employees found.');
            return { success: false, error: 'No other employees found' };
        }

        // --- Performance Goals ---
        const existingGoals = await prisma.performanceGoal.findMany({ where: { employeeId: adminEmpId } });
        if (existingGoals.length === 0) {
            const goals = [
                {
                    title: 'Launch HRM System v1.0',
                    description: 'Successfully deploy the new HRM & Payroll system to production by Q1.',
                    employeeId: adminEmpId,
                    status: 'IN_PROGRESS',
                    progress: 85,
                    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15), // Next month
                    weight: 50
                },
                {
                    title: 'Improve Employee Satisfaction',
                    description: 'Raise the internal eNPS score by 15 points through better engagement programs.',
                    employeeId: adminEmpId,
                    status: 'NOT_STARTED',
                    progress: 0,
                    dueDate: new Date(new Date().getFullYear(), 11, 31), // End of year
                    weight: 30
                },
                {
                    title: 'Reduce Payroll Processing Time',
                    description: 'Automate tax calculations to cut processing time by 50%.',
                    employeeId: adminEmpId,
                    status: 'ACHIEVED',
                    progress: 100,
                    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                    weight: 20
                }
            ];

            for (const goal of goals) {
                await prisma.performanceGoal.create({ data: goal });
            }
            console.log('✅ Goals seeded for Admin');
        }

        // --- Feedback Received ---
        // Seeding feedback for the Admin user
        const feedbackCount = await prisma.performanceFeedback.count({ where: { employeeId: adminEmpId } });
        if (feedbackCount === 0) {
            const feedbackItems = [
                {
                    employeeId: adminEmpId,
                    providerId: otherEmployees[0].id,
                    content: 'Great leadership on the recent project deployment. The team felt very supported.',
                    rating: 5,
                    status: 'SUBMITTED',
                    type: 'PEER',
                    anonymous: false,
                    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
                },
                {
                    employeeId: adminEmpId,
                    providerId: otherEmployees[1].id,
                    content: 'Excellent strategic vision, but we could improve on communicating timelines earlier.',
                    rating: 4,
                    status: 'SUBMITTED',
                    type: 'PEER',
                    anonymous: true,
                    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
                }
            ];

            for (const item of feedbackItems) {
                await prisma.performanceFeedback.create({ data: item });
            }
            console.log('✅ Feedback seeded for Admin');
        }

        // --- Social Posts ---
        // Add more posts
        if (otherEmployees[0].user) {
            await prisma.socialPost.create({
                data: {
                    content: 'Just deployed the new Leave Management module! check it out 🚀',
                    authorId: adminUser.id,
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
                    likes: {
                        create: { userId: otherEmployees[0].user.id }
                    }
                }
            });
        }

        // --- 1:1 Sessions ---
        // Seed upcoming 1:1s for Admin (as Manager or Employee)
        const existingOneOnOnes = await prisma.oneOnOne.count({
            where: { OR: [{ managerId: adminEmpId }, { employeeId: adminEmpId }] }
        });

        if (existingOneOnOnes === 0) {
            const sessions = [
                {
                    managerId: adminEmpId, // Admin as Manager
                    employeeId: otherEmployees[0].id,
                    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
                    status: 'SCHEDULED'
                },
                {
                    managerId: adminEmpId,
                    employeeId: otherEmployees[1].id,
                    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4), // 4 days from now
                    status: 'SCHEDULED'
                }
            ];

            for (const session of sessions) {
                await prisma.oneOnOne.create({ data: session });
            }
            console.log('✅ 1:1 Sessions seeded for Admin');
        }

        revalidatePath('/performance');
        revalidatePath('/engagement');

        return { success: true };

    } catch (error) {
        console.error('Seed Error:', error);
        return { success: false, error: 'Seed failed' };
    }
}
