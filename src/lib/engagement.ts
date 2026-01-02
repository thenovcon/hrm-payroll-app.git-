import { prisma } from '@/lib/db/prisma';

export async function getUpcomingOneOnOnes(userId: string, role: string) {
    // If Manager, find sessions where managerId = user associated employee
    // If Employee, find sessions where employeeId = user associated employee

    // First resolve employeeId
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { employee: true }
    });

    if (!user?.employeeId) return [];

    const employeeId = user.employeeId;

    return await prisma.oneOnOne.findMany({
        where: {
            OR: [
                { managerId: employeeId },
                { employeeId: employeeId }
            ],
            status: 'SCHEDULED'
        },
        include: {
            manager: { select: { firstName: true, lastName: true } },
            employee: { select: { firstName: true, lastName: true } }
        },
        orderBy: { scheduledAt: 'asc' }
    });
}

export async function createOneOnOne(data: { managerId: string, employeeId: string, scheduledAt: Date }) {
    return await prisma.oneOnOne.create({
        data: {
            managerId: data.managerId,
            employeeId: data.employeeId,
            scheduledAt: data.scheduledAt
        }
    });
}
